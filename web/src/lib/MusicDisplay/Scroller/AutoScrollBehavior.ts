import $ from 'jquery';
import { throttle } from 'lodash';
import { Cursor } from 'opensheetmusicdisplay';
import { ScrollRequestType } from '.';
import { Duration } from '../../../util/Duration';
import { InternalMusicDisplay } from '../InternalMusicDisplay';
import { AutoScrollTarget, ScrollBehavior, ScrollRequest } from './types';

const SCROLL_DEFAULT_DURATION = Duration.ms(100);
const SCROLL_BACK_TOP_DURATION = Duration.ms(300);
const SCROLL_THROTTLE_DURATION = Duration.ms(SCROLL_DEFAULT_DURATION.ms + 10);
const SCROLL_GRACE_DURATION = Duration.ms(500);
const SCROLL_DELTA_TOLERANCE_PX = 2;
const SCROLL_JUMP_THRESHOLD_PX = 350;

export class AutoScrollBehavior implements ScrollBehavior {
  private scrollContainer: HTMLElement;
  private $scrollContainer: JQuery<HTMLElement>;
  private imd: InternalMusicDisplay;

  private lastScrollToId = Symbol();

  constructor(scrollContainer: HTMLElement, imd: InternalMusicDisplay) {
    this.scrollContainer = scrollContainer;
    this.$scrollContainer = $(scrollContainer);
    this.imd = imd;
  }

  start() {}

  stop() {}

  handle(request: ScrollRequest) {
    if (request.type !== ScrollRequestType.Cursor) {
      return;
    }

    this.scrollToCursor(request.cursor);
  }

  private scrollToCursor(cursor: Cursor) {
    let scrollTop = $(cursor.cursorElement).position().top;
    const currentScrollTop = this.$scrollContainer.scrollTop() ?? 0;

    if (scrollTop > 0) {
      // Get all the sibling elements that are not notations and scroll past them
      this.$scrollContainer.children().each((_, child) => {
        const $child = $(child);
        if ($child.data('notation')) {
          return;
        }
        scrollTop += $child.outerHeight() ?? 0;
      });
    }

    const deltaScrollTop = Math.abs(currentScrollTop - scrollTop);
    if (deltaScrollTop < SCROLL_DELTA_TOLERANCE_PX) {
      return;
    }

    let duration = SCROLL_DEFAULT_DURATION;
    if (scrollTop === 0) {
      duration = SCROLL_BACK_TOP_DURATION;
    } else if (deltaScrollTop > SCROLL_JUMP_THRESHOLD_PX) {
      duration = Duration.ms(0);
    }

    this.scrollTo({ scrollTop, duration });
  }

  scrollTo = throttle(
    (scrollTarget: AutoScrollTarget) => {
      const hasNoOverflow = this.scrollContainer.scrollHeight <= this.scrollContainer.clientHeight;
      if (hasNoOverflow) {
        return;
      }

      const lastScrollToId = Symbol();
      const didNewScrollInvoke = () => this.lastScrollToId !== lastScrollToId;
      this.$scrollContainer.animate(
        { scrollTop: scrollTarget.scrollTop },
        {
          queue: false,
          duration: scrollTarget.duration.ms,
          start: () => {
            this.lastScrollToId = lastScrollToId;
            this.imd.eventBus.dispatch('autoscrollstarted', {});
          },
          always: () => {
            if (didNewScrollInvoke()) {
              // Don't bother even enqueuing autoScrollEnd. Assume that another invocation will trigger it.
              return;
            }
            window.setTimeout(() => {
              if (didNewScrollInvoke()) {
                return;
              }
              this.imd.eventBus.dispatch('autoscrollended', {});
            }, SCROLL_GRACE_DURATION.ms);
          },
        }
      );
    },
    SCROLL_THROTTLE_DURATION.ms,
    { leading: true, trailing: true }
  );
}
