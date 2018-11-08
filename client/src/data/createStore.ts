import thunk from 'redux-thunk';
import { applyMiddleware, combineReducers, createStore as _createStore } from 'redux';
import { notationsReducer } from './';

// Middleware
const middleware = applyMiddleware(thunk);

// Reducer
const reducer = combineReducers({
  notations: notationsReducer,
});

// Store
const createStore = () => _createStore(reducer, {}, middleware);

export default createStore;
