import { createStore } from 'redux';
import { reducer, middleware } from './';

const store = createStore(reducer, {}, middleware);

export default store;
