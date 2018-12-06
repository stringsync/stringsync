import { INotation } from "./notation";
import { ISession } from "./session";
import { ITag } from "./tag";
import { IPlayer, PlayerStates } from './youtube';
import { Maestro } from '../models/maestro/Maestro';

export type NotationsState = INotation[];
export type NotationState = INotation;
export type SessionState = ISession;
export type TagsState = ITag[];

export interface IVideoState {
  kind: string;
  src: string;
  currentTimeMs: number;
  player: IPlayer | null;
  playerState?: PlayerStates;
  isActive?: boolean;
}

export interface INotationMenuState {
  visible: boolean;
  fretboardVisible: boolean;
}

export interface IScoreState {
  maestro: Maestro | null;
}

export interface IStore {
  notations: NotationsState;
  notation: NotationState;
  notationMenu: INotationMenuState;
  score: IScoreState;
  session: SessionState;
  tags: TagsState;
  video: IVideoState;
}
