import { Notation } from '../../domain';

export type NotationLayout = 'theater' | 'sidecar';

export type NotationLayoutOptions = {
  target: NotationLayout;
  permitted: NotationLayout[];
};

export type RenderableNotation = Pick<
  Notation,
  'musicXmlUrl' | 'thumbnailUrl' | 'videoUrl' | 'deadTimeMs' | 'durationMs' | 'artistName' | 'songName'
>;

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

export type NotationSettings = {
  preferredLayout: NotationLayout;
  isFretboardVisible: boolean;
  fretMarkerDisplay: FretMarkerDisplay;
  isAutoscrollPreferred: boolean;
  isVideoVisible: boolean;
  scaleSelectionType: ScaleSelectionType;
  selectedScale: string | null;
  isLoopActive: boolean;
};
