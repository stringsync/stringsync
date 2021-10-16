import { Notation } from '../../domain';
import { Nullable } from '../../util/types';

export type NotationLayout = 'theater' | 'sidecar';

export type NotationLayoutOptions = {
  default?: NotationLayout;
  preferred?: Nullable<NotationLayout>;
  permitted?: NotationLayout[];
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
