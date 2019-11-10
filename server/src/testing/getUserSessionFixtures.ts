const NOW = new Date();
const PAST = new Date(NOW.getTime() - 1);
const FUTURE = new Date(NOW.getTime() + 1);

export const getUserSessionFixtures = () => ({
  student1Session: {
    issuedAt: PAST,
    token: '23dd7932-a42e-42af-95fc-045ef1080bfd',
    userId: 'student1-id',
    expiresAt: FUTURE,
  },
});
