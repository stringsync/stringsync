import { createRequest, createResponse } from 'node-mocks-http';
import { ExpressContextOptions, MockExpressContext } from './types';

export const getMockExpressContext = (
  options: ExpressContextOptions
): MockExpressContext => {
  const req = createRequest(options.req);
  const res = createResponse({ req, ...options.res });
  return { req, res };
};
