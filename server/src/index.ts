import { ApolloServer, gql } from 'apollo-server';

interface Book {
  title: string;
  author: string;
}

const typeDefs = gql`
  type Book {
    title: String
    author: String
  }

  type Query {
    books: [Book]
  }
`;

const books: Book[] = [
  {
    title: 'Harry Potter and the Chamber of Secrets',
    author: 'J.K. Rowling',
  },
  {
    title: 'Jurassic Park',
    author: 'Michael Crichton',
  },
];

const resolvers = {
  Query: {
    books: () => books,
  },
};

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then((serverInfo) => {
  console.log(`🚀 Server ready at ${serverInfo.url}`);
});
