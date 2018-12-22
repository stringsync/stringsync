import { message, notification } from 'antd';
import { ISession } from './user';

declare type Environments = 'development' | 'test' | 'production';

interface IStringSyncModules {
  auth: any;
  env: Environments;
  debug: boolean;
  message: typeof message;
  notification: typeof notification;
  store: any;
}

declare global {
  interface Window {
    ss: IStringSyncModules;
    XMLHttpRequest: XMLHttpRequest | jest.Mock
  }
}
