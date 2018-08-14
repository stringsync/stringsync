import { Maestro, RafLoop } from 'services';

const configureNamespaces = (): void => {
  window.ss = window.ss || {};

  // auth
  window.ss.sessionSync = {
    callback: undefined,
    user: {}
  };

  // redux store
  window.ss.store = undefined;

  // maestro
  window.ss.maestro = new Maestro(0, 120, 1);
  window.ss.rafLoop = new RafLoop();
};

export default configureNamespaces;
