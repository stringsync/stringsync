import { message, notification } from 'antd';

declare type Environments = 'development' | 'test' | 'production';

interface IStringSyncModules {
  auth: any;
  env: Environments;
  debug: boolean;
  message: typeof message;
  notification: typeof notification | void;
  sessionSync: {
    callback: ((user: User.ISession) => any) | void;
    user: any;
  };
  store: any | void;
}

declare global {
  interface Window {
    ss: IStringSyncModules;
    XMLHttpRequest: XMLHttpRequest | jest.Mock
  }
}
