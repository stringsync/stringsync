export type SupportedSVGEventNames = keyof Pick<
  SVGElementEventMap,
  'touchstart' | 'touchmove' | 'touchend' | 'mousedown' | 'mousemove' | 'mouseup'
>;

export type SVGSettings = {
  eventNames: SupportedSVGEventNames[];
};
