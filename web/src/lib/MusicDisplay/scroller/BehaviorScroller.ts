import { Cursor } from 'opensheetmusicdisplay';
import { ScrollBehaviorType, ScrollRequest, ScrollRequestType } from '.';
import { InternalMusicDisplay } from '../InternalMusicDisplay';
import { AutoScrollBehavior } from './AutoScrollBehavior';
import { ManualScrollBehavior } from './ManualScrollBehavior';
import { NoopScrollBehavior } from './NoopScrollBehavior';
import { ScrollBehavior } from './types';

export class BehaviorScroller {
  type = ScrollBehaviorType.Auto;

  private scrollContainer: HTMLElement;
  private imd: InternalMusicDisplay;
  private behavior: ScrollBehavior;

  constructor(scrollContainer: HTMLElement, imd: InternalMusicDisplay) {
    this.scrollContainer = scrollContainer;
    this.imd = imd;
    this.behavior = this.makeBehavior(this.type);
    this.behavior.start();
  }

  scrollToCursor(cursor: Cursor) {
    this.send({ type: ScrollRequestType.Cursor, cursor });
  }

  updateScrollIntent(relY: number) {
    this.send({ type: ScrollRequestType.Intent, relY });
  }

  startAutoScrolling() {
    this.changeBehavior(ScrollBehaviorType.Auto);
  }

  startManualScrolling() {
    this.changeBehavior(ScrollBehaviorType.Manual);
  }

  disable() {
    this.changeBehavior(ScrollBehaviorType.Noop);
  }

  private send(request: ScrollRequest) {
    this.behavior.handle(request);
  }

  private changeBehavior(type: ScrollBehaviorType) {
    this.behavior.stop();
    this.type = type;
    const behavior = this.makeBehavior(type);
    this.behavior = behavior;
    this.behavior.start();
    this.imd?.eventBus.dispatch('scrollbehaviorchanged', { type });
  }

  private makeBehavior(type: ScrollBehaviorType): ScrollBehavior {
    switch (type) {
      case ScrollBehaviorType.Noop:
        return new NoopScrollBehavior();
      case ScrollBehaviorType.Auto:
        return new AutoScrollBehavior(this.scrollContainer, this.imd);
      case ScrollBehaviorType.Manual:
        return new ManualScrollBehavior(this.scrollContainer);
      default:
        return new NoopScrollBehavior();
    }
  }
}
