import $ from 'jquery';
import { throttle } from 'lodash';
import { Cursor, MusicSheet } from 'opensheetmusicdisplay';
import { ColoringOperation } from './ColoringOperation';
import { Callback, SyncSettings } from './types';
import { VoicePointer, VoiceSeeker } from './VoiceSeeker';

const SCROLL_DURATION_MS = 100;
const SCROLL_BACK_TOP_DURATION_MS = 300;
const SCROLL_THROTTLE_MS = SCROLL_DURATION_MS + 10;
const SCROLL_DELTA_TOLERANCE_PX = 2;
const SCROLL_GRACE_PERIOD_MS = 500;
const SCROLL_JUMP_THRESHOLD_PX = 350;

const END_OF_LINE_LERP_PX = 20;

export type LerpCursorOpts = {
  lagger: Cursor;
  leader: Cursor;
  lerper: Cursor;
  probe: Cursor;
  scrollContainer: HTMLElement;
  onAutoScrollStart: Callback;
  onAutoScrollEnd: Callback;
};

export class LerpCursor {
  readonly lagger: Cursor;
  readonly leader: Cursor;
  readonly lerper: Cursor;
  readonly probe: Cursor;
  readonly scrollContainer: HTMLElement;
  readonly onAutoScrollStart: Callback;
  readonly onAutoScrollEnd: Callback;

  private isAutoScrollEnabled = true;
  private voiceSeeker: VoiceSeeker | null = null;
  private prevVoicePointer: VoicePointer | null = null;
  private prevColoringOperation: ColoringOperation | null = null;

  private $scrollContainer: JQuery<HTMLElement> | null = null;
  private $laggerCursorElement: JQuery<HTMLElement> | null = null;
  private lastScrollId = Symbol();

  constructor(opts: LerpCursorOpts) {
    this.lagger = opts.lagger;
    this.leader = opts.leader;
    this.lerper = opts.lerper;
    this.probe = opts.probe;
    this.scrollContainer = opts.scrollContainer;
    this.onAutoScrollStart = opts.onAutoScrollStart;
    this.onAutoScrollEnd = opts.onAutoScrollEnd;
  }

  init(musicSheet: MusicSheet, syncSettings: SyncSettings) {
    this.lerper.cursorElement.style.zIndex = '2';

    this.lagger.resetIterator();
    this.leader.resetIterator();
    this.leader.next();
    this.lerper.resetIterator();

    this.lagger.show();
    this.leader.show();
    this.lerper.show();
    this.probe.show();

    this.voiceSeeker = VoiceSeeker.create(this.probe, musicSheet, syncSettings);

    this.$scrollContainer = $(this.scrollContainer);
    this.$laggerCursorElement = $(this.lagger.cursorElement);
  }

  disableAutoScroll() {
    this.isAutoScrollEnabled = false;
  }

  enableAutoScroll() {
    this.isAutoScrollEnabled = true;
    this.onAutoScrollStart();
    this.scrollLaggerIntoView();
  }

  update(timeMs: number) {
    if (!this.voiceSeeker) {
      console.warn('cannot update cursors, must call init first');
      return;
    }

    const seekResult = this.voiceSeeker.seek(timeMs);

    const nextVoicePointer = seekResult.voicePointer;
    const prevVoicePointer = this.prevVoicePointer;

    if (nextVoicePointer === prevVoicePointer) {
      this.updateLerper(timeMs, nextVoicePointer);
      return;
    }

    this.onVoicePointerChange(nextVoicePointer);
    this.updateLerper(timeMs, nextVoicePointer);
  }

  clear() {
    this.prevColoringOperation?.restore();

    this.leader.hide();
    this.lagger.hide();
    this.lerper.hide();
  }

  private onVoicePointerChange(nextVoicePointer: VoicePointer | null) {
    if (!nextVoicePointer) {
      this.clear();
    } else {
      // Since we know this voicePointer is new, we don't need to update
      // the lerper.
      this.lagger.iterator = nextVoicePointer.iteratorSnapshot.get();
      this.leader.iterator = nextVoicePointer.iteratorSnapshot.get();
      this.leader.next();
      this.lerper.iterator = nextVoicePointer.iteratorSnapshot.get();

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

    if (this.isAutoScrollEnabled) {
      // It is a performance optimization to only do this when the voice pointers change.
      this.scrollLaggerIntoView();
    }

    this.prevVoicePointer = nextVoicePointer;

    this.prevColoringOperation?.restore();

    if (nextVoicePointer) {
      const coloringOperation = ColoringOperation.init(this.lagger);
      coloringOperation.perform();
      this.prevColoringOperation = coloringOperation;
    } else {
      this.prevColoringOperation = null;
    }
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
      // which is why it's being used here.
      const lastScrollId = Symbol();
      const didNewScrollInvoke = () => this.lastScrollId !== lastScrollId;
      $container.animate(
        { scrollTop: targetScrollTop },
        {
          queue: false,
          duration: durationMs,
          start: () => {
            this.lastScrollId = lastScrollId;
            this.onAutoScrollStart();
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
              this.onAutoScrollEnd();
            }, SCROLL_GRACE_PERIOD_MS);
          },
        }
      );
    },
    SCROLL_THROTTLE_MS,
    { leading: true, trailing: true }
  );

  private updateLerper(timeMs: number, voicePointer: VoicePointer | null) {
    if (!voicePointer) {
      return;
    }
    if (!voicePointer.timeMsRange.contains(timeMs)) {
      return;
    }

    const t1 = voicePointer.timeMsRange.start;
    const t2 = voicePointer.timeMsRange.end;

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