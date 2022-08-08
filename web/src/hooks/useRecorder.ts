import { useCallback, useEffect, useRef, useState } from 'react';
import { useMemoCmp } from './useMemoCmp';

type Download = (filename: string) => void;

type Reset = () => void;

export const useRecorder = (
  stream: MediaStream | null,
  options?: MediaRecorderOptions
): [recorder: MediaRecorder | null, download: Download, reset: Reset] => {
  options = useMemoCmp(options);

  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const data = useRef(new Array<Blob>());

  useEffect(() => {
    if (!stream) {
      return;
    }
    const recorder = new MediaRecorder(stream, options);
    setRecorder(recorder);

    const record = (event: BlobEvent) => {
      data.current = [...data.current, event.data];
    };
    recorder.addEventListener('dataavailable', record);

    return () => {
      recorder.removeEventListener('dataavailable', record);
      setRecorder(null);
    };
  }, [stream, options]);

  const download = useCallback((filename: string) => {
    const blob = new Blob(data.current);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.webm`;
    a.click();
    URL.revokeObjectURL(url);
  }, []);

  const reset = useCallback(() => {
    data.current = [];
  }, []);

  return [recorder, download, reset];
};
