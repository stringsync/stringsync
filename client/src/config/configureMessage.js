import { message } from 'antd';

window.ss = window.ss || {};
window.ss.message = message;

/**
 * Configure antd's message system
 * 
 * @returns {void}
 */
const configureMessage = () => {
  message.config({ duration: 2 });
};

export default configureMessage;
