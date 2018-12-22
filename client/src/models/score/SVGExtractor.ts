/**
 * The purpose of this class is to provide an interface that takes an SVG element
 * and returns the staveNotes and staveLines within. These child elements are used
 * to be married with instances of the Line and Note models.
 */
export class SVGExtractor {
  public readonly svg: SVGElement;
  public readonly staveNotes: Element[];
  public readonly staveLines: Element[];

  constructor(svg: SVGElement) {
    this.svg = svg;
    this.staveNotes = Array.from(this.svg.getElementsByClassName('vf-stavenote'));
    this.staveLines = Array.from(this.svg.querySelectorAll(`rect[width='2.5'][height='176.5']`)).concat(
      Array.from(this.svg.querySelectorAll(`rect[width='3'][height='176']`))
    );
  }

  public getStaveNotes(startNdx: number, endNdx: number) {
    return this.staveNotes.slice(startNdx, endNdx);
  }

  public getStaveLine(ndx: number) {
    return this.staveLines[ndx];
  }
}
