import { throttle } from 'lodash';
import { BackendType, PointF2D, SvgVexFlowBackend, VexFlowBackend } from 'opensheetmusicdisplay';
import { CursorWrapper, LocateResult, LocatorTargetType } from '.';
import { Duration } from '../../util/Duration';
import { InternalMusicDisplay } from './InternalMusicDisplay';
import { MusicDisplayLocator } from './MusicDisplayLocator';
import { createPointerService, pointerModel, PointerService, PointerTargetType } from './pointerMachine';

// Narrow down supported events.
type SVGEventNames = keyof Pick<
  SVGElementEventMap,
  'touchstart' | 'touchmove' | 'touchend' | 'mousedown' | 'mousemove' | 'mouseup'
>;

type SVGElementEvent<N extends SVGEventNames> = SVGElementEventMap[N];

type Positional = { clientX: number; clientY: number };

const POINTER_MOVE_THROTTLE_DURATION = Duration.ms(30);

const isSvgBackend = (backend: VexFlowBackend | undefined): backend is SvgVexFlowBackend => {
  return !!backend && backend.getOSMDBackendType() === BackendType.SVG;
};

export class SVGEventProxy {
  static install(imd: InternalMusicDisplay, locator: MusicDisplayLocator, eventNames: SVGEventNames[]) {
    const backend = imd.Drawer.Backends[0];
    if (!isSvgBackend(backend)) {
      throw new Error('expected the first backend to be an svg backend');
    }
    const svg = backend.getSvgElement();
    const pointerService = createPointerService(imd.eventBus);
    const svgEventProxy = new SVGEventProxy(svg, imd, locator, pointerService);
    svgEventProxy.install(eventNames);
    return svgEventProxy;
  }

  svg: SVGElement;
  private imd: InternalMusicDisplay;
  private locator: MusicDisplayLocator;
  private pointerService: PointerService;

  private eventListeners: Array<[Element | Document, string, (...args: any[]) => void]> = [];

  private constructor(
    svg: SVGElement,
    imd: InternalMusicDisplay,
    locator: MusicDisplayLocator,
    pointerService: PointerService
  ) {
    this.svg = svg;
    this.imd = imd;
    this.locator = locator;
    this.pointerService = pointerService;
  }

  uninstall() {
    for (const [el, eventName, eventHandler] of this.eventListeners) {
      el.removeEventListener(eventName, eventHandler);
    }
    this.eventListeners = [];
  }

  private install(eventNames: SVGEventNames[]) {
    for (const eventName of eventNames) {
      this.addEventListener(eventName);
    }
  }

  private addEventListener(eventName: SVGEventNames) {
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

    const locateResult = this.getLocateResult(touch);
    const cursor = this.getCursor(locateResult);
    if (cursor) {
      this.pointerService.send(pointerModel.events.down({ type: PointerTargetType.Cursor, cursor }));
    } else {
      this.pointerService.send(pointerModel.events.down({ type: PointerTargetType.None }));
    }
  }

  private onTouchMove = throttle(
    (event: SVGElementEvent<'touchmove'>) => {
      const touch = event.touches.item(0);
      if (!touch) {
        return;
      }

      const locateResult = this.getLocateResult(touch);
      const cursor = this.getCursor(locateResult);
      if (cursor) {
        this.pointerService.send(pointerModel.events.move({ type: PointerTargetType.Cursor, cursor }));
      } else {
        this.pointerService.send(pointerModel.events.move({ type: PointerTargetType.None }));
      }
    },
    POINTER_MOVE_THROTTLE_DURATION.ms,
    {
      leading: true,
      trailing: true,
    }
  );

  private onTouchEnd(event: SVGElementEvent<'touchend'>) {
    this.pointerService.send(pointerModel.events.up());
  }

  private onMouseDown(event: SVGElementEvent<'mousedown'>) {
    const locateResult = this.getLocateResult(event);
    const cursor = this.getCursor(locateResult);
    if (cursor) {
      this.pointerService.send(pointerModel.events.down({ type: PointerTargetType.Cursor, cursor }));
    } else {
      this.pointerService.send(pointerModel.events.down({ type: PointerTargetType.None }));
    }
  }

  private onMouseMove = throttle(
    (event: SVGElementEvent<'mousemove'>) => {
      const locateResult = this.getLocateResult(event);
      const cursor = this.getCursor(locateResult);
      if (cursor) {
        this.pointerService.send(pointerModel.events.move({ type: PointerTargetType.Cursor, cursor }));
      } else {
        this.pointerService.send(pointerModel.events.move({ type: PointerTargetType.None }));
      }
    },
    POINTER_MOVE_THROTTLE_DURATION.ms,
    {
      leading: true,
      trailing: true,
    }
  );

  private onMouseUp(event: SVGElementEvent<'mouseup'>) {
    this.pointerService.send(pointerModel.events.up());
  }

  private getCursor(locateResult: LocateResult): CursorWrapper | null {
    for (const target of locateResult.targets) {
      if (target.type === LocatorTargetType.Cursor) {
        return target.cursor;
      }
    }
    return null;
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
