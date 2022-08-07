import { useCallback, useRef, useState } from 'react';

type Prompt = (constraints?: DisplayMediaStreamConstraints) => void;

type Clear = () => void;

export const useStream = (): [stream: MediaStream | null, prompt: Prompt, clear: Clear] => {
  const [stream, setStream] = useState<MediaStream | null>(null);

  const lastInvocationId = useRef(Symbol());
  const prompt = useCallback((constraints?: DisplayMediaStreamConstraints) => {
    setStream(null);

    const invocationId = Symbol();
    lastInvocationId.current = invocationId;

    window.navigator.mediaDevices.getDisplayMedia(constraints).then((nextStream) => {
      const isSameInvocation = invocationId === lastInvocationId.current;
      if (isSameInvocation) {
        setStream(nextStream);
      }
    });
  }, []);

  const clear = useCallback(() => {
    setStream(null);
  }, []);

  return [stream, prompt, clear];
};
