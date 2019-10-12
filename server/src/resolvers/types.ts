import { User } from 'common/types';

export interface NotationType {
  id: number;
}

export interface GetUserInputType {
  id: number;
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
