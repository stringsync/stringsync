export interface Notation {
  id: string;
  cursor: number;
  createdAt: Date;
  updatedAt: Date;
  songName: string;
  artistName: string;
  deadTimeMs: number;
  durationMs: number;
  private: boolean;
  transcriberId: string;
  thumbnailUrl: string | null;
  videoUrl: string | null;
  musicXmlUrl: string | null;
}
