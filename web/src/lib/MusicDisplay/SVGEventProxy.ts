import { first, isEqual, sortBy, throttle } from 'lodash';
import { BackendType, PointF2D, SvgVexFlowBackend, VexFlowBackend } from 'opensheetmusicdisplay';
import { SupportedSVGEventNames } from '.';
import { Duration } from '../../util/Duration';
import { InternalMusicDisplay } from './InternalMusicDisplay';
import { MusicDisplayLocator } from './MusicDisplayLocator';
import { createPointerService, pointerModel, PointerService, PointerTarget, PointerTargetType } from './pointerMachine';
import { LocatorTargetType, SVGSettings } from './types';

type SVGElementEvent<N extends SupportedSVGEventNames> = SVGElementEventMap[N];

type Positional = { clientX: number; clientY: number };

const POINTER_MOVE_THROTTLE_DURATION = Duration.ms(30);

const PING_INTERVAL_DURATION = Duration.ms(100);

const LOCATOR_TARGET_SORT_WEIGHTS = {
  [LocatorTargetType.Cursor]: 0,
  [LocatorTargetType.Note]: 1,
  [LocatorTargetType.None]: 2,
};

const isSvgBackend = (backend: VexFlowBackend | undefined): backend is SvgVexFlowBackend => {
  return !!backend && backend.getOSMDBackendType() === BackendType.SVG;
};

export class SVGEventProxy {
  static install(imd: InternalMusicDisplay, locator: MusicDisplayLocator, svgSettings: SVGSettings) {
    const backend = imd.Drawer.Backends[0];
    if (!isSvgBackend(backend)) {
      throw new Error('expected the first backend to be an svg backend');
    }
    const svg = backend.getSvgElement();
    const pointerService = createPointerService(imd.eventBus);
    const svgEventProxy = new SVGEventProxy(svg, imd, locator, pointerService, svgSettings);
    svgEventProxy.install();
    return svgEventProxy;
  }

  svg: SVGElement;
  private imd: InternalMusicDisplay;
  private locator: MusicDisplayLocator;
  private svgSettings: SVGSettings;
  private pointerService: PointerService;

  private clientX = 0;
  private clientY = 0;

  private onPointerActiveHandle = Symbol();
  private onPointerIdleHandle = Symbol();
  private pingHandle = 0;

  private eventListeners: Array<[Element | Document, string, (...args: any[]) => void]> = [];

  private constructor(
    svg: SVGElement,
    imd: InternalMusicDisplay,
    locator: MusicDisplayLocator,
    pointerService: PointerService,
    svgSettings: SVGSettings
  ) {
    this.svg = svg;
    this.imd = imd;
    this.locator = locator;
    this.pointerService = pointerService;
    this.svgSettings = svgSettings;
  }

  uninstall() {
    clearInterval(this.pingHandle);
    this.imd.eventBus.unsubscribe(this.onPointerIdleHandle);
    this.imd.eventBus.unsubscribe(this.onPointerActiveHandle);

    for (const [el, eventName, eventHandler] of this.eventListeners) {
      el.removeEventListener(eventName, eventHandler);
    }
    this.eventListeners = [];
  }

  private install() {
    // When the user is not interacting with the SVG, send a ping signal to refresh the hover target in case
    // something that is not user-controlled moves under the pointer.
    this.onPointerIdleHandle = this.imd.eventBus.subscribe('pointeridle', () => {
      window.clearInterval(this.pingHandle);

      let prevPointerTarget: PointerTarget = { type: PointerTargetType.None };
      this.pingHandle = window.setInterval(() => {
        const pointerTarget = this.getPointerTarget({ clientX: this.clientX, clientY: this.clientY });

        // Avoid slamming the pointer service if the pointer target did not change
        if (!isEqual(pointerTarget, prevPointerTarget)) {
          this.pointerService.send(pointerModel.events.ping(pointerTarget));
        }

        prevPointerTarget = pointerTarget;
      }, PING_INTERVAL_DURATION.ms);
    });

    this.onPointerActiveHandle = this.imd.eventBus.subscribe('pointeractive', () => {
      window.clearInterval(this.pingHandle);
    });

    for (const eventName of this.svgSettings.eventNames) {
      this.addEventListener(eventName);
    }
  }

  private addEventListener(eventName: SupportedSVGEventNames) {
    const add = (
      el: Element | Document,
      eventName: string,
      eventHandler: (...args: any[]) => void,
      options?: AddEventListenerOptions
    ) => {
      this.eventListeners.push([el, eventName, eventHandler]);
      el.addEventListener(eventName, eventHandler, options);
    };

    switch (eventName) {
      case 'touchstart':
        return add(this.svg, eventName, this.onTouchStart.bind(this), { passive: true });
      case 'touchmove':
        return add(this.svg, eventName, this.onTouchMove.bind(this), { passive: true });
      case 'touchend':
        return add(this.svg, eventName, this.onTouchEnd.bind(this), { passive: true });
      case 'mousedown':
        return add(this.svg, eventName, this.onMouseDown.bind(this));
      case 'mousemove':
        return add(this.svg, eventName, this.onMouseMove.bind(this));
      case 'mouseup':
        return add(window.document, eventName, this.onMouseUp.bind(this));
      default:
        throw new Error(`no event handler for event: ${eventName}`);
    }
  }

  private onTouchStart(event: SVGElementEvent<'touchstart'>) {
    const touch = event.touches.item(0);
    if (!touch) {
      return;
    }
    const pointerTarget = this.getPointerTarget(touch);
    this.pointerService.send(pointerModel.events.down(pointerTarget));
  }

  private onTouchMove = throttle(
    (event: SVGElementEvent<'touchmove'>) => {
      const touch = event.touches.item(0);
      if (!touch) {
        return;
      }
      this.updatePos(touch);
      const pointerTarget = this.getPointerTarget(touch);
      this.pointerService.send(pointerModel.events.move(pointerTarget));
    },
    POINTER_MOVE_THROTTLE_DURATION.ms,
    {
      leading: true,
      trailing: true,
    }
  );

  private onTouchEnd(event: SVGElementEvent<'touchend'>) {
    const touch = event.touches.item(0);
    if (!touch) {
      return;
    }
    const pointerTarget = this.getPointerTarget(touch);
    this.pointerService.send(pointerModel.events.up(pointerTarget));
  }

  private onMouseDown(event: SVGElementEvent<'mousedown'>) {
    const pointerTarget = this.getPointerTarget(event);
    this.pointerService.send(pointerModel.events.down(pointerTarget));
  }

  private onMouseMove = throttle(
    (event: SVGElementEvent<'mousemove'>) => {
      this.updatePos(event);
      const pointerTarget = this.getPointerTarget(event);
      this.pointerService.send(pointerModel.events.move(pointerTarget));
    },
    POINTER_MOVE_THROTTLE_DURATION.ms,
    {
      leading: true,
      trailing: true,
    }
  );

  private onMouseUp(event: SVGElementEvent<'mouseup'>) {
    const pointerTarget = this.getPointerTarget(event);
    this.pointerService.send(pointerModel.events.up(pointerTarget));
  }

  private getPointerTarget(positional: Positional): PointerTarget {
    const locateResult = this.getLocateResult(positional);

    const mostImportantLocateResultTarget = first(
      sortBy(locateResult.targets, (target) => LOCATOR_TARGET_SORT_WEIGHTS[target.type] ?? Number.MAX_SAFE_INTEGER)
    )!;

    if (mostImportantLocateResultTarget && mostImportantLocateResultTarget.type === LocatorTargetType.Cursor) {
      return {
        type: PointerTargetType.Cursor,
        cursor: mostImportantLocateResultTarget.cursor,
        timeMs: locateResult.timeMs,
      };
    }
    if (locateResult.cursorSnapshot) {
      return {
        type: PointerTargetType.CursorSnapshot,
        cursorSnapshot: locateResult.cursorSnapshot,
        timeMs: locateResult.timeMs,
      };
    }
    return { type: PointerTargetType.None };
  }

  private updatePos(positional: Positional) {
    this.clientX = positional.clientX;
    this.clientY = positional.clientY;
  }

  private getLocateResult(positional: Positional) {
    const { x, y } = this.getSvgPos(positional);
    return this.locator.locateByPosition(x, y);
  }

  private getSvgPos(positional: Positional) {
    if (!this.imd.GraphicSheet) {
      return { x: 0, y: 0 };
    }
    const pos = new PointF2D(positional.clientX, positional.clientY);
    const { x, y } = this.imd.GraphicSheet.domToSvg(pos);
    return { x, y };
  }
}
