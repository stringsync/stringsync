import { combineReducers } from 'redux';

import {
  notationsReducer as notations,
  tagsReducer as tags,
  usersReducer as users,
  sessionReducer as session,
  videoReducer as video
} from 'data';

const reducer = combineReducers({
  notations,
  tags,
  users,
  session,
  video
});

export default reducer;
