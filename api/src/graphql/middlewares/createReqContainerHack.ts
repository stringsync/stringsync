import { Container } from 'inversify';
import { TYPES } from '../../inversify.constants';
import { ctor } from '../../util';

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

/**
 * Creating a child does not copy its underlying binding dictionary, which is a map that resolves
 * service identifiers. This hack creates a new container without having to create new DB connections,
 * redis connections, etc. without having to clean them up. This allows us to rebind dependencies
 * such that they are request scoped.
 *
 * https://github.com/inversify/InversifyJS/issues/1076
 */
export const createReqContainerHack = (container: Container): Container => {
  const reqContainer = new Container();
  (reqContainer as any)._bindingDictionary = (container as any)._bindingDictionary.clone();
  applyReqRebindings(reqContainer);
  return reqContainer;
};
