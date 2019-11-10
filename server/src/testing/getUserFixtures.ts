const encryptedPassword =
  '$2b$10$OlF1bUqORoywn42UmkEq/O9H5X3QdDG8Iwn5tPuBFjGqGo3dA7mDe'; // password = 'password'

export const getUserFixtures = () => ({
  student1: {
    id: 'student1-id',
    username: 'student1-username',
    email: 'student1@email.com',
    encryptedPassword,
  },
  student2: {
    id: 'student2-id',
    username: 'student2-username',
    email: 'student2@email.com',
    encryptedPassword,
  },
  teacher1: {
    id: 'teacher1-id',
    username: 'teacher1-username',
    email: 'teacher1@email.com',
    encryptedPassword,
  },
});
