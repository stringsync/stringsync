import withSizes from 'react-sizes';

export type ViewportTypes = 'MOBILE' | 'TABLET' | 'DESKTOP';

/**
 * Returns a string that describes the viewport
 * 
 * @param {number} width 
 * @returns {string}
 */
const getViewportType = (width: number): ViewportTypes => {
  if (withSizes.isMobile({ width })) {
    return 'MOBILE';
  } else if (withSizes.isTablet({ width })) {
    return 'TABLET';
  } else {
    return 'DESKTOP';
  }
};

export default getViewportType;
