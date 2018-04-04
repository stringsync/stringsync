import { getViewportType } from './';
import { ViewportState } from 'typings';

const width = window.innerWidth;

const viewportDefaultState: ViewportState = Object.freeze({
  width: width,
  type: getViewportType(width)
});

export default viewportDefaultState;
