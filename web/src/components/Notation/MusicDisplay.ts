import { merge, noop } from 'lodash';
import { CursorType, DrawingParametersEnum, IOSMDOptions, OpenSheetMusicDisplay } from 'opensheetmusicdisplay';
import { theme } from '../../theme';
import { LerpCursorWrapper } from './LerpCursorWrapper';
import { NullCursorWrapper } from './NullCursorWrapper';
import { CursorWrapper } from './types';

type Callback = () => void;

type MusicDisplayOptions = IOSMDOptions & {
  onLoadStart?: Callback;
  onLoadEnd?: Callback;
  onResizeStart?: Callback;
  onResizeEnd?: Callback;
};

const DEFAULT_OPTS: MusicDisplayOptions = {
  autoResize: true,
  backend: 'svg',
  drawTitle: false,
  drawSubtitle: false,
  drawingParameters: DrawingParametersEnum.default,
  drawPartNames: false,
  followCursor: true,
  pageBackgroundColor: 'white',
  cursorsOptions: [
    {
      type: CursorType.Standard,
      color: 'blue',
      follow: false,
      alpha: 0.3,
    },
    {
      type: CursorType.Standard,
      color: 'lime',
      follow: false,
      alpha: 0.3,
    },
    {
      type: CursorType.Standard,
      color: theme['@primary-color'],
      follow: true,
      alpha: 0.5,
    },
  ],
};

/**
 * InternalMusicDisplay handles the logic involving rendering notations and cursors.
 *
 * The reason why this extends OpenSheetMusicDisplay (inheritance) instead of
 * simply having an OpenSheetMusicDisplay instance (composition) is because
 * OpenSheetMusicDisplay has protected methods that we need access to. This
 * has some unwanted side effects like callers being able to call whatever
 * they want.
 */
class InternalMusicDisplay extends OpenSheetMusicDisplay {
  onLoadStart: Callback;
  onLoadEnd: Callback;
  cursorWrapper: CursorWrapper = new NullCursorWrapper();

  constructor(container: string | HTMLElement, opts: MusicDisplayOptions) {
    super(container, merge({}, DEFAULT_OPTS, opts));

    this.onLoadStart = opts.onLoadStart || noop;
    this.onLoadEnd = opts.onLoadEnd || noop;
    this.handleResize(opts.onResizeStart || noop, opts.onResizeEnd || noop);
  }

  async load(xmlUrl: string) {
    this.onLoadStart();
    try {
      return await super.load(xmlUrl);
    } finally {
      this.onLoadEnd();
    }
  }

  render() {
    super.render();
    this.initCursorWrapper();
  }

  clear() {
    super.clear();
    this.cursorWrapper.clear();
  }

  updateCursor(timeMs: number) {
    this.cursorWrapper.update(timeMs);
  }

  private initCursorWrapper() {
    const [lagger, leader, lerped] = this.cursors;
    if (!lagger) {
      console.debug('missing lagger cursor');
    }
    if (!leader) {
      console.debug('missing leader cursor');
    }
    if (!lerped) {
      console.debug('missing leader cursor');
    }

    this.cursorWrapper.clear();

    const lerpable = lagger && leader && lerped;
    if (lerpable) {
      this.cursorWrapper = new LerpCursorWrapper(lagger, leader, lerped);
    } else {
      this.cursorWrapper = new NullCursorWrapper();
    }

    // TODO(jared) Handle multiple parts per sheet.
    const voiceEntries = this.Sheet.Parts[0].Voices.flatMap((voice) => voice.VoiceEntries);
    this.cursorWrapper.init(voiceEntries);
  }
}

/**
 * MusicDisplay limits the public interface from InternalMusicDisplay since it
 * must inherit from OpenSheetMusicDisplay.
 *
 * All the heavy lifting is done by the InternalMusicDisplay instance. Do not
 * add complex logic to this class.
 */
export class MusicDisplay {
  imd: InternalMusicDisplay;

  constructor(container: HTMLDivElement, opts: MusicDisplayOptions) {
    this.imd = new InternalMusicDisplay(container, opts);
  }

  async load(xmlUrl: string) {
    await this.imd.load(xmlUrl);
    this.imd.render();
  }

  clear() {
    this.imd.clear();
  }

  updateCursor(timeMs: number) {
    this.imd.updateCursor(timeMs);
  }
}
