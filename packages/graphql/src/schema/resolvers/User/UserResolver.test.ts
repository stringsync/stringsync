import { EntityBuilder, HttpStatus, randStr } from '@stringsync/common';
import { TYPES } from '@stringsync/di';
import { eqTeacher, User, UserRole } from '@stringsync/domain';
import { Factory, UserRepo } from '@stringsync/repos';
import { AuthService } from '@stringsync/services';
import { TestGraphqlClient, useTestApp } from '../../../testing';
import { TestAuthClient } from '../Auth/TestAuthClient';
import { TestUserClient } from './TestUserClient';

const { app, container } = useTestApp();

let factory: Factory;
let userRepo: UserRepo;

let graphqlClient: TestGraphqlClient;
let authClient: TestAuthClient;
let userClient: TestUserClient;

let password: string;

let student: User;
let admin: User;

beforeEach(() => {
  factory = container.get<Factory>(TYPES.Factory);
  userRepo = container.get<UserRepo>(TYPES.UserRepo);

  graphqlClient = new TestGraphqlClient(app);
  authClient = new TestAuthClient(graphqlClient);
  userClient = new TestUserClient(graphqlClient);
});

beforeEach(async () => {
  password = randStr(10);
  const encryptedPassword = await AuthService.encryptPassword(password);
  [student, admin] = await userRepo.bulkCreate([
    EntityBuilder.buildRandUser({ encryptedPassword, role: UserRole.STUDENT }),
    EntityBuilder.buildRandUser({ encryptedPassword, role: UserRole.ADMIN }),
  ]);
});

describe('updateUser', () => {
  it('updates a logged in student', async () => {
    const loginRes = await authClient.login({ usernameOrEmail: student.username, password });
    expect(loginRes.statusCode).toBe(HttpStatus.OK);

    const username = randStr(12);
    const updateUserRes = await userClient.updateUser({ id: student.id, username });
    expect(updateUserRes.statusCode).toBe(HttpStatus.OK);

    const updatedUser = updateUserRes.body.data.updateUser!;
    expect(updatedUser.username).toBe(username);
    expect(updatedUser.email).toBe(student.email);
  });

  it('updates a logged in admin', async () => {
    const loginRes = await authClient.login({ usernameOrEmail: admin.username, password });
    expect(loginRes.statusCode).toBe(HttpStatus.OK);

    const username = randStr(12);
    const updateUserRes = await userClient.updateUser({ id: admin.id, username });
    expect(updateUserRes.statusCode).toBe(HttpStatus.OK);

    const updatedUser = updateUserRes.body.data.updateUser!;
    expect(updatedUser.username).toBe(username);
    expect(updatedUser.email).toBe(admin.email);
  });
});
