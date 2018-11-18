import { INotation } from "./notation";
import { ISession } from "./session";
import { ITag } from "./tag";
import { IPlayer, PlayerStates } from './youtube';

export type NotationsState = INotation[];
export type NotationState = INotation;
export type SessionState = ISession;
export type TagsState = ITag[];

export interface IVideoState {
  kind: string;
  src: string;
  player?: IPlayer | null;
  playerState?: PlayerStates;
  isActive?: boolean;
}

export interface INotationMenuState {
  visible: boolean;
}

export interface IStore {
  notations: NotationsState;
  notation: NotationState;
  notationMenu: INotationMenuState;
  session: SessionState;
  tags: TagsState;
  video: IVideoState;
}
