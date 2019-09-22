import { ApolloServer } from 'apollo-server';
import schema from './graphql/schema';
import getContext from './util/getContext';
import sequelize from './util/sequelize';

const PORT = process.env.PORT || 3000;

export const server = new ApolloServer({
  schema,
  context: getContext,
});

const main = async () => {
  // connect to db
  await sequelize.authenticate();
  console.log('🦑 Connected to db successfully');

  // start server
  const serverInfo = await server.listen(PORT);
  console.log(`🦑 Server ready at ${serverInfo.url}`);
};

// runs if the file was executed directly (vs. imported)
if (require.main === module) {
  main();
}
