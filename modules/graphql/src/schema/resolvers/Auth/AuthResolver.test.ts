import { HTTP_STATUSES, randStr } from '@stringsync/common';
import { TYPES } from '@stringsync/container';
import { UserService } from '@stringsync/services';
import { TestGraphqlClient, useTestApp } from '../../../testing';
import { TestAuthClient } from './TestAuthClient';
import { User } from '@stringsync/domain';
import { UserRepo } from '@stringsync/repos';

const { app, container } = useTestApp();

let graphqlClient: TestGraphqlClient;
let authClient: TestAuthClient;

beforeEach(() => {
  graphqlClient = new TestGraphqlClient(app);
  authClient = new TestAuthClient(graphqlClient);
});

describe('whoami', () => {
  it('returns null when logged out', async () => {
    const res = await authClient.whoami();

    expect(res.statusCode).toBe(HTTP_STATUSES.OK);
    expect(res.body.data.whoami).toBeNull();
  });

  it('returns the logged in user', async () => {
    const username = randStr(10);
    const email = `${username}@domain.tld`;
    const password = randStr(10);

    const signupRes = await authClient.signup({ username, email, password });
    expect(signupRes.statusCode).toBe(HTTP_STATUSES.OK);

    const whoamiRes = await authClient.whoami();
    expect(whoamiRes.statusCode).toBe(HTTP_STATUSES.OK);
    expect(whoamiRes.body.data.whoami).not.toBeNull();

    const user = whoamiRes.body.data.whoami!;
    expect(user.username).toBe(username);
    expect(user.email).toBe(email);
  });
});

describe('login', () => {
  let username: string;
  let email: string;
  let password: string;

  beforeEach(async () => {
    username = randStr(10);
    email = `${username}@domain.tld`;
    password = randStr(10);

    await authClient.signup({ username, email, password });
    await authClient.logout();
  });

  it('logs the user in using username and password', async () => {
    const loginRes = await authClient.login({ usernameOrEmail: username, password });
    expect(loginRes.statusCode).toBe(HTTP_STATUSES.OK);

    const whoamiRes = await authClient.whoami();
    expect(whoamiRes.statusCode).toBe(HTTP_STATUSES.OK);
    expect(whoamiRes.body.data.whoami).not.toBeNull();

    const user = whoamiRes.body.data.whoami!;
    expect(user.username).toBe(username);
    expect(user.email).toBe(email);
  });

  it('logs the user in using email and password', async () => {
    const loginRes = await authClient.login({ usernameOrEmail: email, password });
    expect(loginRes.statusCode).toBe(HTTP_STATUSES.OK);

    const whoamiRes = await authClient.whoami();
    expect(whoamiRes.statusCode).toBe(HTTP_STATUSES.OK);
    expect(whoamiRes.body.data.whoami).not.toBeNull();

    const user = whoamiRes.body.data.whoami!;
    expect(user.username).toBe(username);
    expect(user.email).toBe(email);
  });

  it('does not log the user in when wrong password', async () => {
    const loginRes = await authClient.login({ usernameOrEmail: username, password: randStr(password.length + 1) });
    expect(loginRes.statusCode).toBe(HTTP_STATUSES.FORBIDDEN);

    const whoamiRes = await authClient.whoami();
    expect(whoamiRes.statusCode).toBe(HTTP_STATUSES.OK);
    expect(whoamiRes.body.data.whoami).toBeNull();
  });

  it('returns a forbidden status when already logged in', async () => {
    const loginRes1 = await authClient.login({ usernameOrEmail: username, password });
    expect(loginRes1.statusCode).toBe(HTTP_STATUSES.OK);

    const loginRes2 = await authClient.login({ usernameOrEmail: username, password });
    expect(loginRes2.statusCode).toBe(HTTP_STATUSES.FORBIDDEN);
  });
});

describe('logout', () => {
  let username: string;
  let email: string;
  let password: string;

  beforeEach(async () => {
    username = randStr(10);
    email = `${username}@domain.tld`;
    password = randStr(10);

    await authClient.signup({ username, email, password });
    await authClient.logout();
  });

  it('logs a user out', async () => {
    const loginRes = await authClient.login({ usernameOrEmail: username, password });
    expect(loginRes.statusCode).toBe(HTTP_STATUSES.OK);

    const logoutRes = await authClient.logout();
    expect(logoutRes.statusCode).toBe(HTTP_STATUSES.OK);
    expect(logoutRes.body.data.logout).toBe(true);

    const whoamiRes = await authClient.whoami();
    expect(whoamiRes.statusCode).toBe(HTTP_STATUSES.OK);
    expect(whoamiRes.body.data.whoami).toBeNull();
  });

  it('returns a forbidden status when already logged out', async () => {
    const logoutRes = await authClient.logout();
    expect(logoutRes.statusCode).toBe(HTTP_STATUSES.FORBIDDEN);
  });
});

describe('confirmEmail', () => {
  let username: string;
  let email: string;
  let password: string;
  let confirmationToken: string;

  beforeEach(async () => {
    username = randStr(10);
    email = `${username}@domain.tld`;
    password = randStr(10);

    const res = await authClient.signup({ username, email, password });
    const { id } = res.body.data.signup!;
    await authClient.logout();

    const userService = container.get<UserService>(TYPES.UserService);
    const user = await userService.find(id);
    expect(user).not.toBeNull();
    expect(user!.confirmationToken).not.toBeNull();
    confirmationToken = user!.confirmationToken!;
  });

  it('sets confirmed at for logged in user', async () => {
    const loginRes = await authClient.login({ usernameOrEmail: username, password });
    expect(loginRes.statusCode).toBe(HTTP_STATUSES.OK);

    const whoamiRes = await authClient.whoami();
    expect(whoamiRes.statusCode).toBe(HTTP_STATUSES.OK);
    expect(whoamiRes.body.data.whoami).not.toBeNull();
    expect(whoamiRes.body.data.whoami!.confirmedAt).toBeNull();

    const confirmEmailRes = await authClient.confirmEmail({ confirmationToken });
    expect(confirmEmailRes.statusCode).toBe(HTTP_STATUSES.OK);
    expect(confirmEmailRes.body.data.confirmEmail.confirmedAt).not.toBeNull();
  });

  it('returns a forbidden status when not logged in', async () => {
    const confirmEmailRes = await authClient.confirmEmail({ confirmationToken });
    expect(confirmEmailRes.statusCode).toBe(HTTP_STATUSES.FORBIDDEN);
  });
});

describe('resendConfirmationEmail', () => {
  let userService: UserService;
  let username: string;
  let email: string;
  let password: string;
  let confirmationToken: string;

  beforeEach(async () => {
    userService = container.get<UserService>(TYPES.UserService);

    username = randStr(10);
    email = `${username}@domain.tld`;
    password = randStr(10);

    const res = await authClient.signup({ username, email, password });
    const { id } = res.body.data.signup!;
    await authClient.logout();

    const user = await userService.find(id);
    expect(user).not.toBeNull();
    expect(user!.confirmationToken).not.toBeNull();
    confirmationToken = user!.confirmationToken!;
  });

  it('resets the logged in user confirmation token', async () => {
    const beforeUser = await userService.findByUsernameOrEmail(username);
    const beforeConfirmationToken = beforeUser!.confirmationToken;
    expect(beforeUser).not.toBeNull();
    expect(beforeConfirmationToken).not.toBeNull();

    const loginRes = await authClient.login({ usernameOrEmail: username, password });
    expect(loginRes.statusCode).toBe(HTTP_STATUSES.OK);

    const resendConfirmationEmailRes = await authClient.resendConfirmationEmail();
    expect(resendConfirmationEmailRes.statusCode).toBe(HTTP_STATUSES.OK);
    expect(resendConfirmationEmailRes.body.data.resendConfirmationEmail).toBe(true);

    const afterUser = await userService.findByUsernameOrEmail(username);
    const afterConfirmationToken = afterUser!.confirmationToken;
    expect(afterUser).not.toBeNull();
    expect(afterConfirmationToken).not.toBeNull();

    expect(afterConfirmationToken).not.toBe(beforeConfirmationToken);
  });

  it('silently fails if already confirmed', async () => {
    const loginRes = await authClient.login({ usernameOrEmail: username, password });
    expect(loginRes.statusCode).toBe(HTTP_STATUSES.OK);

    const confirmEmailRes = await authClient.confirmEmail({ confirmationToken });
    expect(confirmEmailRes.statusCode).toBe(HTTP_STATUSES.OK);

    const resendConfirmationEmailRes = await authClient.resendConfirmationEmail();
    expect(resendConfirmationEmailRes.statusCode).toBe(HTTP_STATUSES.OK);
    expect(resendConfirmationEmailRes.body.data.resendConfirmationEmail).toBe(true);
  });
});

describe('reqPasswordReset', () => {
  let userService: UserService;

  let email: string;
  let user: User;

  beforeEach(async () => {
    userService = container.get<UserService>(TYPES.UserService);
    userService.userRepo.userLoader.startListeningForChanges();

    const username = randStr(10);
    email = `${username}@domain.tld`;
    const password = randStr(10);

    const signupRes = await authClient.signup({ username, email, password });
    const { id } = signupRes.body.data.signup;
    user = (await userService.find(id))!;
    await authClient.logout();
  });

  afterEach(() => {
    userService.userRepo.userLoader.stopListeningForChanges();
  });

  it('resets passwordResetToken', async () => {
    const reqPasswordResetRes = await authClient.reqPasswordReset({ email });
    expect(reqPasswordResetRes.statusCode).toBe(HTTP_STATUSES.OK);
    expect(reqPasswordResetRes.body.data.reqPasswordReset).toBe(true);

    const reloadedUser = await userService.find(user.id);

    expect(reloadedUser).not.toBeNull();
    expect(reloadedUser!.resetPasswordToken).not.toBeNull();
    expect(reloadedUser!.resetPasswordTokenSentAt).not.toBeNull();
  });
});

describe('reqPasswordReset', () => {
  let userService: UserService;

  let email: string;
  let user: User;

  beforeEach(async () => {
    userService = container.get<UserService>(TYPES.UserService);
    userService.userRepo.userLoader.startListeningForChanges();

    const username = randStr(10);
    email = `${username}@domain.tld`;
    const password = randStr(10);

    const signupRes = await authClient.signup({ username, email, password });
    const { id } = signupRes.body.data.signup;
    user = (await userService.find(id))!;
    await authClient.logout();
  });

  afterEach(() => {
    userService.userRepo.userLoader.stopListeningForChanges();
  });

  it('resets the password', async () => {
    const reqPasswordResetRes = await authClient.reqPasswordReset({ email });
    expect(reqPasswordResetRes.statusCode).toBe(HTTP_STATUSES.OK);
    expect(reqPasswordResetRes.body.data.reqPasswordReset).toBe(true);

    const reloadedUser = await userService.find(user.id);

    const newPassword = randStr(11);
    const resetPasswordRes = await authClient.resetPassword({
      resetPasswordToken: reloadedUser!.resetPasswordToken!,
      password: newPassword,
    });
    expect(resetPasswordRes.statusCode).toBe(HTTP_STATUSES.OK);
    expect(resetPasswordRes.body.data.resetPassword).toBe(true);

    const loginRes = await authClient.login({ usernameOrEmail: email, password: newPassword });
    expect(loginRes.statusCode).toBe(HTTP_STATUSES.OK);

    const whoamiRes = await authClient.whoami();
    expect(whoamiRes.statusCode).toBe(HTTP_STATUSES.OK);
    expect(whoamiRes.body.data.whoami).not.toBeNull();
    expect(whoamiRes.body.data.whoami!.id).toBe(user.id);
  });
});
