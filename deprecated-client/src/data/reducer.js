import { combineReducers } from 'redux';

import {
  notationsReducer as notations,
  tagsReducer as tags,
  usersReducer as users,
  sessionReducer as session,
  videoReducer as video,
  viewportReducer as viewport
} from 'data';

const reducer = combineReducers({
  notations,
  tags,
  users,
  session,
  video,
  viewport
});

export default reducer;
