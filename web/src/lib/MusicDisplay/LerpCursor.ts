import $ from 'jquery';
import { throttle } from 'lodash';
import { Cursor, CursorType } from 'opensheetmusicdisplay';
import { MusicDisplayEventBus } from '.';
import { ColoringOperation } from './ColoringOperation';
import { InternalMusicDisplay } from './InternalMusicDisplay';
import { MusicDisplayLocator } from './MusicDisplayLocator';
import { CursorSnapshot } from './types';

const SCROLL_DURATION_MS = 100;
const SCROLL_BACK_TOP_DURATION_MS = 300;
const SCROLL_THROTTLE_MS = SCROLL_DURATION_MS + 10;
const SCROLL_GRACE_PERIOD_MS = 500;
const SCROLL_DELTA_TOLERANCE_PX = 2;
const SCROLL_JUMP_THRESHOLD_PX = 350;

const END_OF_LINE_LERP_PX = 20;

const DEFAULT_CURSOR_OPTS = [
  {
    type: CursorType.Standard,
    color: 'blue',
    follow: false,
    alpha: 0,
  },
  {
    type: CursorType.Standard,
    color: 'lime',
    follow: false,
    alpha: 0,
  },
  {
    type: CursorType.ThinLeft,
    color: '#00ffd9',
    follow: true,
    alpha: 0.5,
  },
];

type Cursors = {
  lagger: Cursor;
  leader: Cursor;
  lerper: Cursor;
};

export type LerpCursorOpts = {
  scrollContainer: HTMLElement;
  numMeasures: number;
};

export class LerpCursor {
  static create(imd: InternalMusicDisplay, locator: MusicDisplayLocator, opts: LerpCursorOpts) {
    const cursors = imd.pushCursors(DEFAULT_CURSOR_OPTS.map((cursorsOption) => ({ id: Symbol(), ...cursorsOption })));
    if (cursors.length !== 3) {
      throw new Error(`expected 3 cursors, got: ${cursors.length}`);
    }

    const [lagger, leader, lerper] = cursors;

    const lerpCursor = new LerpCursor(imd.eventBus, { lagger, leader, lerper }, opts);
    lerpCursor.init(locator);
    return lerpCursor;
  }

  eventBus: MusicDisplayEventBus;

  lagger: Cursor;
  leader: Cursor;
  lerper: Cursor;
  scrollContainer: HTMLElement;
  numMeasures: number;

  private locator: MusicDisplayLocator | null = null;
  private prevCursorSnapshot: CursorSnapshot | null = null;
  private prevColoringOperation: ColoringOperation | null = null;

  private $scrollContainer: JQuery<HTMLElement> | null = null;
  private $laggerCursorElement: JQuery<HTMLElement> | null = null;

  private lastScrollId = Symbol();
  private isAutoScrollEnabled = true;

  private constructor(eventBus: MusicDisplayEventBus, cursors: Cursors, opts: LerpCursorOpts) {
    this.eventBus = eventBus;
    this.lagger = cursors.lagger;
    this.leader = cursors.leader;
    this.lerper = cursors.lerper;
    this.numMeasures = opts.numMeasures;
    this.scrollContainer = opts.scrollContainer;
  }

  get element() {
    return this.lerper.cursorElement;
  }

  private init(locator: MusicDisplayLocator) {
    const $element = $(this.element);
    $element.css('z-index', 2);
    $element.css('pointer-events', 'none');
    $element.attr('draggable', 'false');

    this.lagger.resetIterator();
    this.leader.resetIterator();
    this.leader.next();
    this.lerper.resetIterator();

    this.lagger.show();
    this.leader.show();
    this.lerper.show();

    this.locator = locator;

    this.$scrollContainer = $(this.scrollContainer);
    this.$laggerCursorElement = $(this.lagger.cursorElement);
  }

  update(timeMs: number) {
    if (!this.locator) {
      console.warn('cannot update cursors, must call init first');
      return;
    }

    const seekResult = this.locator.locateByTimeMs(timeMs);

    const nextCursorSnapshot = seekResult.cursorSnapshot;
    const prevCursorSnapshot = this.prevCursorSnapshot;

    if (nextCursorSnapshot === prevCursorSnapshot) {
      this.updateLerper(timeMs, nextCursorSnapshot);
      return;
    }

    this.updateCursors(nextCursorSnapshot);
    this.updateLerper(timeMs, nextCursorSnapshot);
  }

  clear() {
    this.prevColoringOperation?.restore();

    this.leader.hide();
    this.lagger.hide();
    this.lerper.hide();
  }

  disableAutoScroll() {
    this.isAutoScrollEnabled = false;
  }

  enableAutoScroll() {
    this.isAutoScrollEnabled = true;
    this.scrollLaggerIntoView();
  }

  private updateCursors(nextCursorSnapshot: CursorSnapshot | null) {
    if (!nextCursorSnapshot) {
      this.clear();
    } else {
      this.lagger.iterator = nextCursorSnapshot.iteratorSnapshot.get();
      this.leader.iterator = nextCursorSnapshot.iteratorSnapshot.get();
      this.leader.next();
      this.lerper.iterator = nextCursorSnapshot.iteratorSnapshot.get();

      this.lagger.update();
      this.leader.update();
      this.lerper.update();

      if (this.lagger.hidden) {
        this.lagger.show();
      }
      if (this.leader.hidden) {
        this.leader.show();
      }
      if (this.lerper.hidden) {
        this.lerper.show();
      }
    }

    // It is a performance optimization to only do this when the voice pointers change.
    if (this.isAutoScrollEnabled) {
      this.scrollLaggerIntoView();
    }

    this.prevCursorSnapshot = nextCursorSnapshot;

    this.prevColoringOperation?.restore();

    if (nextCursorSnapshot) {
      const coloringOperation = ColoringOperation.init(this.lagger);
      coloringOperation.perform();
      this.prevColoringOperation = coloringOperation;
    } else {
      this.prevColoringOperation = null;
    }

    this.eventBus.dispatch('cursorinfochanged', {
      currentMeasureIndex: this.lagger.iterator.CurrentMeasureIndex,
      currentMeasureNumber: this.lagger.iterator.CurrentMeasure.MeasureNumber,
      numMeasures: this.numMeasures,
    });
  }

  private scrollLaggerIntoView = throttle(
    () => {
      const hasNoOverflow = this.scrollContainer.scrollHeight <= this.scrollContainer.clientHeight;
      if (hasNoOverflow) {
        return;
      }

      const $container = this.$scrollContainer;
      const $target = this.$laggerCursorElement;
      if (!$container || !$target) {
        return;
      }

      const currentScrollTop = $container.scrollTop() ?? 0;

      let targetScrollTop = $target.position().top; // Will scroll to top if not rendered
      if (targetScrollTop > 0) {
        // Get all the sibling elements that are not notations and scroll past them
        $container.children().each((_, child) => {
          const $child = $(child);
          if ($child.data('notation')) {
            return;
          }
          targetScrollTop += $child.height() ?? 0;
        });
      }

      const deltaScrollTop = Math.abs(currentScrollTop - targetScrollTop);

      if (deltaScrollTop < SCROLL_DELTA_TOLERANCE_PX) {
        return;
      }

      let durationMs = SCROLL_DURATION_MS;
      if (targetScrollTop === 0) {
        durationMs = SCROLL_BACK_TOP_DURATION_MS;
      } else if (deltaScrollTop > SCROLL_JUMP_THRESHOLD_PX) {
        durationMs = 0;
      }

      // jQuery is the only library that can reasonably track when an scroll animation ends
      // which is why it's being used here. At one point, we were using it to infer when the
      // user scrolls, but it wasn't worth the effort.
      const lastScrollId = Symbol();
      const didNewScrollInvoke = () => this.lastScrollId !== lastScrollId;
      $container.animate(
        { scrollTop: targetScrollTop },
        {
          queue: false,
          duration: durationMs,
          start: () => {
            this.lastScrollId = lastScrollId;
            this.eventBus.dispatch('autoscrollstarted', {});
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
              this.eventBus.dispatch('autoscrollended', {});
            }, SCROLL_GRACE_PERIOD_MS);
          },
        }
      );
    },
    SCROLL_THROTTLE_MS,
    { leading: true, trailing: true }
  );

  private updateLerper(timeMs: number, cursorSnapshot: CursorSnapshot | null) {
    if (!cursorSnapshot) {
      return;
    }
    if (!cursorSnapshot.timeMsRange.contains(timeMs)) {
      return;
    }

    const t1 = cursorSnapshot.timeMsRange.start;
    const t2 = cursorSnapshot.timeMsRange.end;

    const x1 = this.parseFloatIgnoringPx(this.lagger.cursorElement.style.left);
    const x2 = this.isLerpingOnSameLine()
      ? this.parseFloatIgnoringPx(this.leader.cursorElement.style.left)
      : x1 + END_OF_LINE_LERP_PX;

    const m = (x2 - x1) / (t2 - t1);
    const b = x1 - m * t1;
    const t = timeMs;

    // y = mx + b
    const x = m * t + b;

    this.lerper.cursorElement.style.left = `${x}px`;
  }

  private parseFloatIgnoringPx(str: string): number {
    const numeric = str.replace('px', '');
    return parseFloat(numeric);
  }

  private isLerpingOnSameLine(): boolean {
    return this.lagger.cursorElement.style.top === this.leader.cursorElement.style.top;
  }
}
