import { INotation } from "./notation";
import { ISession } from "./session";

export interface IStore {
  notations: INotation[];
  session: ISession;
}
