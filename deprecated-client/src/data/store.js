import { createStore } from 'redux';
import { reducer, middleware } from 'data';

const store = createStore(reducer, {}, middleware);

window.ss = window.ss || {};
window.ss.store = store;

export default store;
