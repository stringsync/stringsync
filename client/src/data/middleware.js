import { applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

const middleware = applyMiddleware(thunk);

export default middleware;
