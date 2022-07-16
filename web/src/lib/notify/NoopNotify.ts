import { noop } from 'lodash';
import { Notify } from './types';

export class NoopNotify implements Notify {
  message = {
    info: noop,
    success: noop,
    warn: noop,
    error: noop,
    loading: noop,
  };
  popup = {
    info: noop,
    success: noop,
    warn: noop,
    error: noop,
  };
  modal = {
    info: noop,
    success: noop,
    warn: noop,
    error: noop,
  };
}
