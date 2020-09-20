import { toHaveHttpStatus, toHaveErrorCode } from './matchers';

expect.extend({
  toHaveHttpStatus,
  toHaveErrorCode,
});
