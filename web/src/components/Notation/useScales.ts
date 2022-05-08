import { useEffect, useMemo, useState } from 'react';
import { MusicDisplay } from '../../lib/MusicDisplay';
import { KeyInfo } from '../../lib/MusicDisplay/helpers';
import { MusicDisplayMeta } from '../../lib/MusicDisplay/meta';
import * as helpers from './helpers';

type Scales = {
  currentMain: string | null;
  main: string[];
  pentatonic: string[];
  major: string[];
  minor: string[];
};

export const useScales = (musicDisplay: MusicDisplay): Scales => {
  const [keyInfo, setKeyInfo] = useState<KeyInfo | null>(() => helpers.getKeyInfo(musicDisplay));
  const [meta, setMeta] = useState<MusicDisplayMeta>(MusicDisplayMeta.createNull());

  useEffect(() => {
    setKeyInfo(helpers.getKeyInfo(musicDisplay));

    const eventBusIds = [
      musicDisplay.eventBus.subscribe('rendered', (payload) => {
        setMeta(musicDisplay.getMeta());
      }),
      musicDisplay.eventBus.subscribe('cursorsnapshotchanged', (payload) => {
        setKeyInfo(payload.cursorSnapshot?.getKeyInfo() || null);
      }),
    ];
    return () => {
      musicDisplay.eventBus.unsubscribe(...eventBusIds);
    };
  }, [musicDisplay]);

  return useMemo(() => {
    // Don't let scales show up multiple times
    const mainScales = new Set(meta.mainScales);
    const majorScales = meta.majorScales.filter((scale) => !mainScales.has(scale));
    const minorScales = meta.minorScales.filter((scale) => !mainScales.has(scale));

    return {
      currentMain: keyInfo?.mainScale || null,
      main: meta.mainScales, // Using the set would mess up the order
      pentatonic: meta.pentatonicScales,
      major: majorScales,
      minor: minorScales,
    };
  }, [keyInfo, meta]);
};
