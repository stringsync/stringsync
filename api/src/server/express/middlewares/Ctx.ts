import { Request } from 'express';
import { Container } from 'inversify';
import * as uuid from 'uuid';
import { InternalError } from '../../../errors';
import { container } from '../../../inversify.config';
import { SessionUser } from '../../types';
import { applyReqContainerRebindings } from './applyReqContainerRebindings';
import { createReqContainerHack } from './createReqContainerHack';

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

  static get(req: Request): Ctx {
    const ctx = Ctx.bindings.get(req);
    if (!ctx) {
      throw new InternalError(`ctx not bound to req`);
    }
    return ctx;
  }

  private state: Partial<State> = {
    reqAt: new Date(),
    reqId: uuid.v4(),
  };

  toObject(): State {
    return {
      reqAt: this.getReqAt(),
      reqId: this.getReqId(),
      sessionUser: this.getSessionUser(),
      container: this.getContainer(),
    };
  }

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

  getContainer(): Container {
    if (this.state.container) {
      return this.state.container;
    }
    const reqContainer = createReqContainerHack(container);
    applyReqContainerRebindings(reqContainer, { reqId: this.getReqId(), sessionUser: this.getSessionUser() });
    this.state.container = reqContainer;
    return reqContainer;
  }

  private fetch<T extends keyof State>(field: T): State[T] {
    const val = this.state[field];
    if (typeof val === 'undefined') {
      throw new InternalError(`field not set: ${field}`);
    }
    return val as State[T];
  }
}
