import { REACT_SNAP_ACTIVE } from '../../util/constants';
import { AntdNotify } from './AntdNotify';
import { NoopNotify } from './NoopNotify';
import { Notify } from './types';

export const notify: Notify = REACT_SNAP_ACTIVE ? new NoopNotify() : new AntdNotify();
