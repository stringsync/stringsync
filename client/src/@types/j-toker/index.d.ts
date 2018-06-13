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

  export interface IJTokerAuth {
    configure: (options: IAuthConfigurationOptions, reset?: boolean) => any;
  }
}

