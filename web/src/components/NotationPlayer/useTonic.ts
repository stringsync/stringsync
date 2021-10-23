import { useEffect, useState } from 'react';
import { OpenSheetMusicDisplay } from '../../lib/MusicDisplay';
import { KeyInfo } from '../../lib/MusicDisplay/helpers';
import * as helpers from './helpers';

export const useTonic = (selectedScale: string | null, musicDisplay: OpenSheetMusicDisplay | null): string | null => {
  const [keyInfo, setKeyInfo] = useState<KeyInfo | null>(() => helpers.getKeyInfo(musicDisplay));

  useEffect(() => {
    setKeyInfo(helpers.getKeyInfo(musicDisplay));

    if (!musicDisplay) {
      return;
    }

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
