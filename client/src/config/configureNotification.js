import { notification } from 'antd';

window.ss = window.ss || {};
window.ss.notification = notification;

/**
 * Configures antd's notification system
 * https://ant.design/components/notification/
 *
 * @returns {void}
 */
const configureNotification = () => {
  notification.config({ duration: 3 });
};

export default configureNotification;
