import { createStore } from 'redux';
import { reducer, middleware } from 'data';

const store = createStore(reducer, {}, middleware);

window.store = store;
export default store;
