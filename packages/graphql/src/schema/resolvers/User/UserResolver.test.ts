import { EntityBuilder, ErrorCode, HttpStatus, identity, randStr } from '@stringsync/common';
import { TYPES } from '@stringsync/di';
import { User, UserRole } from '@stringsync/domain';
import { Factory, UserRepo } from '@stringsync/repos';
import { AuthService } from '@stringsync/services';
import { TestGraphqlClient, useTestApp } from '../../../testing';
import { TestAuthClient } from '../Auth/TestAuthClient';
import { TestUserClient } from './TestUserClient';
import { UpdateUserInput } from './UpdateUserInput';

const { app, container } = useTestApp();

let factory: Factory;
let userRepo: UserRepo;

let graphqlClient: TestGraphqlClient;
let authClient: TestAuthClient;
let userClient: TestUserClient;

let password: string;

let student: User;
let teacher: User;
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
  [student, teacher, admin] = await userRepo.bulkCreate([
    EntityBuilder.buildRandUser({ encryptedPassword, role: UserRole.STUDENT }),
    EntityBuilder.buildRandUser({ encryptedPassword, role: UserRole.TEACHER }),
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

  it('allows admins to update the role of other users', async () => {
    const loginRes = await authClient.login({ usernameOrEmail: admin.username, password });
    expect(loginRes.statusCode).toBe(HttpStatus.OK);

    const updateUserRes = await userClient.updateUser({ id: student.id, role: UserRole.TEACHER });
    expect(updateUserRes.statusCode).toBe(HttpStatus.OK);

    const updatedUser = updateUserRes.body.data.updateUser;
    expect(updatedUser).not.toBeNull();
    expect(updatedUser!.role).toBe(UserRole.TEACHER);
  });

  it('disallows logged out users', async () => {
    const updateUserRes = await userClient.updateUser({ id: student.id, username: randStr(12) });
    expect(updateUserRes.statusCode).toBe(HttpStatus.OK);

    expect(updateUserRes.body.data.updateUser).toBeNull();
    expect(updateUserRes).toHaveErrorCode(ErrorCode.FORBIDDEN);
  });

  it('disallows users from updating another user', async () => {
    const user = await factory.createRandUser();

    const loginRes = await authClient.login({ usernameOrEmail: student.username, password });
    expect(loginRes.statusCode).toBe(HttpStatus.OK);

    const username = randStr(12);
    const updateUserRes = await userClient.updateUser({ id: user.id, username });
    expect(updateUserRes.statusCode).toBe(HttpStatus.OK);

    expect(updateUserRes.body.data.updateUser).toBeNull();
    expect(updateUserRes).toHaveErrorCode(ErrorCode.FORBIDDEN);
  });

  it.each<Omit<UpdateUserInput, 'id'>>([
    { email: 'updatedemail123@gmail.com' },
    { email: 'asdfasdf@gmail.com', username: 'newusername' },
    { username: 'newusername24' },
  ])('disallows admins from updating other non role attributes', async (attrs) => {
    const loginRes = await authClient.login({ usernameOrEmail: admin.username, password });
    expect(loginRes.statusCode).toBe(HttpStatus.OK);

    const updateUserRes = await userClient.updateUser({ id: student.id, ...attrs });
    expect(updateUserRes.statusCode).toBe(HttpStatus.OK);
    expect(updateUserRes).toHaveErrorCode(ErrorCode.BAD_REQUEST);
  });

  it('disallows users from updating role', async () => {
    const loginRes = await authClient.login({ usernameOrEmail: student.username, password });
    expect(loginRes.statusCode).toBe(HttpStatus.OK);

    const updateUserRes = await userClient.updateUser({ id: student.id, username: 'adsf23fg2g', role: UserRole.ADMIN });
    expect(updateUserRes.statusCode).toBe(HttpStatus.OK);
    expect(updateUserRes).toHaveErrorCode(ErrorCode.BAD_REQUEST);
  });
});
