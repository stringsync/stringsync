import { combineReducers } from 'redux';

import { notationsReducer as notations } from 'data';

const reducer = combineReducers({
  notations
});

export default reducer;
