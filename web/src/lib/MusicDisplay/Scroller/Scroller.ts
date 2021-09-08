import { ScrollBehaviorType, ScrollRequest } from '.';
import { InternalMusicDisplay } from '../InternalMusicDisplay';
import { AutoScrollBehavior } from './AutoScrollBehavior';
import { ManualScrollBehavior } from './ManualScrollBehavior';
import { NoopScrollBehavior } from './NoopScrollBehavior';
import { ScrollBehavior } from './types';

export class Scroller {
  private scrollContainer: HTMLElement;
  private imd: InternalMusicDisplay;
  private behavior: ScrollBehavior;

  constructor(scrollContainer: HTMLElement, imd: InternalMusicDisplay) {
    this.scrollContainer = scrollContainer;
    this.imd = imd;
    this.behavior = new AutoScrollBehavior(scrollContainer, imd);
  }

  stop() {
    this.behavior.stop();
  }

  send(request: ScrollRequest) {
    this.behavior.handle(request);
  }

  changeBehaviorTo(type: ScrollBehaviorType) {
    this.behavior.stop();
    const behavior = this.makeBehavior(type);
    this.behavior = behavior;
    this.behavior.start();
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
