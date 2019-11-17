import { guardUserRole } from './guardUserRole';
import { User } from 'common/types';

const BASE_USER: User = {
  id: '1',
  role: 'student',
  createdAt: new Date(),
  updatedAt: new Date(),
  username: 'username',
  email: 'email@email.com',
};
const STUDENT: User = {
  ...BASE_USER,
  role: 'student',
};
const TEACHER: User = {
  ...BASE_USER,
  role: 'teacher',
};
const ADMIN: User = {
  ...BASE_USER,
  role: 'admin',
};

it('throws an error when user is null', () => {
  expect(() => guardUserRole('student', null)).toThrowError(
    'must be logged in'
  );
});

it('throws an error when the user is not a teacher', () => {
  expect(() => guardUserRole('teacher', STUDENT)).toThrowError(
    'username is not role: teacher'
  );
});

it.each([TEACHER, ADMIN])(
  'does not throw an error when the user is a teacher',
  (teacher) => {
    expect(() => guardUserRole('teacher', teacher)).not.toThrow();
  }
);

it.each([STUDENT, TEACHER])(
  'throws an error when the user is not an admin',
  (nonAdmin) => {
    expect(() => guardUserRole('admin', nonAdmin)).toThrowError(
      'username is not role: admin'
    );
  }
);

it('does not throw an error when the user is an admin', () => {
  expect(() => guardUserRole('admin', ADMIN)).not.toThrow();
});
