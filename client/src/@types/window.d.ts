import * as auth from 'j-toker';
import { message, notification } from 'antd';

declare type Environments = 'development' | 'test' | 'production';

interface IStringSyncModules {
  auth: auth.IJTokerAuth;
  env: Environments;
  message: typeof message | void;
  notification: typeof notification | void;
  sessionSync: {
    callback: ((user: IUser) => any) | void;
    user: IUser | {};
  };
  store: Store<StringSync.StoreState> | void;
}

declare global {
  interface Window {
    ss: IStringSyncModules;
    XMLHttpRequest: XMLHttpRequest | jest.Mock
  }
}
