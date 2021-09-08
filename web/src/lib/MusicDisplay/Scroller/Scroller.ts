import { InternalMusicDisplay } from '../InternalMusicDisplay';

export class Scroller {
  scrollContainer: HTMLElement;
  imd: InternalMusicDisplay;

  constructor(scrollContainer: HTMLElement, imd: InternalMusicDisplay) {
    this.scrollContainer = scrollContainer;
    this.imd = imd;
  }
}
