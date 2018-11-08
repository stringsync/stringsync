import { message } from 'antd';

/**
 * Configure antd's message system
 *
 * @returns {void}
 */
const configureMessage = () => {
  window.ss.message = message;
  message.config({ duration: 2 });
};

export default configureMessage;
