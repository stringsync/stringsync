import { RelativePosition, RelativeSize, Visibility } from '.';
import { NumberRange } from '../../../util/NumberRange';

export class ScrollerViewport {
  private scrollContainer: HTMLElement;

  constructor(scrollContainer: HTMLElement) {
    this.scrollContainer = scrollContainer;
  }

  getRelativeSize(absYRange: NumberRange): RelativeSize {
    return this.scrollContainer.offsetHeight > absYRange.size ? RelativeSize.Overflow : RelativeSize.Underflow;
  }

  getVisibility(absYRange: NumberRange): Visibility {
    return Visibility.None;
  }

  getRelativePosition(absYRange: NumberRange): RelativePosition {
    return RelativePosition.Unknown;
  }
}
