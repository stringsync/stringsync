import { Notation, Tag, User } from '../../domain';

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
  None = 'none',
  Dynamic = 'dynamic',
  User = 'user',
  Random = 'random',
}
