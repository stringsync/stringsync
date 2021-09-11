import $ from 'jquery';
import { first, range } from 'lodash';
import { Cursor } from 'opensheetmusicdisplay';
import { ScrollRequestType } from '.';
import { Duration } from '../../../util/Duration';
import { InternalMusicDisplay } from '../InternalMusicDisplay';
import {
  Easing,
  HorizontalEdgeIntersection,
  PositionalRelationship,
  ScrollBehavior,
  ScrollRequest,
  SizeComparison,
} from './types';

type AutoScrollTarget = {
  scrollTop: number;
  duration: Duration;
  easing: Easing;
  onAfterScroll: () => void;
};

type IntersectionObserverAnalysis = {
  visibility: number;
  sizeComparison: SizeComparison;
  horizontalEdgeIntersection: HorizontalEdgeIntersection;
  positionalRelationship: PositionalRelationship;
};

const NULL_ANALYSIS: IntersectionObserverAnalysis = {
  visibility: 0,
  sizeComparison: SizeComparison.Indeterminate,
  horizontalEdgeIntersection: HorizontalEdgeIntersection.None,
  positionalRelationship: PositionalRelationship.Indeterminate,
};

const SCROLL_DEFAULT_DURATION = Duration.ms(150);
const SCROLL_THROTTLE_DURATION = Duration.ms(SCROLL_DEFAULT_DURATION.ms + 10);
const SCROLL_BACK_TOP_DURATION = Duration.ms(500);
const SCROLL_BOTTOM_PADDING_PX = 20;
const SCROLL_GRACE_DURATION = Duration.ms(200);
const SCROLL_DELTA_TOLERANCE_PX = 2;
const SCROLL_JUMP_THRESHOLD_PX = 1000;

export class AutoScrollBehavior implements ScrollBehavior {
  private scrollContainer: HTMLElement;
  private $scrollContainer: JQuery<HTMLElement>;
  private imd: InternalMusicDisplay;

  private observer: IntersectionObserver;
  private cursor: Cursor | null = null;
  private autoScrollHandle = -1;
  private isScrolling = false;
  private lastAnalysis = NULL_ANALYSIS;

  constructor(scrollContainer: HTMLElement, imd: InternalMusicDisplay) {
    this.scrollContainer = scrollContainer;
    this.$scrollContainer = $(scrollContainer);
    this.imd = imd;
    this.observer = new IntersectionObserver(this.onObservation, {
      root: scrollContainer,
      threshold: range(0, 1, 0.1),
    });
  }

  start() {}

  stop() {
    window.clearTimeout(this.autoScrollHandle);
    this.observer.disconnect();
    this.cursor = null;
  }

  handle(request: ScrollRequest) {
    if (request.type !== ScrollRequestType.Cursor) {
      return;
    }
    if (this.cursor !== request.cursor) {
      if (this.cursor) {
        this.observer.unobserve(this.cursor.cursorElement);
      }
      this.cursor = request.cursor;
      this.observer.observe(request.cursor.cursorElement);
    }
    this.scrollToCursor(NULL_ANALYSIS);
  }

  private onObservation: IntersectionObserverCallback = (entries) => {
    const entry = first(entries);
    const analysis = entry ? this.analyzeEntry(entry) : NULL_ANALYSIS;
    this.lastAnalysis = analysis;
    if (!this.isScrolling) {
      this.scrollToCursor(analysis);
    }
  };

  private scrollToCursor = (analysis: IntersectionObserverAnalysis) => {
    const currentScrollTop = this.$scrollContainer.scrollTop() ?? 0;
    const targetScrollTop = this.calculateBestScrollTop(analysis, currentScrollTop);

    const deltaScrollTop = Math.abs(currentScrollTop - targetScrollTop);
    if (deltaScrollTop < SCROLL_DELTA_TOLERANCE_PX) {
      return;
    }

    let duration = SCROLL_DEFAULT_DURATION;
    let easing: Easing = 'linear';
    if (targetScrollTop === 0) {
      duration = SCROLL_BACK_TOP_DURATION;
      easing = 'swing';
    } else if (deltaScrollTop > SCROLL_JUMP_THRESHOLD_PX) {
      duration = Duration.ms(0);
    }

    this.scrollTo({
      scrollTop: targetScrollTop,
      duration,
      easing,
      onAfterScroll: () => {
        this.scrollToCursor(this.lastAnalysis);
      },
    });
  };

  private calculateBestScrollTop(analysis: IntersectionObserverAnalysis, currentScrollTop: number): number {
    if (!this.cursor || this.cursor.Hidden) {
      return 0;
    }

    let nonNotationHeightPx = 0;
    this.$scrollContainer.children().each((_, child) => {
      const $child = $(child);
      const outerHeight = $child.outerHeight() ?? 0;
      nonNotationHeightPx += $child.data('notation') ? 0 : outerHeight;
    });

    const $cursor = $(this.cursor.cursorElement);
    const cursorTop = nonNotationHeightPx + $cursor.position().top;
    const cursorHeight = $cursor.height() ?? 0;
    const { horizontalEdgeIntersection, visibility, positionalRelationship, sizeComparison } = analysis;

    if (sizeComparison === SizeComparison.Bigger) {
      return cursorTop;
    }
    if (visibility === 1) {
      return currentScrollTop;
    }
    if (horizontalEdgeIntersection === HorizontalEdgeIntersection.Top) {
      return cursorTop;
    }
    if (horizontalEdgeIntersection === HorizontalEdgeIntersection.Bottom) {
      const invisibility = 1 - visibility;
      const invisibleCursorHeight = invisibility * cursorHeight;
      return currentScrollTop + invisibleCursorHeight + SCROLL_BOTTOM_PADDING_PX;
    }
    if (positionalRelationship === PositionalRelationship.Above) {
      return cursorTop;
    }
    if (positionalRelationship === PositionalRelationship.Below) {
      return cursorTop;
    }
    return cursorTop;
  }

  scrollTo = (scrollTarget: AutoScrollTarget) => {
    const hasNoOverflow = this.scrollContainer.scrollHeight <= this.scrollContainer.clientHeight;
    if (hasNoOverflow) {
      return;
    }
    this.$scrollContainer.animate(
      { scrollTop: scrollTarget.scrollTop },
      {
        easing: scrollTarget.easing,
        queue: false,
        duration: scrollTarget.duration.ms,
        start: () => {
          this.isScrolling = true;
          this.imd.eventBus.dispatch('autoscrollstarted', {});
        },
        always: () => {
          this.autoScrollHandle = window.setTimeout(() => {
            this.isScrolling = false;
            this.imd.eventBus.dispatch('autoscrollended', {});
            scrollTarget.onAfterScroll();
          }, SCROLL_GRACE_DURATION.ms);
        },
      }
    );
  };

  private analyzeEntry(entry: IntersectionObserverEntry): IntersectionObserverAnalysis {
    return {
      visibility: entry.intersectionRatio,
      sizeComparison: this.getSizeComparison(entry),
      horizontalEdgeIntersection: this.getHorizontalEdgeIntersection(entry),
      positionalRelationship: this.getPositionalRelationship(entry),
    };
  }

  private getSizeComparison(entry: IntersectionObserverEntry): SizeComparison {
    const entryHeightPx = entry.boundingClientRect.height;
    const containerHeightPx = this.getContainerHeightPx(entry);

    if (entryHeightPx < containerHeightPx) {
      return SizeComparison.Smaller;
    } else if (entryHeightPx === containerHeightPx) {
      return SizeComparison.Equal;
    } else {
      return SizeComparison.Bigger;
    }
  }

  private getHorizontalEdgeIntersection(entry: IntersectionObserverEntry): HorizontalEdgeIntersection {
    const isFullyInvisible = entry.intersectionRect.height === 0;
    if (isFullyInvisible) {
      return HorizontalEdgeIntersection.None;
    }
    const isFullyVisible = entry.intersectionRatio === 1;
    if (isFullyVisible) {
      return HorizontalEdgeIntersection.None;
    }
    const isTopVisible = entry.boundingClientRect.top === entry.intersectionRect.top;
    if (isTopVisible) {
      return HorizontalEdgeIntersection.Bottom;
    }
    const isBottomVisible = entry.boundingClientRect.bottom === entry.intersectionRect.bottom;
    if (isBottomVisible) {
      return HorizontalEdgeIntersection.Top;
    }
    return HorizontalEdgeIntersection.Both;
  }

  private getPositionalRelationship(entry: IntersectionObserverEntry): PositionalRelationship {
    const containerHeightPx = this.getContainerHeightPx(entry);
    const containerTopPx = this.getContainerTopPx(entry);
    const containerMidpointPx = containerTopPx + containerHeightPx / 2;

    const entryHeightPx = entry.boundingClientRect.height;
    const entryTopPx = entry.boundingClientRect.top;
    const entryMidpointPx = entryTopPx + entryHeightPx / 2;

    return entryMidpointPx < containerMidpointPx ? PositionalRelationship.Above : PositionalRelationship.Below;
  }

  private getContainerHeightPx(entry: IntersectionObserverEntry): number {
    return entry.rootBounds?.height ?? this.scrollContainer.offsetHeight;
  }

  private getContainerTopPx(entry: IntersectionObserverEntry): number {
    return entry.rootBounds?.top ?? this.scrollContainer.offsetTop;
  }
}
