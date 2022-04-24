import { MusicXML } from '@stringsync/musicxml';
import { useEffect, useRef, useState } from 'react';
import { DisplayMode } from '../../../lib/musicxml';
import { withDisplayMode } from '../../../lib/musicxml/withDisplayMode';
import { Nullable } from '../../../util/types';
import { RenderableNotation } from '../types';

export const useMusicXml = (notation: Nullable<RenderableNotation>, displayMode: DisplayMode): Nullable<MusicXML> => {
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
  }, [notation, displayMode]);

  const [musicXmlWithDisplayMode, setMusicXmlWithDisplayMode] = useState<Nullable<MusicXML>>(null);
  useEffect(() => {
    if (!musicXml) {
      return;
    }
    const nextMusicXmlWithDisplayMode = withDisplayMode(musicXml, displayMode);
    setMusicXmlWithDisplayMode(nextMusicXmlWithDisplayMode);
  }, [musicXml, displayMode]);

  return musicXmlWithDisplayMode;
};
