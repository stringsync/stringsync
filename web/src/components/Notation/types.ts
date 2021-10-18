import { Notation } from '../../domain';

export type NotationLayout = 'theater' | 'sidecar';

export type NotationLayoutOptions = {
  target: NotationLayout;
  permitted: NotationLayout[];
};

export type RenderableNotation = Pick<
  Notation,
  'musicXmlUrl' | 'thumbnailUrl' | 'videoUrl' | 'deadTimeMs' | 'durationMs'
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
  isAutoScrollPreferred: boolean;
  isVideoVisible: boolean;
  scaleSelectionType: ScaleSelectionType;
  selectedScale: string | null;
  isLoopActive: boolean;
};
