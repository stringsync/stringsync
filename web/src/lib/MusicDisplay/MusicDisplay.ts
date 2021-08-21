import { merge } from 'lodash';
import { CursorType, DrawingParametersEnum } from 'opensheetmusicdisplay';
import { theme } from '../../theme';
import { InternalMusicDisplay } from './InternalMusicDisplay';
import { MusicDisplayOptions } from './types';

const DEFAULT_OPTS: MusicDisplayOptions = {
  syncSettings: {
    deadTimeMs: 0,
    durationMs: 0,
  },
  autoResize: true,
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
 * MusicDisplay limits the public interface from InternalMusicDisplay since it
 * must inherit from OpenSheetMusicDisplay.
 *
 * All the heavy lifting is done by the InternalMusicDisplay instance. Do not
 * add complex logic to this class.
 */
export class MusicDisplay {
  imd: InternalMusicDisplay;

  constructor(container: HTMLDivElement, partialOpts: Partial<MusicDisplayOptions> = {}) {
    const opts = merge({}, DEFAULT_OPTS, partialOpts);
    this.imd = new InternalMusicDisplay(container, opts);
  }

  async load(content: string | Document) {
    await this.imd.load(content);
    this.imd.render();
  }

  clear() {
    this.imd.clear();
  }

  updateCursor(timeMs: number) {
    this.imd.updateCursor(timeMs);
  }
}
