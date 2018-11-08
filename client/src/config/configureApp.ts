import * as configure from '.';

const configureApp = () => {
  configure.namespaces();
  configure.store();
  configure.env();
  configure.debug();
  configure.auth();
  configure.message();
  configure.notification();
};

export default configureApp;
