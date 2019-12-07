import { getCookies } from './getCookies';
import { getAuthenticatedRawUser } from '../db/models/user/getAuthenticatedRawUser';
import { getRequestContextCreator } from './getRequestContextCreator';
import { getDataLoaders } from '../data-loaders/getDataLoaders';
import { useTestDb, getMockExpressContext } from '../testing';

jest.mock('./getCookies', () => ({
  getCookies: jest.fn().mockReturnValue({}),
}));

jest.mock('../db/models/user/getAuthenticatedRawUser', () => ({
  getAuthenticatedRawUser: jest.fn().mockReturnValue({}),
}));

jest.mock('../data-loaders/getDataLoaders', () => ({
  getDataLoaders: jest.fn().mockReturnValue({}),
}));

afterEach(() => {
  jest.clearAllMocks();
});

it(
  'uses getCookies',
  useTestDb({}, async (db) => {
    const userSessionToken = 'foo-token';
    const cookies = { USER_SESSION_TOKEN: userSessionToken };
    (getCookies as jest.Mock).mockReturnValueOnce(cookies);

    const createRequestContext = getRequestContextCreator(db);
    const ctx = await createRequestContext(getMockExpressContext({}));

    expect(getCookies).toBeCalledTimes(1);
    expect(ctx.cookies).toStrictEqual(cookies);
    expect(ctx.auth.token).toBe(userSessionToken);
  })
);

it(
  'uses getDataLoaders',
  useTestDb({}, async (db) => {
    const dataLoaders = Symbol('data-loaders');
    (getDataLoaders as jest.Mock).mockReturnValueOnce(dataLoaders);

    const createRequestContext = getRequestContextCreator(db);
    const ctx = await createRequestContext(getMockExpressContext({}));

    expect(getDataLoaders).toBeCalledTimes(1);
    expect(ctx.dataLoaders).toBe(dataLoaders);
  })
);

it(
  'handles when getAuthenticatedRawUser returns a user',
  useTestDb({}, async (db) => {
    const user = Symbol('user');
    (getAuthenticatedRawUser as jest.Mock).mockReturnValueOnce(user);

    const createRequestContext = getRequestContextCreator(db);
    const ctx = await createRequestContext(getMockExpressContext({}));

    expect(getAuthenticatedRawUser).toBeCalledTimes(1);
    expect(ctx.auth.user).toBe(user);
    expect(ctx.auth.isLoggedIn).toBe(true);
  })
);

it(
  'handles when getAuthenticatedRawUser returns null',
  useTestDb({}, async (db) => {
    (getAuthenticatedRawUser as jest.Mock).mockReturnValueOnce(null);

    const createRequestContext = getRequestContextCreator(db);
    const ctx = await createRequestContext(getMockExpressContext({}));

    expect(getAuthenticatedRawUser).toBeCalledTimes(1);
    expect(ctx.auth.user).toBeNull();
    expect(ctx.auth.isLoggedIn).toBe(false);
  })
);
