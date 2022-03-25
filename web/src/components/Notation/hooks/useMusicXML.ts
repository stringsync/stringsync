import { MusicXML } from '@stringsync/musicxml';
import { useEffect, useRef, useState } from 'react';
import { Nullable } from '../../../util/types';
import { RenderableNotation } from '../types';

export const useMusicXml = (notation: Nullable<RenderableNotation>): Nullable<MusicXML> => {
  const [musicXml, setMusicXml] = useState<Nullable<MusicXML>>(null);
  const lastFetchInvocationToken = useRef<Symbol>(Symbol());

  useEffect(() => {
    if (!notation?.musicXmlUrl) {
      setMusicXml(null);
      return;
    }

    const fetchInvocationToken = Symbol();
    lastFetchInvocationToken.current = fetchInvocationToken;
    const wasFetchInvokedAgain = () => fetchInvocationToken !== lastFetchInvocationToken.current;

    fetch(notation.musicXmlUrl)
      .then((res) => res.text())
      .then((text) => {
        if (wasFetchInvokedAgain()) {
          return;
        }
        const musicXml = MusicXML.parse(text);
        setMusicXml(musicXml);
      });
  }, [notation]);

  return musicXml;
};
