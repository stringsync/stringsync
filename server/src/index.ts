// import express from 'express';
// import graphqlHTTP from 'express-graphql';
// import { prisma } from './prisma/generated/prisma-client';
// import schema from './graphql/schema';
//
// const app = express();
// const port = 8080;
//
// app.use(
//   '/graphql',
//   graphqlHTTP({
//     schema,
//     graphiql: true,
//     context: {
//       prisma,
//     },
//   })
// );

import express from 'express';

const app = express();
const port = 8080;

app.get('/', (req, res) => {
  res.json({
    message: 'Hello, world',
  });
});

app.listen(port, () => console.log(`Server running on port ${port}`));
