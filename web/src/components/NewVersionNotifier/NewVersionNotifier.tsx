import { once } from 'lodash';
import { useEffect } from 'react';
import { useMeta } from '../../ctx/meta/useMeta';
import { useEffectOnce } from '../../hooks/useEffectOnce';
import { useLocalStorage } from '../../hooks/useLocalStorage';
import { notify } from '../../lib/notify';
import { Duration } from '../../util/Duration';
import { Nothing } from '../Nothing';
import { TimeoutButton } from '../TimeoutButton';

const LAST_LOADED_VERSION_KEY = 'stringsync_last_loaded_version';
const INITIAL_LAST_LOADED_VERSION = { version: '0.0.0' };

export const NewVersionNotifier = () => {
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
    const serviceWorker = navigator.serviceWorker;
    if (!serviceWorker) {
      return;
    }

    // Adapted from https://whatwebcando.today/articles/handling-service-worker-updates/
    serviceWorker.ready.then((registration) => {
      // Sends a popup indicating to the user that a new update is available.
      const notifyUpdateAvailable = once((serviceWorker: ServiceWorker) => {
        const onClick = () => {
          serviceWorker.postMessage({ type: 'SKIP_WAITING' });
          serviceWorker.addEventListener('statechange', () => {
            if (serviceWorker.state === 'activated') {
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
            <TimeoutButton type="primary" timeoutMs={5000} onClick={onClick}>
              refresh
            </TimeoutButton>
          ),
          duration: Duration.zero(),
        });
      });

      // ensure the case when the updatefound event was missed is also handled
      // by re-invoking the prompt when there's a waiting Service Worker
      if (registration.waiting) {
        notifyUpdateAvailable(registration.waiting);
      }

      // detect Service Worker update available and wait for it to become installed
      registration.addEventListener('updatefound', () => {
        if (registration.installing) {
          // wait until the new Service worker is actually installed (ready to take over)
          registration.installing.addEventListener('statechange', () => {
            if (registration.waiting) {
              // if there's an existing controller (previous Service Worker), show the prompt
              if (navigator.serviceWorker.controller) {
                notifyUpdateAvailable(registration.waiting);
              } else {
                // otherwise it's the first install, nothing to do
                console.log('Service Worker initialized for the first time');
              }
            }
          });
        }
      });
    });
  }, []);

  return null;
};
