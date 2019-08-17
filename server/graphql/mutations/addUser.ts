import { User, UserInput } from '../types/User';

export default {
  addUser: {
    type: User,
    description: 'Creates a new user',
    args: {
      user: {
        type: UserInput,
      },
    },
    resolve: (parent, args) => {
      // Database query
      // Return user object
    },
  },
};
