import { Cursor } from 'opensheetmusicdisplay';
import { Duration } from '../../../util/Duration';

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
  Center,
  Bottom,
}

export enum ObjectRelativeSize {
  Unknown,
  Underflow,
  Overflow,
}

export enum ObjectVisibility {
  None,
  Full,
  Partial,
}

export enum ObjectRelativePosition {
  Unknown,
  Inside,
  Above,
  Below,
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

export type AutoScrollTarget = {
  scrollTop: number;
  duration: Duration;
};

export interface ScrollBehavior {
  start(): void;
  stop(): void;
  call(request: ScrollRequest): void;
}
