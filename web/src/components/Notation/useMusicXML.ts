import { MusicXML } from '@stringsync/musicxml';
import { useEffect, useState } from 'react';
import { Nullable } from '../../util/types';

export const useMusicXml = (url: Nullable<string>): Nullable<MusicXML> => {
  const [musicXml, setMusicXml] = useState<Nullable<MusicXML>>(null);

  useEffect(() => {
    if (!url) {
      setMusicXml(null);
      return;
    }
    const controller = new AbortController();
    let done = false;
    fetch(url, { signal: controller.signal })
      .then((res) => res.text())
      .then((text) => {
        const musicXml = MusicXML.parse(text);
        setMusicXml(musicXml);
      })
      .catch((error) => {
        if (error instanceof DOMException && error.code === DOMException.ABORT_ERR) {
          return;
        }
        throw error;
      })
      .finally(() => {
        done = true;
      });
    return () => {
      if (!done) {
        controller.abort();
      }
    };
  }, [url]);

  return musicXml;
};
