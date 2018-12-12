import { Score } from './Score';

export class Caret {
  public readonly score: Score;

  public rect: SVGRectElement | null = null;

  constructor(score: Score) {
    this.score = score;
  }

  public get isRendered(): boolean {
    return !!this.rect;
  }

  public render(x: number, y: number): void {
    if (!this.rect) {
      this.mountRect();
    }

    if (!this.rect) {
      throw new Error('rect did not mount');
    }

    this.rect.setAttribute('x', x.toString());
    this.rect.setAttribute('y', y.toString());
  }

  public clear(): void {
    const { svg } = this.score;

    if (svg) {
      svg.removeChild(this.rect);
    }

    this.rect = null;
  }

  private mountRect(): void {
    if (this.rect) {
      throw new Error('cannot mount multiple rect elements');
    }

    this.rect = document.createElementNS('http://www.w3.org/2000/svg', 'rect');

    if (!this.score.svg) {
      throw new Error('must have a score svg to mount a rect');
    }

    this.rect.setAttribute('width', '2');
    this.rect.setAttribute('height', '225');
    this.rect.setAttribute('fill', '#fc354c');
    this.rect.setAttribute('stroke', '#fc354c');

    this.score.svg.appendChild(this.rect);
  }
}
