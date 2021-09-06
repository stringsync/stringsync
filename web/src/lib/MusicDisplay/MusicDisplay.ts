import { merge } from 'lodash';
import { DrawingParametersEnum } from 'opensheetmusicdisplay';
import { EventBus } from '../EventBus';
import { InternalMusicDisplay } from './InternalMusicDisplay';
import { MusicDisplayEventBus, MusicDisplayOptions } from './types';

const DUMMY_DIV = document.createElement('div');
DUMMY_DIV.setAttribute('id', 'dummy-scroll-container');

const DEFAULT_OPTS: MusicDisplayOptions = {
  syncSettings: { deadTimeMs: 0, durationMs: 0 },
  svgSettings: { eventNames: ['mouseup', 'mousedown', 'mousemove'] },
  scrollContainer: DUMMY_DIV,
  autoResize: true,
  drawTitle: false,
  drawSubtitle: false,
  drawingParameters: DrawingParametersEnum.default,
  drawPartNames: false,
  followCursor: false,
  pageBackgroundColor: 'white',
  cursorsOptions: [],
};

/**
 * MusicDisplay limits the public interface from InternalMusicDisplay.
 *
 * All the heavy lifting is done by the InternalMusicDisplay instance. Do not add complex logic to this class.
 */
export class MusicDisplay {
  private imd: InternalMusicDisplay;

  eventBus: MusicDisplayEventBus = new EventBus();

  constructor(container: HTMLDivElement, partialOpts: Partial<MusicDisplayOptions> = {}) {
    const opts = merge({}, DEFAULT_OPTS, partialOpts);
    this.imd = new InternalMusicDisplay(container, this.eventBus, opts);
  }

  async load(xmlUrl: string) {
    await this.imd.load(xmlUrl);
    this.imd.render();
  }

  dispose() {
    this.imd.clear();
  }

  get scrollContainer() {
    return this.imd.scrollContainer;
  }

  get cursor() {
    return this.imd.cursorWrapper;
  }

  get loop() {
    return this.imd.loop;
  }
}
