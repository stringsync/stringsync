import withSizes from 'react-sizes';
import { ViewportType } from './';

/**
 * Computes the viewport type based off of withSizes
 * 
 * @param width the viewport width
 */
const getViewportType = (width: number): ViewportType => {
  const size = { width };

  if (withSizes.isMobile(size)) {
    return ViewportType.MOBILE;
  } else if (withSizes.isTablet(size)) {
    return ViewportType.TABLET;
  } else {
    return ViewportType.DESKTOP;
  }
};

export default getViewportType;
