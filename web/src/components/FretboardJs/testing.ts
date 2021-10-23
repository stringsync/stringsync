import { PositionStyle } from '.';

type Position = {
  fret: number;
  string: number;
};

export const getFretboardEl = (container: HTMLElement): Element | null => {
  return container.getElementsByClassName('fretbard-html-wrapper')[0] || null;
};

export const getPositionEl = (container: HTMLElement, position: Position): Element | null => {
  return container.getElementsByClassName(`dot-fret-${position.fret} dot-string-${position.string}`)[0];
};

export const getAllPositionEls = (container: HTMLElement) => {
  return container.getElementsByClassName('dot-circle');
};

export const getPositionElsByFret = (container: HTMLElement, fret: number) => {
  return container.getElementsByClassName(`dot-fret-${fret}`);
};

export const getPositionElsByString = (container: HTMLElement, string: number) => {
  return container.getElementsByClassName(`dot-string-${string}`);
};

export const getPositionElsByNote = (container: HTMLElement, note: string) => {
  return container.getElementsByClassName(`dot-note-${note}`);
};

export const getStyleAtPosition = (container: HTMLElement, position: Position): PositionStyle | null => {
  const positionEl = getPositionEl(container, position);
  if (!positionEl) {
    return null;
  }

  const circleEl = positionEl.getElementsByTagName('circle')[0];
  if (!circleEl) {
    return null;
  }

  const style: PositionStyle = {};

  const stroke = circleEl.getAttribute('stroke');
  if (stroke) {
    style.stroke = stroke;
  }
  const fill = circleEl.getAttribute('fill');
  if (fill) {
    style.fill = fill;
  }

  return style;
};
