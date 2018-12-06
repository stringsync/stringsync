import { IVideoState } from '../../@types/store';

export const getDefaultState = (): IVideoState => ({
  isActive: false,
  kind: 'YOUTUBE',
  currentTimeMs: 0,
  player: null,
  playerState: undefined,
  src: ''
});
