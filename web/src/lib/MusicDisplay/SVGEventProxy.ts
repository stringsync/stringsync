import { throttle } from 'lodash';
import { BackendType, PointF2D, SvgVexFlowBackend, VexFlowBackend } from 'opensheetmusicdisplay';
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
    const listen = <T extends SVGEventNames>(eventName: T, eventHandler: SVGEventHandler<T>) => {
      this.eventListeners.push([eventName, eventHandler]);
      this.svg.addEventListener(eventName, eventHandler);
    };

    switch (eventName) {
      case 'click':
        return listen(eventName, this.onClick.bind(this));
      case 'touchstart':
        return listen(eventName, this.onTouchStart.bind(this));
      case 'touchmove':
        return listen(eventName, this.onTouchMove.bind(this));
      case 'touchend':
        return listen(eventName, this.onTouchEnd.bind(this));
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
    const seekResult = this.getSeekResult(event);

    if (seekResult.voicePointer) {
      this.imd.eventBus.dispatch('voicepointerclicked', {
        src: event,
        voicePointer: seekResult.voicePointer,
        timeMs: seekResult.timeMs,
      });
    }
  }

  private onTouchStart(event: SVGElementEvent<'touchstart'>) {}

  private onTouchMove(event: SVGElementEvent<'touchmove'>) {
    const touch = event.touches.item(0);
    if (!touch) {
      return;
    }

    console.log(this.getSvgPos(touch));
  }

  private onTouchEnd(event: SVGElementEvent<'touchend'>) {}

  private onMouseDown(event: SVGElementEvent<'mousedown'>) {}

  private onMouseMove = throttle(
    (event: SVGElementEvent<'mousemove'>) => {
      const seekResult = this.getSeekResult(event);

      if (seekResult.voicePointer) {
        this.imd.eventBus.dispatch('voicepointerhovered', {
          src: event,
          voicePointer: seekResult.voicePointer,
          timeMs: seekResult.timeMs,
        });
      }
    },
    50,
    { leading: true, trailing: true }
  );

  private onMouseUp(event: SVGElementEvent<'mouseup'>) {}

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
