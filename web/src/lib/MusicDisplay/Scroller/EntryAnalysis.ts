import { isNull } from 'lodash';
import {
  HorizontalEdgeIntersection,
  IntersectionObserverAnalysis,
  PositionalRelationship,
  SizeComparison,
} from './types';

export class EntryAnalysis implements IntersectionObserverAnalysis {
  static compute(entry: IntersectionObserverEntry | null) {
    const analysis = new EntryAnalysis(entry);
    analysis.init();
    return analysis;
  }

  readonly entry: IntersectionObserverEntry | null;
  visibility = 0;
  sizeComparison = SizeComparison.Indeterminate;
  horizontalEdgeIntersection = HorizontalEdgeIntersection.Indeterminate;
  positionalRelationship = PositionalRelationship.Indeterminate;

  private constructor(entry: IntersectionObserverEntry | null) {
    this.entry = entry;
  }

  get invisibility() {
    return 1 - this.visibility;
  }

  get visibleHeightPx() {
    return this.visibility * this.getHeightPx();
  }

  get invisibleHeightPx() {
    return this.invisibility * this.getHeightPx();
  }

  private init() {
    if (isNull(this.entry)) {
      return;
    }
    if (isNull(this.entry.rootBounds)) {
      return;
    }
    this.visibility = this.entry.intersectionRatio;
    this.sizeComparison = this.computeSizeComparison(this.entry);
    this.horizontalEdgeIntersection = this.computeHorizontalEdgeIntersection(this.entry);
    this.positionalRelationship = this.computePositionalRelationship(this.entry);
  }

  private getHeightPx() {
    return this.entry ? this.entry.boundingClientRect.height : 0;
  }

  private getContainerHeightPx(entry: IntersectionObserverEntry): number {
    return entry.rootBounds?.height ?? 0;
  }

  private getContainerTopPx(entry: IntersectionObserverEntry): number {
    return entry.rootBounds?.top ?? 0;
  }

  private computeSizeComparison(entry: IntersectionObserverEntry): SizeComparison {
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

  private computeHorizontalEdgeIntersection(entry: IntersectionObserverEntry): HorizontalEdgeIntersection {
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

  private computePositionalRelationship(entry: IntersectionObserverEntry): PositionalRelationship {
    const containerHeightPx = this.getContainerHeightPx(entry);
    const containerTopPx = this.getContainerTopPx(entry);
    const containerMidpointPx = containerTopPx + containerHeightPx / 2;

    const entryHeightPx = entry.boundingClientRect.height;
    const entryTopPx = entry.boundingClientRect.top;
    const entryMidpointPx = entryTopPx + entryHeightPx / 2;

    return entryMidpointPx < containerMidpointPx ? PositionalRelationship.Above : PositionalRelationship.Below;
  }
}
