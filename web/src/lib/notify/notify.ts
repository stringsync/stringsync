import { AntdNotify } from './AntdNotify';
import { NoopNotify } from './NoopNotify';
import { Notify } from './types';

const isReactSnapRunning = navigator.userAgent === 'ReactSnap';

export const notify: Notify = isReactSnapRunning ? new NoopNotify() : new AntdNotify();
