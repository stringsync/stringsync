const encryptedPassword =
  '$2b$10$OlF1bUqORoywn42UmkEq/O9H5X3QdDG8Iwn5tPuBFjGqGo3dA7mDe'; // password = 'password'

export const getUserFixtures = () => ({
  student1: {
    id: 'student1-id',
    username: 'student1-username',
    email: 'student1@email.com',
    encryptedPassword,
  },
});
