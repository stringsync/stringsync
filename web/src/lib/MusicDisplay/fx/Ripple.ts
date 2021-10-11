import $ from 'jquery';
import { theme } from '../../../theme';
import { Duration } from '../../../util/Duration';
import { VisualFx } from './types';

export type RippleOpts = {
  initialRadius: number;
  finalRadius: number;
  fillOpacity: number;
  borderThicknessPx: number;
  borderColor: string;
  initialBorderOpacity: number;
  finalBorderOpacity: number;
  fadeDuration: Duration;
};

export class Ripple implements VisualFx {
  static getDefaultOpts() {
    return {
      initialRadius: 36,
      finalRadius: 48,
      fillOpacity: 0,
      borderThicknessPx: 4,
      borderColor: theme['@primary-color'],
      initialBorderOpacity: 0.7,
      finalBorderOpacity: 0,
      fadeDuration: Duration.ms(500),
    };
  }

  private x: number;
  private y: number;
  private svg: SVGElement;
  private opts: RippleOpts;

  constructor(x: number, y: number, svg: SVGElement, opts?: Partial<RippleOpts>) {
    this.x = x;
    this.y = y;
    this.svg = svg;
    this.opts = { ...Ripple.getDefaultOpts(), ...opts };
  }

  render() {
    const circle = this.createCircle();
    this.svg.appendChild(circle);
    $(circle).animate(
      {
        opacity: this.opts.finalBorderOpacity,
        r: `${this.opts.finalRadius}px`,
      },
      {
        duration: this.opts.fadeDuration.ms,
        always: () => {
          circle.remove();
        },
      }
    );
  }

  clear() {}

  private createCircle(): SVGCircleElement {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', this.x.toString());
    circle.setAttribute('cy', this.y.toString());
    circle.setAttribute('r', this.opts.initialRadius.toString());
    circle.setAttribute('stroke', this.opts.borderColor);
    circle.setAttribute('stroke-width', this.opts.borderThicknessPx.toString());
    circle.setAttribute('stroke-opacity', this.opts.initialBorderOpacity.toString());
    circle.setAttribute('fill-opacity', this.opts.fillOpacity.toString());
    circle.setAttribute('pointer-events', 'none');
    return circle;
  }
}
