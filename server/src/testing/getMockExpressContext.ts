import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';
import { createRequest, createResponse } from 'node-mocks-http';
import { ExpressContextOptions } from './types';

export const getMockExpressContext = (
  options: ExpressContextOptions
): ExpressContext => {
  return {
    req: createRequest(options.req),
    res: createResponse(options.res),
  };
};
