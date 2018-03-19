import { createActions } from 'redux-actions';

const tagsActions = createActions({
  TAGS: {
    INDEX: {
      SET: tags => ({ tags })
    }
  }
});

export default tagsActions;
