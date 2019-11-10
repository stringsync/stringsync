import { ExpressContext } from 'apollo-server-express/dist/ApolloServer';

export const getFakeExpressContext = () => {
  return {
    req: { headers: { cookie: '' } },
    res: {},
  } as ExpressContext;
};
