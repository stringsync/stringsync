import { createActions } from 'redux-actions';

const tagsActions = createActions({
  SET_TAGS: tags => tags
});

export default tagsActions;
