import express from 'express';
import cors from 'cors';
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

app.use(cors());

app.get('/', (req, res) => {
  res.json({
    msg: 'Hello, from the server!',
  });
});

// only listen for requests if the file was executed
if (require.main === module) {
  app.listen(port);
}

export default app;
