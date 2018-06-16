import * as actions from './usersActions';
import { merge } from 'lodash';

export type IUsersState = StringSync.Store.IUsersState;

const getDefaultUser = (): User.IBaseUser => ({
  id: -1,
  image: '',
  name: ''
});

const getDefaultState = (): IUsersState => ({
  edit: getDefaultUser(),
  index: [],
  show: getDefaultUser()
});

export const usersReducer = (state = getDefaultState(), action: actions.UsersActions): IUsersState => {
  const nextState = merge({}, state);
  
  switch (action.type) {

    case actions.SET_USERS_EDIT:
      nextState.edit = action.payload.user;
      return nextState;

    case actions.SET_USERS_INDEX:
      nextState.index = action.payload.users;
      return nextState;

    case actions.SET_USERS_SHOW:
      nextState.show = action.payload.user;
      return nextState;

    case actions.UPDATE_USERS_EDIT:
      nextState.edit = { ...nextState.edit, ...action.payload.user };
      return nextState;

    default:
      return nextState;    
  }
};
