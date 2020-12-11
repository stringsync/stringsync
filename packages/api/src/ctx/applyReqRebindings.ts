import { ctor } from '@stringsync/common';
import { Container } from '@stringsync/di';
import { REPOS_TYPES } from '@stringsync/repos';

export const applyReqRebindings = (container: Container) => {
  for (const [type, id] of Object.entries(REPOS_TYPES)) {
    if (type.endsWith('Loader')) {
      const loader = container.get(id);
      container
        .rebind(id)
        .to(ctor(loader))
        .inSingletonScope();
    }
  }
};
