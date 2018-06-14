import * as withSizes from 'react-sizes';

export type ViewportTypes = 'MOBILE' | 'TABLET' | 'DESKTOP';

// FIXME: Fix the typings for withSizes.
const { isMobile, isTablet } = withSizes as any;

/**
 * Returns a string that describes the viewport
 * 
 * @param {number} width 
 * @returns {string}
 */
const getViewportType = (width: number): ViewportTypes => {
  if (isMobile({ width })) {
    return 'MOBILE';
  } else if (isTablet({ width })) {
    return 'TABLET';
  } else {
    return 'DESKTOP';
  }
};

export default getViewportType;
