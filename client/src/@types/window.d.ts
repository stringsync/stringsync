import * as auth from 'j-toker';
import { message, notification } from 'antd';
import { Maestro, RafLoop } from 'services';

declare type Environments = 'development' | 'test' | 'production';

interface IStringSyncModules {
  auth: auth.IJTokerAuth;
  env: Environments;
  debug: boolean;
  message: typeof message;
  notification: typeof notification | void;
  maestro: Maestro;
  sessionSync: {
    callback: ((user: IUser) => any) | void;
    user: Store.ISessionUser | {};
  };
  store: Store<Store.IState> | void;
  rafLoop: RafLoop;
}

declare global {
  interface Window {
    ss: IStringSyncModules;
    XMLHttpRequest: XMLHttpRequest | jest.Mock
  }
}
