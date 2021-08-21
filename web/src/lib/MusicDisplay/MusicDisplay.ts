import { InternalMusicDisplay } from './InternalMusicDisplay';
import { MusicDisplayOptions } from './types';

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

    (window as any).osmd = this.imd;
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
