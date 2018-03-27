import Scroll from 'react-scroll';
import { debounce } from 'lodash';

/**
 * Scrolls to the top for the NotationIndex component
 * Doesn't fire off until there has been 1000 ms of no inputs
 * 
 * @return {void}
 */
const scrollToTop = debounce(() => {
  Scroll.animateScroll.scrollToTop({
    duration: 200,
    smooth: true,
    offset: 5,
    ignoreCancelEvents: true
  });
}, 1000, { leading: true, trailing: true });

export default scrollToTop;
