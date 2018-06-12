import { configureAuth, configureNotification, configureMessage } from './';

const configure = () => {
  configureAuth();
  configureNotification();
  configureMessage();
}

export default configure;
