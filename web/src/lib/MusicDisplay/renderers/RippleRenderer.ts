import $ from 'jquery';
import { theme } from '../../../theme';
import { Duration } from '../../../util/Duration';
import { InternalMusicDisplay } from '../InternalMusicDisplay';

const CIRCLE_INITIAL_RADIUS_PX = 36;
const CIRCLE_FINAL_RADIUS_PX = 48;
const CIRCLE_FILL_OPACITY = 0;
const CIRCLE_BORDER_THICKNESS_PX = 4;
const CIRCLE_BORDER_COLOR = theme['@primary-color'];
const CIRCLE_INITIAL_BORDER_OPACITY = 0.7;
const CIRCLE_FINAL_BORDER_OPACITY = 0;
const FADE_DURATION = Duration.ms(500);

export class RippleRenderer {
  static create(imd: InternalMusicDisplay) {
    return new RippleRenderer(imd.getSvg());
  }

  private svg: SVGElement;

  private constructor(svg: SVGElement) {
    this.svg = svg;
  }

  render(x: number, y: number) {
    const circle = this.createCircle(x, y);
    this.svg.appendChild(circle);
    $(circle).animate(
      {
        opacity: CIRCLE_FINAL_BORDER_OPACITY,
        r: `${CIRCLE_FINAL_RADIUS_PX}px`,
      },
      {
        duration: FADE_DURATION.ms,
        always: () => {
          circle.remove();
        },
      }
    );
  }

  private createCircle(x: number, y: number): SVGCircleElement {
    const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    circle.setAttribute('cx', x.toString());
    circle.setAttribute('cy', y.toString());
    circle.setAttribute('r', CIRCLE_INITIAL_RADIUS_PX.toString());
    circle.setAttribute('stroke', CIRCLE_BORDER_COLOR);
    circle.setAttribute('stroke-width', CIRCLE_BORDER_THICKNESS_PX.toString());
    circle.setAttribute('stroke-opacity', CIRCLE_INITIAL_BORDER_OPACITY.toString());
    circle.setAttribute('fill-opacity', CIRCLE_FILL_OPACITY.toString());
    circle.setAttribute('pointer-events', 'none');
    return circle;
  }
}
