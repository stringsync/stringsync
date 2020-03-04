import { confirmEmailSuccess } from './confirmEmailSuccess';
import { CONFIRM_EMAIL_SUCCESS } from './constants';

it('creates a CONFIRM_EMAIL_SUCCESS action', () => {
  const id = 'id';
  expect(confirmEmailSuccess(id)).toStrictEqual({
    type: CONFIRM_EMAIL_SUCCESS,
    id,
  });
});
