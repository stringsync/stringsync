import { Notation, Tag, User } from '../../domain';
import { DisplayMode } from '../../lib/musicxml';

export type NotationLayout = 'theater' | 'sidecar';

export type NotationLayoutOptions = {
  target: NotationLayout;
  permitted: NotationLayout[];
};

export type RenderableNotation = Pick<
  Notation,
  'id' | 'musicXmlUrl' | 'thumbnailUrl' | 'videoUrl' | 'deadTimeMs' | 'durationMs' | 'artistName' | 'songName'
> & {
  transcriber: Pick<User, 'username'>;
  tags: Tag[];
};

export enum FretMarkerDisplay {
  None,
  Degree,
  Note,
}

export enum ScaleSelectionType {
  None,
  Dynamic,
  User,
  Random,
}

export type Settings = {
  preferredLayout: NotationLayout;
  isFretboardVisible: boolean;
  fretMarkerDisplay: FretMarkerDisplay;
  isAutoscrollPreferred: boolean;
  isVideoVisible: boolean;
  scaleSelectionType: ScaleSelectionType;
  selectedScale: string | null;
  isLoopActive: boolean;
  defaultTheaterHeightPx: number;
  defaultSidecarWidthPx: number;
  displayMode: DisplayMode;
};

export type DurableSettings = Pick<
  Settings,
  | 'isFretboardVisible'
  | 'isAutoscrollPreferred'
  | 'isVideoVisible'
  | 'fretMarkerDisplay'
  | 'preferredLayout'
  | 'defaultSidecarWidthPx'
  | 'defaultTheaterHeightPx'
  | 'displayMode'
>;
