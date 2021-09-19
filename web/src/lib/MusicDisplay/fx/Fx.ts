import { Ripple } from './Ripple';

export class Fx {
  svg: SVGElement;

  constructor(svg: SVGElement) {
    this.svg = svg;
  }

  ripple(x: number, y: number) {
    const ripple = new Ripple(x, y, this.svg);
    ripple.render();
  }
}
