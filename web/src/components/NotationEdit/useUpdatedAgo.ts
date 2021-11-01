import { useEffect, useMemo, useState } from 'react';
import { ago } from '../../util/ago';
import { Duration } from '../../util/Duration';
import { Nullable } from '../../util/types';

const FAST_UPDATE_FREQUENCY = Duration.sec(1);
const NORMAL_UPDATE_FREQUENCY = Duration.min(1);
const UNKNOWN_AGO = '??? ago';

export const useUpdatedAgo = (updatedAtStr: Nullable<string>) => {
  const [now, setNow] = useState(new Date());
  const updatedAt = useMemo(() => (updatedAtStr ? new Date(updatedAtStr) : new Date()), [updatedAtStr]);

  useEffect(() => {
    if (!updatedAt) {
      return;
    }
    const deltaMs = updatedAt.getTime() - now.getTime();
    const timeout = deltaMs > Duration.min(1).ms ? NORMAL_UPDATE_FREQUENCY : FAST_UPDATE_FREQUENCY;
    const handle = window.setTimeout(() => {
      setNow(new Date());
    }, timeout.ms);
    return () => {
      window.clearTimeout(handle);
    };
  }, [now, updatedAt]);

  useEffect(() => {
    setNow(new Date());
  }, [updatedAt]);

  return updatedAt >= now ? UNKNOWN_AGO : ago(updatedAt, now) || UNKNOWN_AGO;
};
