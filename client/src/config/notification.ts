import { notification } from 'antd';

/**
 * Configures antd's notification system
 * https://ant.design/components/notification/
 *
 * @returns {void}
 */
const configureNotification = () => {
  window.ss.notification = notification;
  notification.config({ duration: 3 });
};

export default configureNotification;
