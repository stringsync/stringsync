import { Request } from 'express';
import { Container } from 'inversify';
import * as uuid from 'uuid';
import { InternalError } from '../errors';
import { container } from '../inversify.config';
import { SessionUser } from '../services';
import { createReqContainerHack } from './middlewares/createReqContainerHack';

type State = {
  reqAt: Date;
  reqId: string;
  sessionUser: SessionUser;
  container: Container;
};

export class Ctx {
  // WeakMap is used so that when the request is GC'd, the Ctx instance is, too.
  private static bindings = new WeakMap<Request, Ctx>();

  static bind(req: Request): void {
    const ctx = new Ctx();
    Ctx.bindings.set(req, ctx);
  }

  static get(req: Request): Ctx | null {
    return Ctx.bindings.get(req) || null;
  }

  private state: Partial<State> = {
    reqAt: new Date(),
    reqId: uuid.v4(),
    container: createReqContainerHack(container),
  };

  private constructor() {
    // noop
  }

  // toObject(): State {
  //   return {
  //     reqAt: this.getReqAt(),
  //     reqId: this.getReqId(),
  //     sessionUser: this.getSessionUser(),
  //   };
  // }

  getReqAt(): Date {
    return this.fetch('reqAt');
  }

  getReqId(): string {
    return this.fetch('reqId');
  }

  setSessionUser(sessionUser: SessionUser): void {
    this.state.sessionUser = sessionUser;
  }

  getSessionUser(): SessionUser {
    return this.fetch('sessionUser');
  }

  private fetch<T extends keyof State>(field: T): State[T] {
    const val = this.state[field];
    if (typeof val === 'undefined') {
      throw new InternalError(`field not set: ${field}`);
    }
    return val as State[T];
  }
}
