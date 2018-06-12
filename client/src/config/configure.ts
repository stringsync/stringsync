import * as config from './';

const configure = () => {
  config.namespaces();
  config.auth();
  config.message();
  config.notification();
}

export default configure;
