import { useEffect, useState } from 'react';

// from https://github.com/rehooks/online-status

const getOnlineStatus = () => {
  return typeof navigator !== 'undefined' && typeof navigator.onLine === 'boolean' ? navigator.onLine : true;
};

export const useOnlineStatus = () => {
  const [onlineStatus, setOnlineStatus] = useState(getOnlineStatus);

  useEffect(() => {
    const goOnline = () => setOnlineStatus(true);
    const goOffline = () => setOnlineStatus(false);

    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);

    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  return onlineStatus;
};
