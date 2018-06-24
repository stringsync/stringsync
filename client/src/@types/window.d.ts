import * as auth from 'j-toker';
import { message, notification } from 'antd';
import { Maestro, RafLoop } from 'services';

declare type Environments = 'development' | 'test' | 'production';

interface IStringSyncModules {
  auth: auth.IJTokerAuth;
  env: Environments;
  message: typeof message;
  notification: typeof notification | void;
  maestro: Maestro | void;
  sessionSync: {
    callback: ((user: IUser) => any) | void;
    user: StringSync.Store.ISessionUser | {};
  };
  store: Store<StringSync.Store.IState> | void;
  rafLoop: RafLoop | void;
}

declare global {
  interface Window {
    ss: IStringSyncModules;
    XMLHttpRequest: XMLHttpRequest | jest.Mock
  }
}
