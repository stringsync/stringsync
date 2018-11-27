import { Flow, Artist, VexTab } from 'vextab/releases/vextab-div.js';

Artist.NOLOGO = true;

/**
 * The purpose of this class is to abstract the logic of parsing and rendering
 * a Vextab into the DOM. The properties of the score are not meant to change
 * once the instance has been created. Instead, a new Score object with the
 * desired properties should be created.
 */
export class Score {
  public readonly width: number;
  public readonly div: HTMLDivElement;
  public readonly vextabString: string;

  private artist: typeof Artist;
  private vextab: typeof VexTab;
  private renderer: typeof Flow.Renderer;

  constructor(width: number, div: HTMLDivElement, vextabString: string) {
    this.width = width;
    this.div = div;
    this.vextabString = vextabString;
  }

  public render(): void {
    // Initialize
    this.renderer = new Flow.Renderer(this.div, Flow.Renderer.Backends.SVG);
    this.artist = new Artist(10, 10, this.width);
    this.vextab = new VexTab(this.artist);

    // Parse vextabString
    this.vextab.parse(this.vextabString);

    // Render notation into the div container
    this.artist.render(this.renderer);
  }
}
