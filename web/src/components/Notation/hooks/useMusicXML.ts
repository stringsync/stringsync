import { MusicXML } from '@stringsync/musicxml';
import { useEffect, useState } from 'react';
import { Nullable } from '../../../util/types';

export const useMusicXml = (url: Nullable<string>): Nullable<MusicXML> => {
  const [musicXml, setMusicXml] = useState<Nullable<MusicXML>>(null);

  useEffect(() => {
    if (!url) {
      setMusicXml(null);
      return;
    }
    const controller = new AbortController();
    fetch(url, { signal: controller.signal })
      .then((res) => res.text())
      .then((text) => {
        const musicXml = MusicXML.parse(text);
        setMusicXml(musicXml);
      });
    return () => {
      controller.abort();
    };
  }, [url]);

  return musicXml;
};
