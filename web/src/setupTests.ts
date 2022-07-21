import '@testing-library/jest-dom/extend-expect';
import 'jest-extended';
import { toHavePositionStyle } from './testing/toHavePositionStyle';
import { toRenderNoteTimes } from './testing/toRenderNoteTimes';
import { toRenderNumPositions } from './testing/toRenderNumPositions';
import { toRenderPosition } from './testing/toRenderPosition';

expect.extend({
  toRenderNoteTimes,
  toRenderPosition,
  toRenderNumPositions,
  toHavePositionStyle,
});

global.ResizeObserver = require('resize-observer-polyfill');

beforeEach(() => {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation((query) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(), // deprecated
      removeListener: jest.fn(), // deprecated
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });

  Object.defineProperty(window, 'IntersectionObserver', {
    writable: true,
    value: jest.fn().mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null,
    }),
  });
});

afterEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
});
