import { INotation } from "./notation";
import { ISession } from "./session";
import { ITag } from "./tag";
import { IPlayer, PlayerStates } from './youtube';

export type NotationsState = INotation[];
export type NotationState = INotation;
export type SessionState = ISession;
export type TagsState = ITag[];

export interface IVideoState {
  kind: Video.Kinds | null;
  src: string;
  player: IPlayer | null;
  playerState?: PlayerStates;
  isActive?: boolean;
}

export interface IStore {
  notations: NotationsState;
  notation: NotationState;
  session: SessionState;
  tags: TagsState;
  video: IVideoState;
}
