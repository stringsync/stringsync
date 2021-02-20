import { Handler, Response } from 'express';
import { graphqlHTTP } from 'express-graphql';
import { GraphQLSchema } from 'graphql';
import { Container } from 'inversify';
import { TYPES } from '../../inversify.constants';
import { ctor } from '../../util';
import { ReqCtx, SessionRequest } from '../types';
import { formatError } from './formatError';

/**
 * Creating a child does not copy its underlying binding dictionary, which is a map that resolves
 * service identifiers. This hack creates a new container without having to create new DB connections,
 * redis connections, etc. without having to clean them up. This allows us to rebind dependencies
 * such that they are request scoped.
 *
 * https://github.com/inversify/InversifyJS/issues/1076
 */
const createReqContainerHack = (container: Container): Container => {
  const reqContainer = new Container();
  (reqContainer as any)._bindingDictionary = (container as any)._bindingDictionary.clone();
  return reqContainer;
};

const applyReqRebindings = (container: Container) => {
  for (const [type, id] of Object.entries<symbol>(TYPES)) {
    if (type.endsWith('Loader')) {
      const loader = container.get(id);
      container
        .rebind(id)
        .to(ctor(loader))
        .inSingletonScope();
    }
  }
};

const createReqCtx = (req: SessionRequest, res: Response, container: Container): ReqCtx => {
  const reqAt = new Date();
  const reqContainer = createReqContainerHack(container);
  applyReqRebindings(reqContainer);
  return { reqAt, req, res, container };
};

export const withGraphQL = (container: Container, schema: GraphQLSchema): Handler => (req, res) => {
  const context = createReqCtx(req as SessionRequest, res, container);

  const middleware = graphqlHTTP({
    schema,
    context,
    graphiql: false,
    customFormatErrorFn: formatError,
  });

  return middleware(req, res);
};
