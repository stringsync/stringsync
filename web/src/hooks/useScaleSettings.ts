import { useState } from 'react';
import * as notations from '../lib/notations';

export type ScaleSettings = {
  scaleSelectionType: notations.ScaleSelectionType;
  selectedScale: string | null;
};

const DEFAULT_SCALE_SETTINGS: ScaleSettings = {
  scaleSelectionType: notations.ScaleSelectionType.None,
  selectedScale: null,
};

export const useScaleSettings = () => {
  return useState<ScaleSettings>(DEFAULT_SCALE_SETTINGS);
};
