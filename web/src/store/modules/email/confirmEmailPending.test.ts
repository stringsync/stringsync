import { confirmEmailPending } from './confirmEmailPending';
import { CONFIRM_EMAIL_PENDING } from './constants';

it('creates a CONFIRM_EMAIL_PENDING action', () => {
  expect(confirmEmailPending()).toStrictEqual({ type: CONFIRM_EMAIL_PENDING });
});
