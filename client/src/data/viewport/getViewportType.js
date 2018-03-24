import withSizes from 'react-sizes';

/**
 * Returns a string that describes the viewport
 * 
 * @param {number} width 
 * @return {string}
 */
const getViewportType = width => {
  if (withSizes.isMobile(width)) {
    return 'MOBILE';
  } else if (withSizes.isTablet(width)) {
    return 'TABLET';
  } else {
    return 'DESKTOP';
  }
};

export default getViewportType;
