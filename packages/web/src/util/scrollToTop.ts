import { debounce } from 'lodash';
import Scroll from 'react-scroll';

export const scrollToTop = debounce(
  (opts?: any) => {
    Scroll.animateScroll.scrollToTop({
      duration: 200,
      ignoreCancelEvents: true,
      offset: 5,
      smooth: true,
      ...opts,
    });
  },
  1000,
  { leading: true, trailing: true }
);
