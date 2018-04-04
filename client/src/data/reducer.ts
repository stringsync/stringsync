import { combineReducers } from 'redux';
import { RootState } from 'typings';

import {
  viewportReducer as viewport
} from 'data';

const reducer = combineReducers<RootState>({
  viewport
});

export default reducer;
