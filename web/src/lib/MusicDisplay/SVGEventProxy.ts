import $ from 'jquery';
import { first, isEqual, sortBy, throttle } from 'lodash';
import { BackendType, PointF2D, SvgVexFlowBackend, VexFlowBackend } from 'opensheetmusicdisplay';
import { SupportedSVGEventNames } from '.';
import { Duration } from '../../util/Duration';
import { InternalMusicDisplay } from './InternalMusicDisplay';
import { MusicDisplayLocator } from './MusicDisplayLocator';
import { pointer, PointerTarget, PointerTargetType } from './pointer';
import { PointerService } from './pointer/pointer';
import { LocatorTargetType, SVGSettings } from './types';

type SVGElementEvent<N extends SupportedSVGEventNames> = SVGElementEventMap[N];

type Positional = { clientX: number; clientY: number; pageX: number; pageY: number };

const POINTER_MOVE_THROTTLE_DURATION = Duration.ms(30);

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
    const pointerService = pointer.createService(imd.eventBus);
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
  private pageX = 0;
  private pageY = 0;

  private onPointerActiveHandle = Symbol();
  private onPointerIdleHandle = Symbol();
  private onInteractableMovedHandle = Symbol();

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
    this.imd.eventBus.unsubscribe(this.onInteractableMovedHandle, this.onPointerIdleHandle, this.onPointerActiveHandle);

    for (const [el, eventName, eventHandler] of this.eventListeners) {
      el.removeEventListener(eventName, eventHandler);
    }
    this.eventListeners = [];
  }

  private install() {
    for (const eventName of this.svgSettings.eventNames) {
      this.addEventListener(eventName);
    }

    // When the user is not interacting with the SVG, send a ping signal to refresh the hover target in case
    // something that is not user-controlled moves under the pointer.
    this.onPointerIdleHandle = this.imd.eventBus.subscribe('pointeridle', () => {
      // Avoid over-subscribing to the event
      this.imd.eventBus.unsubscribe(this.onInteractableMovedHandle);

      let prevPointerTarget: PointerTarget = {
        type: PointerTargetType.None,
        position: { x: 0, y: 0, relX: 0, relY: 0 },
      };
      this.onInteractableMovedHandle = this.imd.eventBus.subscribe('interactablemoved', () => {
        const pointerTarget = this.getPointerTarget({
          clientX: this.clientX,
          clientY: this.clientY,
          pageX: this.pageX,
          pageY: this.pageY,
        });

        // Avoid slamming the pointer service if the pointer target did not change
        if (!isEqual(pointerTarget, prevPointerTarget)) {
          this.pointerService.send(pointer.events.ping(pointerTarget));
        }

        prevPointerTarget = pointerTarget;
      });
    });

    this.onPointerActiveHandle = this.imd.eventBus.subscribe('pointeractive', () => {
      this.imd.eventBus.unsubscribe(this.onInteractableMovedHandle);
    });
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
    this.pointerService.send(pointer.events.down(pointerTarget));
  }

  private onTouchMove = throttle(
    (event: SVGElementEvent<'touchmove'>) => {
      const touch = event.touches.item(0);
      if (!touch) {
        return;
      }
      this.updatePos(touch);
      const pointerTarget = this.getPointerTarget(touch);
      this.pointerService.send(pointer.events.move(pointerTarget));
    },
    POINTER_MOVE_THROTTLE_DURATION.ms,
    { leading: true, trailing: true }
  );

  private onTouchEnd(event: SVGElementEvent<'touchend'>) {
    const touch = event.touches.item(0);
    if (!touch) {
      return;
    }
    const pointerTarget = this.getPointerTarget(touch);
    this.pointerService.send(pointer.events.up(pointerTarget));
  }

  private onMouseDown(event: SVGElementEvent<'mousedown'>) {
    const pointerTarget = this.getPointerTarget(event);
    this.pointerService.send(pointer.events.down(pointerTarget));
  }

  private onMouseMove = throttle(
    (event: SVGElementEvent<'mousemove'>) => {
      this.getRelPos(event);

      this.updatePos(event);
      const pointerTarget = this.getPointerTarget(event);
      this.pointerService.send(pointer.events.move(pointerTarget));
    },
    POINTER_MOVE_THROTTLE_DURATION.ms,
    { leading: true, trailing: true }
  );

  private onMouseUp(event: SVGElementEvent<'mouseup'>) {
    const pointerTarget = this.getPointerTarget(event);
    this.pointerService.send(pointer.events.up(pointerTarget));
  }

  private getPointerTarget(positional: Positional): PointerTarget {
    const locateResult = this.getLocateResult(positional);
    const { relX, relY } = this.getRelPos(positional);

    const mostImportantLocateResultTarget = first(
      sortBy(locateResult.targets, (target) => LOCATOR_TARGET_SORT_WEIGHTS[target.type] ?? Number.MAX_SAFE_INTEGER)
    )!;

    if (mostImportantLocateResultTarget && mostImportantLocateResultTarget.type === LocatorTargetType.Cursor) {
      return {
        type: PointerTargetType.Cursor,
        cursor: mostImportantLocateResultTarget.cursor,
        timeMs: locateResult.timeMs,
        position: { x: locateResult.x, y: locateResult.y, relX, relY },
      };
    }
    if (locateResult.cursorSnapshot) {
      return {
        type: PointerTargetType.CursorSnapshot,
        cursorSnapshot: locateResult.cursorSnapshot,
        timeMs: locateResult.timeMs,
        position: { x: locateResult.x, y: locateResult.y, relX, relY },
      };
    }
    return { type: PointerTargetType.None, position: { x: locateResult.x, y: locateResult.y, relX, relY } };
  }

  private getRelPos(positional: Positional) {
    const parent = this.imd.scrollContainer;
    const child = this.svg;

    const parentOffset = $(parent).offset();
    if (!parentOffset) {
      throw new Error(`could not get offset for parent: ${parent}`);
    }

    const childOffset = $(child).offset();
    if (!childOffset) {
      throw new Error(`could not get offset for child: ${child}`);
    }

    const underlapOffsetLeft = Math.min(0, parentOffset.left - childOffset.left);
    const underlapOffsetTop = Math.min(0, parentOffset.top - childOffset.top);

    const relX = Math.max(0, positional.pageX - parentOffset.left + underlapOffsetLeft);
    const relY = Math.max(0, positional.pageY - parentOffset.top + underlapOffsetTop);

    return { relX, relY };
  }

  private updatePos(positional: Positional) {
    this.clientX = positional.clientX;
    this.clientY = positional.clientY;
    this.pageX = positional.pageX;
    this.pageY = positional.pageY;
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
