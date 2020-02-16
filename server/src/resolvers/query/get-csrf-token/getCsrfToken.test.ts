import { getCsrfToken } from './getCsrfToken';
import { useTestReqCtx } from '../../../testing';

it(
  'runs without crashing',
  useTestReqCtx({}, (ctx) => {
    expect(getCsrfToken(undefined, {}, ctx).length).toBeGreaterThan(0);
  })
);
