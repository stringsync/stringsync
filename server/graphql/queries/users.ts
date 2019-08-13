import { GraphQLList } from 'graphql';
import { User } from '../types/User';

export default {
  users: {
    type: new GraphQLList(User),
    description: 'Get a list of users',
    args: {},
    resolve: () => {
      // get users from db
    },
  },
};
