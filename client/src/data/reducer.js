import { combineReducers } from 'redux';

import {
  notationsReducer as notations,
  tagsReducer as tags
} from 'data';

const reducer = combineReducers({
  notations,
  tags
});

export default reducer;
