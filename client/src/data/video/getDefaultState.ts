import { IVideoState } from '../../@types/store';

export const getDefaultState = (): IVideoState => ({
  isActive: false,
  kind: 'YOUTUBE',
  player: null,
  playerState: undefined,
  src: ''
});
