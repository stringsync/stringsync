import { createActions } from 'redux-actions';

const videoActions = createActions({
  PLAYER: {
    SET: player => ({ player })
  },
  PLAYER_STATE: {
    SET: playerState => ({ playerState })
  }
});

export default videoActions;
