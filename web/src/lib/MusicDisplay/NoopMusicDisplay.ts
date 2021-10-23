import { EventBus } from '../EventBus';
import { NoopCursor } from './cursors';
import { Fx } from './fx';
import { NoopLoop } from './loop';
import { MusicDisplayMeta } from './meta';
import { NoopScroller } from './scroller';
import { MusicDisplay } from './types';

const DUMMY_SVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg');

export class NoopMusicDisplay implements MusicDisplay {
  eventBus = new EventBus();

  private cursor = new NoopCursor();
  private fx = new Fx(DUMMY_SVG);
  private loop = new NoopLoop();
  private meta = MusicDisplayMeta.createNull();
  private scroller = new NoopScroller();

  dispose() {}

  getCursor() {
    return this.cursor;
  }

  getFx() {
    return this.fx;
  }

  getLoop() {
    return this.loop;
  }

  getMeta() {
    return this.meta;
  }

  getScroller() {
    return this.scroller;
  }

  load() {
    return Promise.resolve();
  }

  resize() {}
}
