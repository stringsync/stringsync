import { GraphQLList } from 'graphql';
import { User } from '../types/User';
import { Db } from '../db';

export default {
  users: {
    type: new GraphQLList(User),
    description: 'Get a list of users',
    args: {},
    resolve: () => {
      return Db.users;
    },
  },
};
