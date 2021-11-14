import { useEffect, useState } from 'react';
import { Duration } from '../util/Duration';

const MINUTE = Duration.min(1);

export const useNow = (intervalMs: number = MINUTE.ms) => {
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const handle = setInterval(() => {
      setNow(new Date());
    }, intervalMs);
    return () => {
      clearInterval(handle);
    };
  }, [intervalMs]);

  return now;
};
