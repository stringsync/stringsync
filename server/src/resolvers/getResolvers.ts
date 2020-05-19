// import { getUser, getUsers } from './query';
// import { notations } from './user';
// import {
//   login,
//   logout,
//   signup,
//   authenticate,
//   confirmEmail,
//   resendConfirmation,
// } from './mutation';

// export const getResolvers = () => ({
//   User: {
//     notations,
//   },
//   Query: {
//     getUsers,
//     getUser,
//   },
//   Mutation: {
//     login,
//     logout,
//     signup,
//     authenticate,
//     confirmEmail,
//     resendConfirmation,
//   },
// });

export const getResolvers = () => ({
  hello: () => {
    return 'hello from the server';
  },
});
