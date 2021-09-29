import { notification } from 'antd';
import React, { useEffect } from 'react';
import { useServiceWorker } from '../../ctx/service-worker';
import { Nothing } from '../Nothing/Nothing';
import { TimeoutButton } from '../TimeoutButton/TimeoutButton';

export const NewVersionNotifier: React.FC = () => {
  const { isUpdated, registration } = useServiceWorker();

  useEffect(() => {
    if (!isUpdated || !registration || !registration.waiting) {
      return;
    }

    const sw = registration.waiting;

    const updateServiceWorker = () => {
      sw.postMessage({ type: 'SKIP_WAITING' });
      sw.addEventListener('statechange', (event: any) => {
        const state = event.target.state as ServiceWorkerState;
        if (state === 'activated') {
          window.location.reload();
        }
      });
    };

    notification.info({
      message: 'Update Available',
      description: (
        <p>
          You are{' '}
          <b>
            <u>not</u>
          </b>{' '}
          on the latest version of StringSync.
        </p>
      ),
      placement: 'bottomLeft',
      closeIcon: <Nothing />,
      btn: (
        <TimeoutButton type="primary" timeoutMs={5000} onClick={updateServiceWorker}>
          refresh
        </TimeoutButton>
      ),
      duration: 0,
    });
  }, [isUpdated, registration]);

  return null;
};
