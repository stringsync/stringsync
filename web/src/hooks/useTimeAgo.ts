import { useEffect, useMemo, useState } from 'react';
import { ago } from '../util/ago';
import { Duration } from '../util/Duration';
import { Nullable } from '../util/types';

const FAST_UPDATE_FREQUENCY = Duration.sec(1);
const MEDIUM_UPDATE_FREQUENCY = Duration.min(1);
const SLOW_UPDATE_FREQUENCY = Duration.hr(1);
const UNKNOWN_AGO = '??? ago';

export const useTimeAgo = (timeStr: Nullable<string>) => {
  const [now, setNow] = useState(new Date());
  const time = useMemo(() => (timeStr ? new Date(timeStr) : new Date()), [timeStr]);

  useEffect(() => {
    if (!time) {
      return;
    }

    const deltaMs = time.getTime() - now.getTime();
    let timeout: Duration;
    if (deltaMs < Duration.min(1).ms) {
      timeout = FAST_UPDATE_FREQUENCY;
    } else if (deltaMs < Duration.hr(1).ms) {
      timeout = MEDIUM_UPDATE_FREQUENCY;
    } else {
      timeout = SLOW_UPDATE_FREQUENCY;
    }

    const handle = window.setTimeout(() => {
      setNow(new Date());
    }, timeout.ms);
    return () => {
      window.clearTimeout(handle);
    };
  }, [now, time]);

  useEffect(() => {
    setNow(new Date());
  }, [time]);

  return time >= now ? UNKNOWN_AGO : ago(time, now) || UNKNOWN_AGO;
};
