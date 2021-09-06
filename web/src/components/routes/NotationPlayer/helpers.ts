import { ScrollAlignment } from '../../../lib/MusicDisplay';
import { PointerPosition } from '../../../lib/MusicDisplay/pointer';
import { NumberRange } from '../../../util/NumberRange';

enum ScrollIntentType {
  Indeterminate,
  Up,
  Down,
}

const CENTER_REGION_SIZE_FRACTION = 0.5;

const getScrollAlignment = (scrollIntentType: ScrollIntentType) => {
  switch (scrollIntentType) {
    case ScrollIntentType.Indeterminate:
      return ScrollAlignment.Center;
    case ScrollIntentType.Up:
      return ScrollAlignment.Bottom;
    case ScrollIntentType.Down:
      return ScrollAlignment.Top;
    default:
      return ScrollAlignment.Top;
  }
};

const getScrollIntentType = (position: PointerPosition, scrollContainer: HTMLElement): ScrollIntentType => {
  const height = scrollContainer.offsetHeight;
  const centerRegionSize = height * CENTER_REGION_SIZE_FRACTION;
  const midpoint = height / 2;
  const centerRange = NumberRange.from(midpoint - centerRegionSize / 2).to(midpoint + centerRegionSize / 2);

  if (centerRange.contains(position.relY)) {
    return ScrollIntentType.Indeterminate;
  }

  return position.relY < midpoint ? ScrollIntentType.Up : ScrollIntentType.Down;
};

export const calculateScrollAlignment = (position: PointerPosition, scrollContainer: HTMLElement): ScrollAlignment => {
  const scrollIntentType = getScrollIntentType(position, scrollContainer);
  return getScrollAlignment(scrollIntentType);
};
