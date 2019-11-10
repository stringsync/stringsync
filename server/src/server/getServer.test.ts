import { ApolloServer } from 'apollo-server';
import { getRequestContextCreator } from '../request-context';
import { getErrorFormatter } from './getErrorFormatter';
import { getServer } from './getServer';
import { getConfig } from '../config';

jest.mock('apollo-server');
jest.mock('./getErrorFormatter', () => ({
  getErrorFormatter: jest.fn(),
}));
jest.mock('../request-context', () => ({
  getRequestContextCreator: jest.fn(),
}));

afterEach(() => {
  jest.clearAllMocks();
});

it('wraps the ApolloServer constructor', (done) => {
  const config = getConfig(process.env);
  const db = Symbol('db') as any;
  const schema = Symbol('schema') as any;

  const apolloServer = { apolloServer: Symbol('apollo-server') };
  (ApolloServer as jest.Mock).mockImplementationOnce(() => apolloServer);

  const errorFormatter = Symbol('error-formatter');
  (getErrorFormatter as jest.Mock).mockReturnValueOnce(errorFormatter);

  const requestContextCreator = Symbol('request-context-creator');
  (getRequestContextCreator as jest.Mock).mockReturnValueOnce(
    requestContextCreator
  );

  const server = getServer(db, schema, config);

  expect(ApolloServer).toBeCalledWith({
    schema,
    context: requestContextCreator,
    formatError: errorFormatter,
    cors: {
      origin: config.CLIENT_URI,
      credentials: true,
    },
  });
  expect(getRequestContextCreator).toBeCalledWith(db);
  expect(getErrorFormatter).toBeCalledWith(config.NODE_ENV);
  expect(server).toBe(apolloServer);
  done();
});
