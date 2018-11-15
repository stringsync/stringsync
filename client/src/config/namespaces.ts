const configureNamespaces = (): void => {
  window.ss = window.ss || {};
  window.ss.store = window.ss.store || undefined;
};

export default configureNamespaces;
