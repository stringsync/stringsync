import { getViewportType } from './';

const width = window.innerWidth;

const viewportDefaultState = Object.freeze({
  width: width,
  type: getViewportType(width)
});

export default viewportDefaultState;
