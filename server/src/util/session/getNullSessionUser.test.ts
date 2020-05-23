import { getNullSessionUser } from './getNullSessionUser';

it('runs without crashing', () => {
  expect(getNullSessionUser).not.toThrow();
});

it('returns a null session user', () => {
  const sessionUser = getNullSessionUser();

  expect(sessionUser).toEqual({
    id: '',
    role: 'student',
    isLoggedIn: false,
  });
});
