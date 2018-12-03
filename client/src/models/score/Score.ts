import { Flow, Artist, VexTab } from 'vextab/releases/vextab-div.js';
import { Line } from './line';
import { SVGExtractor } from './SVGExtractor';

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

  public lines: Line[] = [];

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
    this.artist = new Artist(7, 0, this.width);
    this.vextab = new VexTab(this.artist);

    // Parse vextabString
    this.vextab.parse(this.vextabString);

    // Render notation into the div container
    this.artist.render(this.renderer);

    // Now that the notation is rendered, the artist has all the information needed
    // to link the markup with the internal model of notes
    this.hydrate();
  }

  public hydrate(): Line[] {
    const svg = this.div.firstChild;

    if (!svg) {
      throw new Error('must successfully render to div first');
    }

    const extractor = new SVGExtractor(svg as SVGElement);

    if (extractor.staveLines.length !== this.artist.staves.length) {
      throw new Error('must have the same number of staves and staveLines');
    }

    let noteOffset = 0;
    return this.lines = this.artist.staves.map((stave, ndx) => {
      const line = new Line(stave, ndx);
      line.hydrate(extractor, noteOffset);
      line.measures.forEach(measure => noteOffset += measure.notes.length);
      return line;
    });
  }
}
