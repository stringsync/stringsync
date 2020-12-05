import { Container, interfaces } from 'inversify';

/**
 * Creating a child does not copy its underlying binding dictionary, which is a map that resolves
 * service identifiers. This hack creates a new container without having to create new DB connections,
 * redis connections, etc. without having to clean them up. This allows us to rebind dependencies
 * such that they are request scoped.
 *
 * https://github.com/inversify/InversifyJS/issues/1076
 */
export const createReqContainerHack = (container: interfaces.Container): Container => {
  const reqContainer = new Container();
  (reqContainer as any)._bindingDictionary = (container as any)._bindingDictionary.clone();
  return reqContainer;
};
