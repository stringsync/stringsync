import { useEffect, useState } from 'react';
import { ago } from '../../util/ago';
import { Duration } from '../../util/Duration';

const UPDATE_FREQUENCY = Duration.min(1);
const UNKNOWN_AGO = '??? ago';

export const useUpdatedTimeAgo = (since: Date) => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const handle = window.setInterval(() => {
      setNow(new Date());
    }, UPDATE_FREQUENCY.ms);
    return () => {
      window.clearInterval(handle);
    };
  }, []);

  return ago(since, now) || UNKNOWN_AGO;
};
