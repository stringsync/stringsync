import { useState } from 'react';

export type PlayerSettings = {
  isLoopActive: boolean;
};

const DEFAULT_PLAYER_SETTINGS: PlayerSettings = {
  isLoopActive: false,
};

export const usePlayerSettings = () => {
  return useState<PlayerSettings>(DEFAULT_PLAYER_SETTINGS);
};
