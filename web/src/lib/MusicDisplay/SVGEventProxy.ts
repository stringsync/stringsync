import { BackendType, SvgVexFlowBackend, VexFlowBackend } from 'opensheetmusicdisplay';
import { InternalMusicDisplay } from './InternalMusicDisplay';
import { MusicDisplayEventBus } from './types';

// Narrow down supported events.
type SVGEventNames = keyof Pick<SVGElementEventMap, 'click' | 'mouseover' | 'drag'>;

type SVGElementEvent<N extends SVGEventNames> = SVGElementEventMap[N];

type SVGEventHandler<N extends SVGEventNames = SVGEventNames> = (event: SVGElementEvent<N>) => void;

const isSvgBackend = (backend: VexFlowBackend | undefined): backend is SvgVexFlowBackend => {
  return !!backend && backend.getOSMDBackendType() === BackendType.SVG;
};

export class SVGEventProxy {
  static install(imd: InternalMusicDisplay, eventNames: SVGEventNames[]) {
    const backend = imd.Drawer.Backends[0];
    if (!isSvgBackend(backend)) {
      throw new Error('expected the first backend to be an svg backend');
    }

    const svg = backend.getSvgElement();
    const eventBus = imd.eventBus;

    const svgEventProxy = new SVGEventProxy(svg, eventBus);
    svgEventProxy.install(eventNames);
    return svgEventProxy;
  }

  private svg: SVGElement;
  private eventBus: MusicDisplayEventBus;
  private eventListeners: Array<[SVGEventNames, SVGEventHandler]> = [];

  private constructor(svg: SVGElement, eventBus: MusicDisplayEventBus) {
    this.svg = svg;
    this.eventBus = eventBus;
  }

  uninstall() {
    for (const eventListener of this.eventListeners) {
      this.svg.removeEventListener(...eventListener);
    }
    this.eventListeners = [];
  }

  // This is private to prevent callers from installing more than once. It's
  // simpler than tracking installation state.
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

    // TODO(jared) Consider fetching the OSMD object that corresponds to this element.
    const g = target.closest('.vf-notehead');
    if (g instanceof SVGGElement) {
      this.eventBus.dispatch('noteClicked', {
        element: g,
        srcEvent: event,
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
