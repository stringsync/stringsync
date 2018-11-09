export interface IBase {
  id: number;
  name: string;
  image: string;
}

export interface ILogin {
  email: string;
  password: string;
}

export interface ISignup extends ILogin {
  username: string;
  passwordConfirmation: string;
}

export interface ISession extends IBase {
  "access-token": string;
  allow_password_change: boolean;
  client: string;
  configName: string;
  created_at: string;
  email: string;
  expiry: number;
  provider: string;
  role: string[];
  signedIn: boolean;
  uid: string;
  updated_at: string;
  errors?: {
    full_messages: string[];
  }
}

