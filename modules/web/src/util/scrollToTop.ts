import Scroll from 'react-scroll';
import { debounce } from 'lodash';

export const scrollToTop = debounce(
  () => {
    Scroll.animateScroll.scrollToTop({
      duration: 200,
      ignoreCancelEvents: true,
      offset: 5,
      smooth: true,
    });
  },
  1000,
  { leading: true, trailing: true }
);
