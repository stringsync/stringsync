import { RelativePosition, RelativeSize, Visibility } from '.';
import { NumberRange } from '../../../util/NumberRange';

export class ScrollerViewport {
  private scrollContainer: HTMLElement;

  constructor(scrollContainer: HTMLElement) {
    this.scrollContainer = scrollContainer;
  }

  getRelativeSize(yRange: NumberRange): RelativeSize {
    return this.scrollContainer.offsetHeight > yRange.size ? RelativeSize.Overflow : RelativeSize.Underflow;
  }

  getVisibility(yRange: NumberRange): Visibility {
    return Visibility.None;
  }

  getRelativePosition(yRange: NumberRange): RelativePosition {
    return RelativePosition.Unknown;
  }
}
