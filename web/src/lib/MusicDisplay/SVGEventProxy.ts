import { throttle } from 'lodash';
import { BackendType, PointF2D, SvgVexFlowBackend, VexFlowBackend } from 'opensheetmusicdisplay';
import { Duration } from '../../util/Duration';
import { NumberRange } from '../../util/NumberRange';
import { AnchoredTimeSelection } from './AnchoredTimeSelection';
import { InternalMusicDisplay } from './InternalMusicDisplay';
import { CursorWrapper } from './types';
import { VoiceSeeker } from './VoiceSeeker';

// Narrow down supported events.
type SVGEventNames = keyof Pick<
  SVGElementEventMap,
  'click' | 'touchstart' | 'touchmove' | 'touchend' | 'mousedown' | 'mousemove' | 'mouseup'
>;

type SVGElementEvent<N extends SVGEventNames> = SVGElementEventMap[N];

type SVGEventHandler<N extends SVGEventNames = SVGEventNames> = (event: SVGElementEvent<N>) => void;

type Positional = { clientX: number; clientY: number };

const POINTER_MOVE_THROTTLE_DURATION = Duration.ms(30);
const CURSOR_PADDING_PX = 10;

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

  svg: SVGElement;
  private imd: InternalMusicDisplay;
  private voiceSeeker: VoiceSeeker;

  private currentSelection: AnchoredTimeSelection | null = null;
  private enteredCursor: CursorWrapper | null = null;
  private draggedCursor: CursorWrapper | null = null;

  private eventListeners: Array<[Element | Document, string, (...args: any[]) => void]> = [];

  private constructor(svg: SVGElement, imd: InternalMusicDisplay, voiceSeeker: VoiceSeeker) {
    this.svg = svg;
    this.imd = imd;
    this.voiceSeeker = voiceSeeker;
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
    const listen = (
      el: Element | Document,
      eventName: string,
      eventHandler: (...args: any[]) => void,
      options?: AddEventListenerOptions
    ) => {
      this.eventListeners.push([el, eventName, eventHandler]);
      el.addEventListener(eventName, eventHandler, options);
    };

    switch (eventName) {
      case 'click':
        return listen(this.svg, eventName, this.onClick.bind(this));
      case 'touchstart':
        return listen(this.svg, eventName, this.onTouchStart.bind(this), { passive: true });
      case 'touchmove':
        return listen(this.svg, eventName, this.onTouchMove.bind(this), { passive: true });
      case 'touchend':
        return listen(this.svg, eventName, this.onTouchEnd.bind(this), { passive: true });
      case 'mousedown':
        return listen(this.svg, eventName, this.onMouseDown.bind(this));
      case 'mousemove':
        return listen(this.svg, eventName, this.onMouseMove.bind(this));
      case 'mouseup':
        return listen(window.document, eventName, this.onMouseUp.bind(this));
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

    const touch = event.touches.item(0);
    if (!touch) {
      return;
    }

    const seekResult = this.getSeekResult(touch);
    if (seekResult.voicePointer) {
      this.onSelectionStart(seekResult.timeMs);
    }
  }

  private onTouchMove = throttle(
    (event: SVGElementEvent<'touchmove'>) => {
      this.imd.eventBus.dispatch('touchmove', event);

      const touch = event.touches.item(0);
      if (!touch) {
        return;
      }

      const seekResult = this.getSeekResult(touch);
      if (seekResult.voicePointer) {
        this.onSelectionUpdate(seekResult.timeMs);
      }
    },
    POINTER_MOVE_THROTTLE_DURATION.ms,
    { leading: true, trailing: true }
  );

  private onTouchEnd(event: SVGElementEvent<'touchend'>) {
    this.imd.eventBus.dispatch('touchend', event);

    const touch = event.touches.item(0);
    if (!touch) {
      return;
    }

    this.onSelectionEnd();
  }

  private onMouseDown(event: SVGElementEvent<'mousedown'>) {
    this.imd.eventBus.dispatch('mousedown', event);

    const { x, y } = this.getSvgPos(event);
    const cursor = this.getCursorHit(x, y);

    if (cursor && this.enteredCursor && !this.draggedCursor) {
      this.draggedCursor = cursor;
      this.imd.eventBus.dispatch('cursordragstarted', { cursor });
    }

    const seekResult = this.getSeekResult(event);
    if (seekResult.voicePointer) {
      this.onSelectionStart(seekResult.timeMs);
    }

    return false;
  }

  private onMouseMove = throttle(
    (event: SVGElementEvent<'mousemove'>) => {
      this.imd.eventBus.dispatch('mousemove', event);

      const { x, y } = this.getSvgPos(event);
      const cursor = this.getCursorHit(x, y);

      if (cursor && !this.currentSelection) {
        this.enteredCursor = cursor;
        this.imd.eventBus.dispatch('cursorentered', { cursor });
      } else if (!cursor && this.enteredCursor) {
        const exitedCursor = this.enteredCursor;
        this.enteredCursor = null;
        this.imd.eventBus.dispatch('cursorexited', { cursor: exitedCursor });
      }

      if (this.draggedCursor) {
        this.imd.eventBus.dispatch('cursordragupdated', { cursor: this.draggedCursor });
      }

      const seekResult = this.getSeekResult(event);
      if (seekResult.voicePointer) {
        this.imd.eventBus.dispatch('voicepointerhovered', {
          voicePointer: seekResult.voicePointer,
          timeMs: seekResult.timeMs,
        });

        this.onSelectionUpdate(seekResult.timeMs);
      }
    },
    POINTER_MOVE_THROTTLE_DURATION.ms,
    { leading: true, trailing: true }
  );

  private onMouseUp(event: SVGElementEvent<'mouseup'>) {
    this.imd.eventBus.dispatch('mouseup', event);

    if (this.draggedCursor) {
      const cursor = this.draggedCursor;
      this.draggedCursor = null;
      this.imd.eventBus.dispatch('cursordragended', { cursor });
    }

    this.onSelectionEnd();
  }

  private onSelectionStart(timeMs: number) {
    this.currentSelection = AnchoredTimeSelection.init(timeMs);
    this.imd.eventBus.dispatch('selectionstarted', { selection: this.currentSelection.clone() });
  }

  private onSelectionUpdate(timeMs: number) {
    if (!this.currentSelection) {
      return;
    }
    this.currentSelection.update(timeMs);
    this.imd.eventBus.dispatch('selectionupdated', { selection: this.currentSelection.clone() });
  }

  private onSelectionEnd() {
    this.imd.eventBus.dispatch('selectionended', {});
    this.currentSelection = null;
  }

  private getCursorHit(x: number, y: number): CursorWrapper | null {
    const svgRect = this.svg.getBoundingClientRect();
    const cursorRect = this.imd.cursorWrapper.element.getBoundingClientRect();

    const relativeLeft = cursorRect.left - svgRect.left;
    const relativeTop = cursorRect.top - svgRect.top;
    const xRange = NumberRange.from(relativeLeft - CURSOR_PADDING_PX).to(
      relativeLeft + cursorRect.width + CURSOR_PADDING_PX
    );
    const yRange = NumberRange.from(relativeTop - CURSOR_PADDING_PX).to(
      relativeTop + cursorRect.height + CURSOR_PADDING_PX
    );

    if (xRange.contains(x) && yRange.contains(y)) {
      return this.imd.cursorWrapper;
    }

    return null;
  }

  private getSeekResult(positional: Positional) {
    const { x, y } = this.getSvgPos(positional);
    return this.voiceSeeker.seekByPosition(x, y);
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
