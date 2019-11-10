import { getCookies } from './getCookies';
import { getAuthenticatedUser } from './getAuthenticatedUser';
import { getRequestContextCreator } from './getRequestContextCreator';
import { createDataLoaders } from '../data-loaders/createDataLoaders';
import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';
import { getConfig } from '../config';
import { createTestDbProvider } from '../testing';

jest.mock('./getCookies', () => ({
  getCookies: jest.fn().mockReturnValue({}),
}));

jest.mock('./getAuthenticatedUser', () => ({
  getAuthenticatedUser: jest.fn().mockReturnValue({}),
}));

jest.mock('../data-loaders/createDataLoaders', () => ({
  createDataLoaders: jest.fn().mockReturnValue({}),
}));

const EXPRESS_CONTEXT = {
  req: { headers: { cookie: '' } },
  res: {},
} as ExpressContext;

const config = getConfig(process.env);
const provideTestDb = createTestDbProvider(config);

afterEach(() => {
  jest.clearAllMocks();
});

test('uses getCookies', async () => {
  await provideTestDb({}, async (db) => {
    const userSessionToken = 'foo-token';
    const cookies = { USER_SESSION_TOKEN: userSessionToken };
    (getCookies as jest.Mock).mockReturnValueOnce(cookies);

    const createRequestContext = getRequestContextCreator(db);
    const ctx = await createRequestContext(EXPRESS_CONTEXT);

    expect(getCookies).toBeCalledTimes(1);
    expect(ctx.cookies).toStrictEqual(cookies);
    expect(ctx.auth.token).toBe(userSessionToken);
  });
});

test('uses createDataLoaders', async () => {
  await provideTestDb({}, async (db) => {
    const dataLoaders = Symbol('data-loaders');
    (createDataLoaders as jest.Mock).mockReturnValueOnce(dataLoaders);

    const createRequestContext = getRequestContextCreator(db);
    const ctx = await createRequestContext(EXPRESS_CONTEXT);

    expect(ctx.dataLoaders).toBe(dataLoaders);
  });
});

test('handles when getAuthenticatedUser returns a user', async () => {
  await provideTestDb({}, async (db) => {
    const user = Symbol('user');
    (getAuthenticatedUser as jest.Mock).mockReturnValueOnce(user);

    const createRequestContext = getRequestContextCreator(db);
    const ctx = await createRequestContext(EXPRESS_CONTEXT);

    expect(getAuthenticatedUser).toBeCalledTimes(1);
    expect(ctx.auth.user).toBe(user);
    expect(ctx.auth.isLoggedIn).toBe(true);
  });
});

test('handles when getAuthenticatedUser returns null', async () => {
  await provideTestDb({}, async (db) => {
    (getAuthenticatedUser as jest.Mock).mockReturnValueOnce(null);

    const createRequestContext = getRequestContextCreator(db);
    const ctx = await createRequestContext(EXPRESS_CONTEXT);

    expect(getAuthenticatedUser).toBeCalledTimes(1);
    expect(ctx.auth.user).toBeNull();
    expect(ctx.auth.isLoggedIn).toBe(false);
  });
});
