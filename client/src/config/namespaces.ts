const configureNamespaces = (): void => {
  window.ss = window.ss || {};

  // auth
  window.ss.sessionSync = {
    callback: undefined,
    user: {}
  };

  // antd message and notification
  window.ss.message = undefined;
  window.ss.notification = undefined;

  // redux store
  window.ss.store = undefined;
  const a = 'asdf';
};

export default configureNamespaces;
