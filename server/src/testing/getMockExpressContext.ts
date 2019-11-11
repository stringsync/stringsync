import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';

export const getMockExpressContext = () => {
  return {
    req: { headers: { cookie: '' } },
    res: {},
  } as ExpressContext;
};
