import { createAction } from 'utilities/redux';

export const SET_USERS_EDIT = 'SET_USERS_EDIT';
export const SET_USERS_INDEX = 'SET_USERS_INDEX';
export const SET_USERS_SHOW = 'SET_USERS_SHOW';
export const UPDATE_USERS_EDIT = 'UPDATE_USERS_EDIT';

export const UsersActions = {
  setUsersEdit: (user: User.IBaseUser) => createAction(SET_USERS_EDIT, { user }),
  setUsersIndex: (users: User.IBaseUser[]) => createAction(SET_USERS_INDEX, { users }),
  setUsersShow: (user: User.IBaseUser) => createAction(SET_USERS_SHOW, { user }),
  updateUsersEdit: (user: User.IBaseUser) => createAction(UPDATE_USERS_EDIT, { user })
}

export type UsersActions = ActionsUnion<typeof UsersActions>
