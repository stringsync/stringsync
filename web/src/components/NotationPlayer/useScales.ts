import { first } from 'lodash';
import { useEffect, useMemo, useState } from 'react';
import { MusicDisplay } from '../../lib/MusicDisplay';
import { KeyInfo } from '../../lib/MusicDisplay/helpers';
import { MusicDisplayMeta } from '../../lib/MusicDisplay/meta';

type Scales = {
  currentMainScale: string | null;
  mainScales: string[];
  naturalScales: string[];
  minorScales: string[];
};

export const useScales = (musicDisplay: MusicDisplay | null): Scales => {
  const [keyInfo, setKeyInfo] = useState<KeyInfo | null>(null);
  const [meta, setMeta] = useState<MusicDisplayMeta>(MusicDisplayMeta.createNull());

  useEffect(() => {
    if (!musicDisplay) {
      return;
    }
    setMeta(musicDisplay.getMeta());

    return () => {
      setMeta(MusicDisplayMeta.createNull());
    };
  }, [musicDisplay]);

  useEffect(() => {
    if (!musicDisplay) {
      return;
    }
    setKeyInfo(
      musicDisplay.getCursor().cursorSnapshot?.getKeyInfo() ||
        first(musicDisplay.getMeta().cursorSnapshots)?.getKeyInfo() ||
        null
    );
    const eventBusIds = [
      musicDisplay.eventBus.subscribe('cursorsnapshotchanged', (payload) => {
        setKeyInfo(payload.cursorSnapshot?.getKeyInfo() || null);
      }),
    ];
    return () => {
      musicDisplay.eventBus.unsubscribe(...eventBusIds);
    };
  }, [musicDisplay]);

  return useMemo(
    () => ({
      currentMainScale: keyInfo?.mainScale || null,
      mainScales: meta.mainScales,
      naturalScales: meta.naturalScales,
      minorScales: meta.minorScales,
    }),
    [keyInfo, meta]
  );
};
