const configureNamespaces = (): void => {
  window.ss = window.ss || {};

  // auth
  window.ss.sessionSync = {
    callback: undefined,
    user: {}
  };

  // redux store
  window.ss.store = undefined;
  const a = 'asdf';
};

export default configureNamespaces;
