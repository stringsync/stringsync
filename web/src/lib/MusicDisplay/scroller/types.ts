import { Cursor } from 'opensheetmusicdisplay';
import { Duration } from '../../../util/Duration';

export enum ScrollBehaviorType {
  Noop,
  Auto,
  Manual,
}

export enum ScrollDirection {
  None,
  Up,
  Down,
}

export enum ScrollSpeed {
  None,
  Crawl,
  Walk,
  Run,
  Sprint,
  Teleport,
}

export enum ScrollAlignment {
  None,
  Top,
  Bottom,
}

export enum ScrollRequestType {
  Cursor,
  Intent,
}

export type ScrollIntent = {
  speed: ScrollSpeed;
  direction: ScrollDirection;
};

export type CursorScrollRequest = {
  type: ScrollRequestType.Cursor;
  cursor: Cursor;
};

export type IntentScrollRequest = {
  type: ScrollRequestType.Intent;
  relY: number;
};

export type ScrollRequest = CursorScrollRequest | IntentScrollRequest;

export type Easing = 'linear' | 'swing';

export interface ScrollBehavior {
  start(): void;
  stop(): void;
  handle(request: ScrollRequest): void;
}

export enum SizeComparison {
  Indeterminate = 'Indeterminate',
  Smaller = 'Smaller',
  Equal = 'Equal',
  Bigger = 'Bigger',
}

export enum HorizontalEdgeIntersection {
  Indeterminate = 'Indeterminate',
  None = 'None',
  Top = 'Top',
  Bottom = 'Bottom',
  Both = 'Bottom',
}

export enum PositionalRelationship {
  Indeterminate = 'None',
  Above = 'Above',
  Below = 'Below',
}

export type AutoScrollTarreadonly = {
  scrollTop: number;
  duration: Duration;
  easing: Easing;
  onAfterScroll: () => void;
};

export interface IntersectionObserverAnalysis {
  readonly visibility: number;
  readonly invisibility: number;
  readonly visibleHeightPx: number;
  readonly invisibleHeightPx: number;
  readonly sizeComparison: SizeComparison;
  readonly horizontalEdgeIntersection: HorizontalEdgeIntersection;
  readonly positionalRelationship: PositionalRelationship;
}
