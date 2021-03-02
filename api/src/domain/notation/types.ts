export interface Notation {
  id: string;
  cursor: number;
  createdAt: Date;
  updatedAt: Date;
  status: NotationStatuses;
  songName: string;
  artistName: string;
  deadTimeMs: number;
  durationMs: number;
  private: boolean;
  transcriberId: string;
  thumbnailUrl: string | null;
  videoUrl: string | null;
}

export enum NotationStatuses {
  DRAFT = 'DRAFT',
  PUBLISH = 'PUBLISH',
}
