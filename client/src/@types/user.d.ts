declare namespace User {
  export interface IBaseUser {
    id: number,
    name: string,
    image: string
  }

  export interface ISessionUser extends IBaseUser {
    "access-token": string;
    allow_password_change: boolean;
    client: string;
    configName: string;
    created_at: string;
    email: string;
    expiry: number;
    provider: string;
    role: string;
    signedIn: boolean;
    uid: string;
    updated_at: string;
  }
}
