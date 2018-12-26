
import { INotation } from "./notation";
import { ISession } from "./session";
import { ITag } from "./tag";
import { IPlayer, PlayerStates } from './youtube';
import { Maestro, ISpec } from '../models/maestro/Maestro';

export type NotationsState = INotation[];
export type NotationState = INotation;
export type SessionState = ISession;
export type TagsState = ITag[];

export interface IVideoState {
  kind: string;
  src: string;
  player: IPlayer | null;
  playerState: PlayerStates | void;
  isActive: boolean | void;
}

export interface INotationMenuState {
  visible: boolean;
  fretboardVisible: boolean;
}

export interface IScoreState {
  maestro: Maestro | null;
  scrolling: boolean;
  autoScroll: boolean;
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
