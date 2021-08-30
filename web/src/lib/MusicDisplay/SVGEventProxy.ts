import { BackendType, PointF2D, SvgVexFlowBackend, VexFlowBackend } from 'opensheetmusicdisplay';
import { InternalMusicDisplay } from './InternalMusicDisplay';
import { VoiceSeeker } from './VoiceSeeker';

// Narrow down supported events.
type SVGEventNames = keyof Pick<SVGElementEventMap, 'click' | 'mouseover' | 'drag'>;

type SVGElementEvent<N extends SVGEventNames> = SVGElementEventMap[N];

type SVGEventHandler<N extends SVGEventNames = SVGEventNames> = (event: SVGElementEvent<N>) => void;

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

  private eventListeners: Array<[SVGEventNames, SVGEventHandler]> = [];

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
      const eventHandler = this.getEventHandler(eventName).bind(this);
      this.eventListeners.push([eventName, eventHandler]);
      this.svg.addEventListener(eventName, eventHandler);
    }
  }

  private getEventHandler(eventName: SVGEventNames) {
    switch (eventName) {
      case 'click':
        return this.onClick;
      case 'drag':
        return this.onDrag;
      case 'mouseover':
        return this.onMouseOver;
      default:
        throw new Error(`no event handler for event: ${eventName}`);
    }
  }

  private onClick(event: SVGElementEvent<'click'>) {
    const { target } = event;
    if (!(target instanceof Element)) {
      return;
    }

    const domPoint = new PointF2D(event.clientX, event.clientY);
    const svgPoint = this.imd.GraphicSheet.domToSvg(domPoint);
    const seekResult = this.voiceSeeker.seekByPosition(svgPoint.x, svgPoint.y);

    if (seekResult.voicePointer) {
      this.imd.eventBus.dispatch('voicepointerclicked', {
        srcEvent: event,
        voicePointer: seekResult.voicePointer,
      });
    }
  }

  private onMouseOver(event: SVGElementEvent<'mouseover'>) {
    // TODO(jared) Dispatch a noteHovered event
    // TODO(jared) Dispatch a measureHovered event
  }

  private onDrag(event: SVGElementEvent<'drag'>) {
    // TODO(jared) Dispatch a noteDragged event
  }
}
