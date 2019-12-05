import { clearUserSessionTokenCookie } from './clearUserSessionTokenCookie';

const res: any = {
  clearCookie: jest.fn(),
};

afterEach(() => {
  jest.clearAllMocks();
});

it('calls clearCookie on the res object', () => {
  clearUserSessionTokenCookie(res);

  expect(res.clearCookie).toBeCalledTimes(1);
  expect(res.clearCookie).toBeCalledWith('USER_SESSION_TOKEN');
});
