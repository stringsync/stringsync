import { createActions } from 'redux-actions';

const viewportActions = createActions({
  VIEWPORT: {
    WIDTH: {
      SET: width => ({ width })
    }
  }
});

export default viewportActions;
