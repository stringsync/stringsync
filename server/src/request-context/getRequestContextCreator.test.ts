import { getCookies } from './getCookies';
import { getAuthenticatedUser } from '../db/models/user/getAuthenticatedUser';
import { getRequestContextCreator } from './getRequestContextCreator';
import { getDataLoaders } from '../data-loaders/getDataLoaders';
import { getConfig } from '../config';
import { getTestDbProvider, getFakeExpressContext } from '../testing';

jest.mock('./getCookies', () => ({
  getCookies: jest.fn().mockReturnValue({}),
}));

jest.mock('../db/models/user/getAuthenticatedUser', () => ({
  getAuthenticatedUser: jest.fn().mockReturnValue({}),
}));

jest.mock('../data-loaders/getDataLoaders', () => ({
  getDataLoaders: jest.fn().mockReturnValue({}),
}));

const config = getConfig(process.env);
const provideTestDb = getTestDbProvider(config);

afterEach(() => {
  jest.clearAllMocks();
});

it(
  'uses getCookies',
  provideTestDb({}, async (db) => {
    const userSessionToken = 'foo-token';
    const cookies = { USER_SESSION_TOKEN: userSessionToken };
    (getCookies as jest.Mock).mockReturnValueOnce(cookies);

    const createRequestContext = getRequestContextCreator(db);
    const ctx = await createRequestContext(getFakeExpressContext());

    expect(getCookies).toBeCalledTimes(1);
    expect(ctx.cookies).toStrictEqual(cookies);
    expect(ctx.auth.token).toBe(userSessionToken);
  })
);

it(
  'uses getDataLoaders',
  provideTestDb({}, async (db) => {
    const dataLoaders = Symbol('data-loaders');
    (getDataLoaders as jest.Mock).mockReturnValueOnce(dataLoaders);

    const createRequestContext = getRequestContextCreator(db);
    const ctx = await createRequestContext(getFakeExpressContext());

    expect(getDataLoaders).toBeCalledTimes(1);
    expect(ctx.dataLoaders).toBe(dataLoaders);
  })
);

it(
  'handles when getAuthenticatedUser returns a user',
  provideTestDb({}, async (db) => {
    const user = Symbol('user');
    (getAuthenticatedUser as jest.Mock).mockReturnValueOnce(user);

    const createRequestContext = getRequestContextCreator(db);
    const ctx = await createRequestContext(getFakeExpressContext());

    expect(getAuthenticatedUser).toBeCalledTimes(1);
    expect(ctx.auth.user).toBe(user);
    expect(ctx.auth.isLoggedIn).toBe(true);
  })
);

it(
  'handles when getAuthenticatedUser returns null',
  provideTestDb({}, async (db) => {
    (getAuthenticatedUser as jest.Mock).mockReturnValueOnce(null);

    const createRequestContext = getRequestContextCreator(db);
    const ctx = await createRequestContext(getFakeExpressContext());

    expect(getAuthenticatedUser).toBeCalledTimes(1);
    expect(ctx.auth.user).toBeNull();
    expect(ctx.auth.isLoggedIn).toBe(false);
  })
);
