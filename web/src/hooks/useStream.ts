import { useEffect, useState } from 'react';
import { useMemoCmp } from './useMemoCmp';

export const useStream = (
  constraints?: DisplayMediaStreamConstraints,
  prompt: boolean = false
): [stream: MediaStream | null] => {
  constraints = useMemoCmp(constraints);

  const [stream, setStream] = useState<MediaStream | null>(null);

  useEffect(() => {
    if (!prompt) {
      return;
    }
    // avoid polyfills in test env
    if (typeof window?.navigator?.mediaDevices?.getDisplayMedia !== 'function') {
      console.warn('cannot use getDisplayMedia, noop');
      return;
    }

    let cancelled = false;
    navigator.mediaDevices.getDisplayMedia(constraints).then((nextStream) => {
      if (!cancelled) {
        setStream(nextStream);
      }
    });

    return () => {
      cancelled = true;
      setStream(null);
    };
  }, [constraints, prompt]);

  useEffect(() => {
    if (!stream) {
      return;
    }
    return () => {
      const tracks = stream.getTracks();
      for (const track of tracks) {
        track.stop();
      }
    };
  }, [stream]);

  return [stream];
};
