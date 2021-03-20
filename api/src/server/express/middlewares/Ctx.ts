import { Request } from 'express';
import { Container } from 'inversify';
import { set } from 'lodash';
import * as uuid from 'uuid';
import { InternalError } from '../../../errors';
import { container } from '../../../inversify.config';
import { SessionUser } from '../../types';
import { applyReqContainerRebindings } from './applyReqContainerRebindings';
import { createReqContainerHack } from './createReqContainerHack';

// The state object allows us to start with a partial state,
// then ensure defined values are retrieved in Ctx.fetch.
// Otherwise, we would have to make Ctx's properties public
// in order to index typings.
type State = {
  reqAt: Date;
  reqId: string;
  sessionUser: SessionUser;
  container: Container;
};

export class Ctx {
  // WeakMap is used so that when the request is GC'd, the Ctx instance is, too.
  private static bindings = new WeakMap<Request, Ctx>();

  static bind(req: Request): Ctx {
    if (Ctx.bindings.has(req)) {
      throw new InternalError(`cannot bind req more than once`);
    }
    const ctx = new Ctx();
    Ctx.bindings.set(req, ctx);
    return ctx;
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

  getReqAt(): Date {
    return this.fetch('reqAt');
  }

  getReqId(): string {
    return this.fetch('reqId');
  }

  setSessionUser(req: Request, sessionUser: SessionUser): void {
    this.state.sessionUser = sessionUser;
    // express-session requires us to mutate the req object to
    // persist between requests
    set(req, 'session.user', sessionUser);
  }

  getSessionUser(): SessionUser {
    return this.fetch('sessionUser');
  }

  getContainer(): Container {
    if (!this.state.container) {
      this.state.container = this.createContainer();
    }
    return this.state.container;
  }

  private createContainer(): Container {
    const reqContainer = createReqContainerHack(container);
    applyReqContainerRebindings(reqContainer, { reqId: this.getReqId(), sessionUser: this.getSessionUser() });
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
