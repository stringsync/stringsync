declare module 'j-toker' {
  export interface IResponse {
    data: IUser;
  }

  export interface IAuthConfigurationOptions {
    apiUrl?: string;
    signOutPath?: string;
    emailSignInPath?: string;
    emailRegistrationPath?: string;
    accountUpdatePath?: string;
    accountDeletePath?: string;
    passwordResetPath?: string;
    passwordUpdatePath?: string;
    tokenValidationPath?: string;
    proxyUrl?: string;
    validateOnPageLoad?: boolean;
    forceHardRedirect?: boolean;
    storage?: string;
    cookieExpiry?: number;
    cookiePath?: string;
    tokenFormat?: {
      "access-token": string;
      "token-type": string;
      "client": string;
      "expiry": string;
      "uid": string;
    };
    authProviderPaths?: {
      github?: string;
      facebook?: string;
      google?: string;
    };
    proxyIf?: () => boolean;
    passwordResetSuccessUrl?: () => string;
    confirmationSuccessUrl?: () => string;
    parseExpiry?: (headers: {}) => any;
    handleLoginResponse?: (response: IResponse) => any;
    handleAccountUpdateResponse?: (response: IResponse) => any;
    handleTokenValidationResponse?: (response: IResponse) => any;
  }

  export type OAuthProviders = 'facebook' | 'google_oauth2' | 'google';

  export type SessionProviders = 'email' | OAuthProviders;

  export interface IOAuthSignInArguments {
    provider: OAuthProviders;
    params?: {
      [key: string]: string;
    },
    config?: any;
  }

  export interface IAuthResponse {
    data: User.ISessionUser;
  }

  export interface ISignupUser {
    email: string;
    name: string;
    password: string;
    passwordConfirmation: string;
  }

  export interface IJTokerAuth {
    appendAuthHeaders: (xhr: JQueryXHR, settings: any) => void;
    retrieveData: (key: string) => any;
    configure: (options: IAuthConfigurationOptions, reset?: boolean) => any;
    emailSignIn: (user: User.ILoginUser) => Promise<IAuthResponse>;
    emailSignUp: (user: ISignupUser) => Promise<IAuthResponse>;
    oAuthSignIn: (args: IOAuthSignInArguments) => Promise<IAuthResponse>;
    signOut: () => Promise<void>;
  }

  export type OAuthCallback = (res: IAuthResponse) => any;
}
