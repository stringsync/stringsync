import { useEffect } from 'react';
import { MusicDisplay } from '../lib/MusicDisplay';
import * as notations from '../lib/notations';
import { useScales } from './useScales';

export const useDynamicScaleSync = (
  settings: notations.NotationSettings,
  setSettings: React.Dispatch<React.SetStateAction<notations.NotationSettings>>,
  musicDisplay: MusicDisplay
) => {
  const isDynamicScaleSelected = settings.scaleSelectionType === notations.ScaleSelectionType.Dynamic;
  const scales = useScales(musicDisplay);

  useEffect(() => {
    if (!isDynamicScaleSelected) {
      return;
    }
    const nextSelectedScale = scales.currentMain;
    if (settings.selectedScale !== nextSelectedScale) {
      setSettings({ ...settings, selectedScale: nextSelectedScale });
    }
  }, [settings, setSettings, scales, isDynamicScaleSelected]);
};
