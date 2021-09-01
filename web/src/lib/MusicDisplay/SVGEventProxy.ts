import { throttle } from 'lodash';
import { BackendType, PointF2D, SvgVexFlowBackend, VexFlowBackend } from 'opensheetmusicdisplay';
import { Duration } from '../../util/Duration';
import { InternalMusicDisplay } from './InternalMusicDisplay';
import { VoiceSeeker } from './VoiceSeeker';

// Narrow down supported events.
type SVGEventNames = keyof Pick<
  SVGElementEventMap,
  'click' | 'touchstart' | 'touchmove' | 'touchend' | 'mousedown' | 'mousemove' | 'mouseup'
>;

type SVGElementEvent<N extends SVGEventNames> = SVGElementEventMap[N];

type SVGEventHandler<N extends SVGEventNames = SVGEventNames> = (event: SVGElementEvent<N>) => void;

type Positional = { clientX: number; clientY: number };

const POINTER_MOVE_THROTTLE_DURATION = Duration.ms(50);

const isSvgBackend = (backend: VexFlowBackend | undefined): backend is SvgVexFlowBackend => {
  return !!backend && backend.getOSMDBackendType() === BackendType.SVG;
};

export class SVGEventProxy {
  static install(imd: InternalMusicDisplay, voiceSeeker: VoiceSeeker, eventNames: SVGEventNames[]) {
    const backend = imd.Drawer.Backends[0];
    if (!isSvgBackend(backend)) {
      throw new Error('expected the first backend to be an svg backend');
    }
    const svg = backend.getSvgElement();
    const svgEventProxy = new SVGEventProxy(svg, imd, voiceSeeker);
    svgEventProxy.install(eventNames);
    return svgEventProxy;
  }

  private svg: SVGElement;
  private imd: InternalMusicDisplay;
  private voiceSeeker: VoiceSeeker;

  private eventListeners: Array<[string, (...args: any[]) => void]> = [];

  private constructor(svg: SVGElement, imd: InternalMusicDisplay, voiceSeeker: VoiceSeeker) {
    this.svg = svg;
    this.imd = imd;
    this.voiceSeeker = voiceSeeker;
  }

  uninstall() {
    for (const eventListener of this.eventListeners) {
      this.svg.removeEventListener(...eventListener);
    }
    this.eventListeners = [];
  }

  private install(eventNames: SVGEventNames[]) {
    for (const eventName of eventNames) {
      this.addEventListener(eventName);
    }
  }

  private addEventListener(eventName: SVGEventNames) {
    const listen = <T extends SVGEventNames>(
      eventName: T,
      eventHandler: SVGEventHandler<T>,
      options?: AddEventListenerOptions
    ) => {
      this.eventListeners.push([eventName, eventHandler]);
      this.svg.addEventListener(eventName, eventHandler, options);
    };

    switch (eventName) {
      case 'click':
        return listen(eventName, this.onClick.bind(this));
      case 'touchstart':
        return listen(eventName, this.onTouchStart.bind(this), { passive: true });
      case 'touchmove':
        return listen(eventName, this.onTouchMove.bind(this), { passive: true });
      case 'touchend':
        return listen(eventName, this.onTouchEnd.bind(this), { passive: true });
      case 'mousedown':
        return listen(eventName, this.onMouseDown.bind(this));
      case 'mousemove':
        return listen(eventName, this.onMouseMove.bind(this));
      case 'mouseup':
        return listen(eventName, this.onMouseUp.bind(this));
      default:
        throw new Error(`no event handler for event: ${eventName}`);
    }
  }

  private onClick(event: SVGElementEvent<'click'>) {
    this.imd.eventBus.dispatch('click', event);

    const seekResult = this.getSeekResult(event);
    if (seekResult.voicePointer) {
      this.imd.eventBus.dispatch('voicepointerclicked', {
        voicePointer: seekResult.voicePointer,
        timeMs: seekResult.timeMs,
      });
    }
  }

  private onTouchStart(event: SVGElementEvent<'touchstart'>) {
    this.imd.eventBus.dispatch('touchstart', event);
  }

  private onTouchMove = throttle(
    (event: SVGElementEvent<'touchmove'>) => {
      this.imd.eventBus.dispatch('touchmove', event);

      const touch = event.touches.item(0);
      if (!touch) {
        return;
      }

      console.log(this.getSvgPos(touch));
    },
    POINTER_MOVE_THROTTLE_DURATION.ms,
    { leading: true, trailing: true }
  );

  private onTouchEnd(event: SVGElementEvent<'touchend'>) {
    this.imd.eventBus.dispatch('touchend', event);
  }

  private onMouseDown(event: SVGElementEvent<'mousedown'>) {
    this.imd.eventBus.dispatch('mousedown', event);
  }

  private onMouseMove = throttle(
    (event: SVGElementEvent<'mousemove'>) => {
      this.imd.eventBus.dispatch('mousemove', event);

      const seekResult = this.getSeekResult(event);

      if (seekResult.voicePointer) {
        this.imd.eventBus.dispatch('voicepointerhovered', {
          voicePointer: seekResult.voicePointer,
          timeMs: seekResult.timeMs,
        });
      }
    },
    POINTER_MOVE_THROTTLE_DURATION.ms,
    { leading: true, trailing: true }
  );

  private onMouseUp(event: SVGElementEvent<'mouseup'>) {
    this.imd.eventBus.dispatch('mouseup', event);
  }

  private getSeekResult(positional: Positional) {
    const { x, y } = this.getSvgPos(positional);
    return this.voiceSeeker.seekByPosition(x, y);
  }

  private getSvgPos(positional: Positional) {
    const pos = new PointF2D(positional.clientX, positional.clientY);
    const { x, y } = this.imd.GraphicSheet.domToSvg(pos);
    return { x, y };
  }
}
