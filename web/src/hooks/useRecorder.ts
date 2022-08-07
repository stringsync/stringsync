import { useCallback, useEffect, useState } from 'react';
import { useMemoCmp } from './useMemoCmp';

type Download = () => void;

type Reset = () => void;

export const useRecorder = (
  stream: MediaStream | null,
  options?: MediaRecorderOptions
): [recorder: MediaRecorder | null, download: Download, reset: Reset] => {
  options = useMemoCmp(options);

  const [recorder, setRecorder] = useState<MediaRecorder | null>(null);
  const [data, setData] = useState(new Array<Blob>());

  useEffect(() => {
    if (!stream) {
      return;
    }
    if (recorder) {
      return;
    }
    const nextRecorder = new MediaRecorder(stream, options);
    setRecorder(nextRecorder);

    const record = (event: BlobEvent) => {
      setData((data) => [...data, event.data]);
    };
    nextRecorder.addEventListener('dataavailable', record);

    return () => {
      nextRecorder.removeEventListener('dataavailable', record);
    };
  }, [recorder, stream, options]);

  const download = useCallback(() => {
    const blob = new Blob(data);
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'test.webm';
    a.click();
    URL.revokeObjectURL(url);
  }, [data]);

  const reset = useCallback(() => {
    setRecorder(null);
    setData([]);
  }, []);

  return [recorder, download, reset];
};
