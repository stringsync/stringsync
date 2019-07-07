import express from 'express';
import prisma from './prisma';
import graphqlHTTP from 'express-graphql';
import { buildSchema } from 'graphql';

const schema = buildSchema(`
  type Query {
    hello: String
  }
`);

const rootValue = {
  hello: () => {
    return 'Hello world!';
  },
};

const app = express();

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    rootValue,
    graphiql: true,
  })
);

app.get('*', async (req, res, next) => {
  const users = await prisma.users();
  res.json(users);
});

app.listen(4000, () => {
  console.log('Server start on port 4000');
});
