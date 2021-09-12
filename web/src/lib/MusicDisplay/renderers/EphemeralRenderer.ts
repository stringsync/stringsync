import { InternalMusicDisplay } from '../InternalMusicDisplay';

export class EphemeralRenderer {
  static create(imd: InternalMusicDisplay) {
    return new EphemeralRenderer(imd.getSvg());
  }

  private svg: SVGElement;

  private constructor(svg: SVGElement) {
    this.svg = svg;
  }

  render() {}
}
