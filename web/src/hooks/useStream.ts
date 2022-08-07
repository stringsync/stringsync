import { useCallback, useRef, useState } from 'react';

type Prompt = (constraints?: DisplayMediaStreamConstraints) => void;

type Clear = () => void;

export const useStream = (): [stream: MediaStream | null, pending: boolean, prompt: Prompt, clear: Clear] => {
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [pending, setPending] = useState(false);

  const lastInvocationId = useRef(Symbol());
  const prompt = useCallback((constraints?: DisplayMediaStreamConstraints) => {
    setStream(null);

    const invocationId = Symbol();
    lastInvocationId.current = invocationId;

    setPending(true);
    window.navigator.mediaDevices
      .getDisplayMedia(constraints)
      .then((nextStream) => {
        const isSameInvocation = invocationId === lastInvocationId.current;
        if (isSameInvocation) {
          setStream(nextStream);
        }
      })
      .finally(() => setPending(false));
  }, []);

  const clear = useCallback(() => {
    setStream(null);
  }, []);

  return [stream, pending, prompt, clear];
};
