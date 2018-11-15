import * as configure from '.';

const configureApp = () => {
  configure.namespaces();
  configure.env();
  configure.store();
  configure.debug();
  configure.auth();
  configure.message();
  configure.notification();
};

export default configureApp;
