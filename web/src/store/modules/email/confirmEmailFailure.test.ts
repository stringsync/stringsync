import { confirmEmailFailure } from './confirmEmailFailure';
import { CONFIRM_EMAIL_FAILURE } from './constants';

it('creates a CONFIRM_EMAIL_FAILURE action', () => {
  const errors = ['foo', 'bar', 'baz'];
  expect(confirmEmailFailure(errors)).toStrictEqual({
    type: CONFIRM_EMAIL_FAILURE,
    errors,
  });
});
