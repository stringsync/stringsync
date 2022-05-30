import { useEffect, useState } from 'react';
import { MusicDisplay } from '../lib/MusicDisplay';
import { KeyInfo } from '../lib/MusicDisplay/helpers';
import * as notations from '../lib/notations';

export const useTonic = (selectedScale: string | null, musicDisplay: MusicDisplay): string | null => {
  const [keyInfo, setKeyInfo] = useState<KeyInfo | null>(() => notations.getKeyInfo(musicDisplay));

  useEffect(() => {
    setKeyInfo(notations.getKeyInfo(musicDisplay));
    const eventBusIds = [
      musicDisplay.eventBus.subscribe('cursorsnapshotchanged', (payload) => {
        setKeyInfo(payload.cursorSnapshot?.getKeyInfo() || null);
      }),
    ];
    return () => {
      musicDisplay.eventBus.unsubscribe(...eventBusIds);
    };
  }, [musicDisplay]);

  return selectedScale ? selectedScale.split(' ')[0] : keyInfo ? keyInfo.majorKey.tonic : null;
};
