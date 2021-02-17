import { Container } from 'inversify';
import { TYPES } from '../../inversify.constants';
import { ctor } from '../../util/ctor';

export const applyReqRebindings = (container: Container) => {
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
