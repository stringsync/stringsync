import { Duration } from '../../../util/Duration';
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

  bigRipple(x: number, y: number) {
    const defaultOpts = Ripple.getDefaultOpts();
    const ripple = new Ripple(x, y, this.svg, {
      initialBorderOpacity: 1,
      finalRadius: defaultOpts.finalRadius * 1.5,
      fadeDuration: Duration.ms(defaultOpts.fadeDuration.ms / 2),
    });
    ripple.render();
  }
}
