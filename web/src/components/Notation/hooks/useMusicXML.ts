import { MusicXML } from '@stringsync/musicxml';
import { useEffect, useState } from 'react';
import { DisplayMode } from '../../../lib/musicxml';
import { withDisplayMode } from '../../../lib/musicxml/withDisplayMode';
import { Nullable } from '../../../util/types';

export const useMusicXml = (url: Nullable<string>, displayMode: DisplayMode): Nullable<MusicXML> => {
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
  }, [url, displayMode]);

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
