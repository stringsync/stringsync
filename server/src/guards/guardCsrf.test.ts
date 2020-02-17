import { guardCsrf } from './guardCsrf';
import { useTestReqCtx } from '../testing';
import { CSRF_HEADER_NAME } from '../csrf';

it(
  'throws an error for an invalid csrf token',
  useTestReqCtx(
    { headers: { [CSRF_HEADER_NAME]: 'INVALID_CSRF_TOKEN' } },
    (ctx) => {
      expect(() => guardCsrf(ctx)).toThrow();
    }
  )
);
