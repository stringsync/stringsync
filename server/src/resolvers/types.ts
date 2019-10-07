export interface UserType {
  id: number;
  username: string;
  email: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotationType {
  id: number;
}

export interface GetUserInputType {
  id: number;
}

export interface RefreshAuthInputType {
  id: number;
}

export interface RefreshAuthPayloadType {
  jwt: string;
  user: UserType;
}

export interface SignupInputType {
  username: string;
  email: string;
  password: string;
}

export interface SignupPayloadType {
  jwt: string;
  user: UserType;
}

export interface LoginInputType {
  emailOrUsername: string;
  password: string;
}

export interface LoginPayloadType {
  jwt: string;
  user: UserType;
}
