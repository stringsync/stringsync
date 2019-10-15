import { User } from 'common/types';

export interface NotationType {
  id: string;
}

export interface GetUserInputType {
  id: string;
}

export interface ReauthPayloadType {
  user: User;
}

export interface SignupInputType {
  username: string;
  email: string;
  password: string;
}

export interface SignupPayloadType {
  user: User;
}

export interface LoginInputType {
  emailOrUsername: string;
  password: string;
}

export interface LoginPayloadType {
  user: User;
}

export interface LogoutPayloadType {
  ok: boolean;
}
