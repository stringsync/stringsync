import { setUserSessionTokenCookie } from './setUserSessionTokenCookie';

const NOW = new Date();

const res: any = {
  cookie: jest.fn(),
};

const userSession: any = {
  token: 'foo-token',
  expiresAt: NOW,
};

afterEach(() => {
  jest.clearAllMocks();
});

it('sets the cookie on the res object', (done) => {
  setUserSessionTokenCookie(userSession, res);

  expect(res.cookie).toBeCalledTimes(1);
  expect(res.cookie).toBeCalledWith('USER_SESSION_TOKEN', 'foo-token', {
    httpOnly: true,
    expires: NOW,
  });
  done();
});
