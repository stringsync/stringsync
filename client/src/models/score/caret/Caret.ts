import { Score } from '../Score';
import { ISpec } from '../../maestro/Maestro';
import { PosCalculator } from './PosCalculator';

export class Caret {
  public readonly score: Score;

  public rect: SVGRectElement | null = null;

  constructor(score: Score) {
    this.score = score;
  }

  public get isRendered(): boolean {
    return !!this.rect;
  }

  public render(spec: ISpec, tick: number): void {
    if (!this.rect) {
      this.mountRect();
    }

    if (!this.rect) {
      throw new Error('rect did not mount');
    }

    const posCalculator = new PosCalculator(this.score, spec, tick);

    try {
      this.rect.setAttribute('x', posCalculator.x.toString());
      this.rect.setAttribute('y', posCalculator.y.toString());
    } catch (error) {
      this.clear();
    }
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
