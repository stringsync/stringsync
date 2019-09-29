export interface AuthUser {
  id: number;
  username: string;
  email: string;
}

// keys for localstorage
export const AUTH_JWT_KEY = 'ss:auth:jwt';
export const AUTH_USER_KEY = 'ss:auth:user';

export interface AuthState {
  isLoggedIn: boolean;
  jwt: string | null;
  user: AuthUser | null;
}

// can be used for signup, login, or refreshAuth workflows
export const SET_AUTH = 'SET_AUTH';
export interface SetAuthAction {
  type: typeof SET_AUTH;
  payload: {
    user: AuthUser;
    jwt: string;
  };
}

export const CLEAR_AUTH = 'CLEAR_AUTH';
export interface ClearAuthAction {
  type: typeof CLEAR_AUTH;
  payload: {};
}

export type AuthActionTypes = SetAuthAction | ClearAuthAction;
