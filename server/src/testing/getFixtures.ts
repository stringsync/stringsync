// User
const ENCRYPTED_PASSWORD =
  '$2b$10$OlF1bUqORoywn42UmkEq/O9H5X3QdDG8Iwn5tPuBFjGqGo3dA7mDe'; // password = 'password'

// UserSession
const NOW = new Date();
const PAST = new Date(NOW.getTime() - 1);
const FUTURE = new Date(NOW.getTime() + 1);

export const getFixtures = () => ({
  User: {
    student1: {
      id: 'student1-id',
      username: 'student1-username',
      email: 'student1@email.com',
      encryptedPassword: ENCRYPTED_PASSWORD,
    },
    student2: {
      id: 'student2-id',
      username: 'student2-username',
      email: 'student2@email.com',
      encryptedPassword: ENCRYPTED_PASSWORD,
    },
    teacher1: {
      id: 'teacher1-id',
      username: 'teacher1-username',
      email: 'teacher1@email.com',
      encryptedPassword: ENCRYPTED_PASSWORD,
    },
  },
  UserSession: {
    student1Session: {
      issuedAt: PAST,
      token: '23dd7932-a42e-42af-95fc-045ef1080bfd',
      userId: 'student1-id',
      expiresAt: FUTURE,
    },
  },
});
