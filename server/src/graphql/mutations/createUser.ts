import { User, UserInput } from '../types/User';
import { Db } from '../db';

export default {
  createUser: {
    type: User,
    description: 'Creates a new user',
    args: {
      userInput: { type: UserInput },
    },
    resolve: (parent, args) => {
      const user = args.userInput;
      Db.users.push({ ...user });
      return user;
    },
  },
};
