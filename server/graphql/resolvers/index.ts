import { Query } from './Query';
import { Subscription } from './Subscription';
import { auth } from './Mutation/auth';
import { post } from './Mutation/post';
import { User } from './User';
import { Post } from './Post';

const resolvers = {
  Query,
  Mutation: {
    ...auth,
    ...post,
  },
  Subscription,
  User,
  Post,
};

export default resolvers;
