import { useTestApp } from '../../../testing/useTestApp';
import { TestAuthClient } from './TestAuthClient';
import { TestGraphqlClient } from '../../../testing';
import { HTTP_STATUSES, randStr } from '@stringsync/common';

const { app } = useTestApp();

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
