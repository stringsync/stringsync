import * as config from './';

const configure = () => {
  config.namespaces();
  config.env();
  config.auth();
  config.message();
  config.notification();
}

export default configure;
