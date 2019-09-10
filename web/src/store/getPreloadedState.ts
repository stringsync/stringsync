import getInitialScreenState from './screen/getInitialState';

export const getPreloadedState = () => ({
  screen: getInitialScreenState(),
});
