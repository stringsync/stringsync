import express from 'express';
import graphqlHTTP from 'express-graphql';
import { prisma } from './prisma/generated/prisma-client';
import schema from './graphql/schema';

const app = express();
const port = 8080;

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    graphiql: true,
    context: {
      prisma,
    },
  })
);

app.get('/', (req, res) => {
  res.send('Goodbye, world!');
});

app.listen(port, () => console.log(`Server running on port ${port}`));
