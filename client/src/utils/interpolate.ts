export interface IPoint {
  x: number;
  y: number;
}

/**
 * Classic interpolation.
 *
 * @param point1
 * @param point2
 * @param target
 */
export const interpolate = (point1: IPoint, point2: IPoint, target: number): number => {
  const [p1, p2] = point1.y > point2.y ? [point1, point2] : [point2, point1];
  const [x1, x2] = [p1.x, p2.x];
  const [y1, y2] = [p1.y, p2.y];

  const slope = (y2 - y1) / (x2 - x1);
  const intercept = y1 - (slope * x1);

  return (slope * target) + intercept;
};
