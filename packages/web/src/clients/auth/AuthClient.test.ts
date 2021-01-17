import { GraphqlClient } from './../graphql/GraphqlClient';
import { AuthClient } from './AuthClient';

describe('AuthClient', () => {
  let authClient: AuthClient;
  let graphqlClient: GraphqlClient;
  const fakeRes = { data: {} };

  beforeEach(() => {
    authClient = AuthClient.create();
    graphqlClient = authClient.graphqlClient;
  });

  it('queries whoami', async () => {
    const callSpy = jest.spyOn(graphqlClient, 'call');
    callSpy.mockResolvedValue(fakeRes);

    const res = await authClient.whoami();

    expect(res).toStrictEqual(fakeRes);
  });

  it('queries login', async () => {
    const callSpy = jest.spyOn(graphqlClient, 'call');
    callSpy.mockResolvedValue(fakeRes);

    const res = await authClient.login({ usernameOrEmail: 'usernameOrEmail', password: 'password' });

    expect(res).toStrictEqual(fakeRes);
  });

  it('queries signup', async () => {
    const callSpy = jest.spyOn(graphqlClient, 'call');
    callSpy.mockResolvedValue(fakeRes);

    const res = await authClient.signup({ username: 'username', email: 'email@domain.tld', password: 'password' });

    expect(res).toStrictEqual(fakeRes);
  });
});
