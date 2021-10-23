import '@testing-library/jest-dom/extend-expect';
import 'jest-extended';
import * as fretboardMatchers from './components/FretboardJs/matchers';

expect.extend({
  toRenderNoteTimes: fretboardMatchers.toRenderNoteTimes,
  toRenderPosition: fretboardMatchers.toRenderPosition,
  toRenderNumPositions: fretboardMatchers.toRenderNumPositions,
  toHavePositionStyle: fretboardMatchers.toHavePositionStyle,
});

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
});

afterEach(() => {
  jest.clearAllMocks();
  jest.restoreAllMocks();
});
