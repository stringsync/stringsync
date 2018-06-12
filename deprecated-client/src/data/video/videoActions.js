import { createActions } from 'redux-actions';

const videoActions = createActions({
  VIDEO: {
    SET: (kind, src) => ({ kind, src }),
    RESET: undefined
  },
  PLAYER: {
    SET: player => ({ player })
  },
  PLAYER_STATE: {
    SET: playerState => ({ playerState })
  }
});

export default videoActions;
