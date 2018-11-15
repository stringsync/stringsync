import { INotation } from "./notation";
import { ISession } from "./session";
import { ITag } from "./tag";

export interface IStore {
  notations: INotation[];
  notation: INotation;
  session: ISession;
  tags: ITag[];
}
