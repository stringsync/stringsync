import createStore from '../data/createStore';

const configureStore = () => {
  const store = createStore();
  window.ss.store = store;
  return store;
};

export default configureStore;
