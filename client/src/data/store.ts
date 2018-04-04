import { createStore } from 'redux';
import { reducer, middleware } from './';
import { addToWindow } from 'utilities';

const store = createStore(reducer, {}, middleware);
addToWindow('store', store);

export default store;
