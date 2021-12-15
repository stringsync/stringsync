import React, { useEffect } from 'react';
import { useMeta } from '../../ctx/meta/useMeta';
import { useServiceWorker } from '../../ctx/service-worker';
import { useEffectOnce } from '../../hooks/useEffectOnce';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { notify } from '../../lib/notify';
import { Duration } from '../../util/Duration';
import { Nothing } from '../Nothing/Nothing';
import { TimeoutButton } from '../TimeoutButton/TimeoutButton';

const LAST_LOADED_VERSION_KEY = 'stringsync_last_loaded_version';
const INITIAL_LAST_LOADED_VERSION = { version: '0.0.0' };

export const NewVersionNotifier: React.FC = () => {
  const { isUpdated, registration } = useServiceWorker();
  const { version } = useMeta();
  const [lastLoaded, setLastLoaded] = useLocalStorage(LAST_LOADED_VERSION_KEY, INITIAL_LAST_LOADED_VERSION);

  useEffectOnce(() => {
    const lastLoadedVersion = lastLoaded.version;
    setLastLoaded({ version });
    // Prevent the message element from being baked into the crawled
    if (lastLoadedVersion !== INITIAL_LAST_LOADED_VERSION.version && version !== lastLoadedVersion) {
      notify.message.success({ content: `updated to ${version}`, duration: Duration.sec(3) });
    }
  });

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

    notify.popup.info({
      title: 'update available',
      content: (
        <p>
          You are{' '}
          <b>
            <u>not</u>
          </b>{' '}
          on the latest version of stringsync.
        </p>
      ),
      placement: 'bottomLeft',
      closeIcon: <Nothing />,
      button: (
        <TimeoutButton type="primary" timeoutMs={5000} onClick={updateServiceWorker}>
          refresh
        </TimeoutButton>
      ),
      duration: Duration.zero(),
    });
  }, [isUpdated, registration]);

  return null;
};
