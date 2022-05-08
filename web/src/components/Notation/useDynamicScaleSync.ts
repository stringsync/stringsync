import { useEffect } from 'react';
import { MusicDisplay } from '../../lib/MusicDisplay';
import { NotationSettings, ScaleSelectionType } from './types';
import { useScales } from './useScales';

export const useDynamicScaleSync = (
  settings: NotationSettings,
  setSettings: React.Dispatch<React.SetStateAction<NotationSettings>>,
  musicDisplay: MusicDisplay
) => {
  const isDynamicScaleSelected = settings.scaleSelectionType === ScaleSelectionType.Dynamic;
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
