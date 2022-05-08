import { MusicXML } from '@stringsync/musicxml';
import { merge } from 'lodash';
import { DrawingParametersEnum } from 'opensheetmusicdisplay';
import { EventBus } from '../EventBus';
import { InternalMusicDisplay } from './InternalMusicDisplay';
import { MusicDisplay, MusicDisplayEventBus, MusicDisplayOptions } from './types';

const DUMMY_DIV = document.createElement('div');
DUMMY_DIV.setAttribute('id', 'dummy-scroll-container');

const DEFAULT_OPTS: MusicDisplayOptions = {
  syncSettings: { deadTimeMs: 0, durationMs: 0 },
  svgSettings: { eventNames: ['mouseup', 'mousedown', 'mousemove'] },
  scrollContainer: DUMMY_DIV,
  autoResize: false,
  drawTitle: false,
  drawSubtitle: false,
  drawingParameters: DrawingParametersEnum.default,
  drawPartNames: false,
  followCursor: false,
  pageBackgroundColor: 'white',
  cursorsOptions: [],
  drawKeySignatures: true,
  drawTimeSignatures: true,
  drawStartClefs: true,
  drawMeasureNumbers: true,
  drawMetronomeMarks: true,
};

/**
 * This class limits the public interface from InternalMusicDisplay. All the heavy lifting is done by the
 * InternalMusicDisplay instance. Do not add complex logic to this class.
 */
export class OpenSheetMusicDisplay implements MusicDisplay {
  private imd: InternalMusicDisplay;

  eventBus: MusicDisplayEventBus = new EventBus();

  constructor(container: HTMLDivElement, partialOpts: Partial<MusicDisplayOptions> = {}) {
    const opts = merge({}, DEFAULT_OPTS, partialOpts);
    this.imd = new InternalMusicDisplay(container, this.eventBus, opts);
  }

  async load(musicXml: MusicXML) {
    await Promise.resolve(); // workaround that allows the notation to render
    await this.imd.load(musicXml.serialize());
    this.imd.render();
  }

  resize() {
    this.imd.resize();
  }

  dispose() {
    this.imd.dispose();
  }

  getFx() {
    return this.imd.fx;
  }

  getScroller() {
    return this.imd.scroller;
  }

  getCursor() {
    return this.imd.cursorWrapper;
  }

  getLoop() {
    return this.imd.loop;
  }

  getMeta() {
    return this.imd.meta;
  }

  getLocator() {
    return this.imd.locator;
  }
}
