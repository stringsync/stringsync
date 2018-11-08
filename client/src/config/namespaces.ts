const configureNamespaces = (): void => {
  window.ss = window.ss || {};

  // auth
  window.ss.sessionSync = window.ss.sessionSync || {
    callback: undefined,
    user: {},
  };

  // redux store
  window.ss.store = window.ss.store || undefined;
};

export default configureNamespaces;
