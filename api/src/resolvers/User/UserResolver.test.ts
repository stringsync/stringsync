import { User, UserRole } from '../../domain';
import { container } from '../../inversify.config';
import { TYPES } from '../../inversify.constants';
import { UserRepo } from '../../repos';
import {
  buildRandUser,
  createRandUser,
  getSessionUser,
  gql,
  LoginStatus,
  Mutation,
  Query,
  resolve,
} from '../../testing';
import { randStr, UserConnectionArgs } from '../../util';
import { UpdateUserInput } from './UpdateUserInput';
import { UserArgs } from './UserArgs';

describe('UserResolver', () => {
  describe('user', () => {
    let user: User;

    beforeEach(async () => {
      user = await createRandUser();
    });

    // prevent name clash with user
    const userQuery = (args: UserArgs) => {
      return resolve<Query, 'user', UserArgs>(
        gql`
          query user($id: String!) {
            user(id: $id) {
              id
            }
          }
        `,
        args,
        {}
      );
    };

    it('finds the user matching the id', async () => {
      const { res } = await userQuery({ id: user.id });

      expect(res.errors).not.toBeDefined();
      expect(res.data.user).toBeDefined();
      expect(res.data.user).not.toBeNull();
      expect(res.data.user!.id).toBe(user.id);
    });
  });

  describe('users', () => {
    let users: User[];

    let student: User;
    let teacher: User;
    let admin: User;

    beforeEach(async () => {
      const userRepo = container.get<UserRepo>(TYPES.UserRepo);

      users = await userRepo.bulkCreate([
        buildRandUser({ role: UserRole.STUDENT }),
        buildRandUser({ role: UserRole.TEACHER }),
        buildRandUser({ role: UserRole.ADMIN }),
      ]);

      [student, teacher, admin] = users;
    });

    const usersQuery = (args: UserConnectionArgs, loginStatus: LoginStatus) => {
      return resolve<Query, 'users', UserConnectionArgs>(
        gql`
          query users($before: String, $after: String, $first: Float, $last: Float) {
            users(before: $before, after: $after, first: $first, last: $last) {
              edges {
                node {
                  id
                }
              }
            }
          }
        `,
        args,
        { sessionUser: getSessionUser({ admin, teacher, student }, loginStatus) }
      );
    };

    it('retrieves notations when LOGGED_IN_AS_ADMIN', async () => {
      const { res } = await usersQuery({ first: users.length }, LoginStatus.LOGGED_IN_AS_ADMIN);

      expect(res.errors).toBeUndefined();
      const userIds = res.data.users.edges.map((edge) => edge.node.id);
      expect(userIds).toIncludeSameMembers(users.map((user) => user.id));
    });

    it.each([LoginStatus.LOGGED_IN_AS_STUDENT, LoginStatus.LOGGED_IN_AS_TEACHER, LoginStatus.LOGGED_OUT])(
      'forbids retrieving notations when %s',
      async (loginStatus) => {
        const { res } = await usersQuery({ first: users.length }, loginStatus);

        expect(res.errors).toBeDefined();
      }
    );
  });

  describe('updateUser', () => {
    let userRepo: UserRepo;

    let users: User[];
    let student: User;
    let teacher: User;
    let admin: User;

    beforeEach(async () => {
      userRepo = container.get<UserRepo>(TYPES.UserRepo);

      users = await userRepo.bulkCreate([
        buildRandUser({ role: UserRole.STUDENT }),
        buildRandUser({ role: UserRole.TEACHER }),
        buildRandUser({ role: UserRole.ADMIN }),
      ]);

      [student, teacher, admin] = users;
    });

    const updateUser = (input: UpdateUserInput, loginStatus: LoginStatus) => {
      return resolve<Mutation, 'updateUser', { input: UpdateUserInput }>(
        gql`
          mutation updateUser($input: UpdateUserInput!) {
            updateUser(input: $input) {
              id
              username
              email
              role
            }
          }
        `,
        { input },
        {
          sessionUser: getSessionUser({ student, teacher, admin }, loginStatus),
        }
      );
    };

    it.each([LoginStatus.LOGGED_IN_AS_STUDENT, LoginStatus.LOGGED_IN_AS_TEACHER, LoginStatus.LOGGED_OUT])(
      'disallows role update when %s',
      async (loginStatus) => {
        const { res } = await updateUser({ id: student.id, role: UserRole.ADMIN }, loginStatus);

        expect(res.errors).toBeDefined();

        const reloadedStudent = await userRepo.find(student.id);
        expect(reloadedStudent).not.toBeNull();
        expect(reloadedStudent!.role).toBe(UserRole.STUDENT);
      }
    );

    it('permits admins to update role', async () => {
      const { res } = await updateUser({ id: student.id, role: UserRole.ADMIN }, LoginStatus.LOGGED_IN_AS_ADMIN);

      expect(res.errors).not.toBeDefined();
      expect(res.data.updateUser).not.toBeNull();
      expect(res.data.updateUser).toBeDefined();

      const userId = res.data.updateUser!.id;
      expect(userId).toBe(student.id);
      const reloadedStudent = await userRepo.find(student.id);
      expect(reloadedStudent).not.toBeNull();
      expect(reloadedStudent!.role).toBe(UserRole.ADMIN);
    });

    it('disallows admins to update usernames', async () => {
      const username = randStr(student.username.length + 1);
      const { res } = await updateUser({ id: student.id, username }, LoginStatus.LOGGED_IN_AS_ADMIN);

      expect(res.errors).toBeDefined();

      const reloadedStudent = await userRepo.find(student.id);
      expect(reloadedStudent).not.toBeNull();
      expect(reloadedStudent!.username).toBe(student.username);
    });

    it('disallows admins to update emails', async () => {
      const email = randStr(3) + student.email;
      const { res } = await updateUser({ id: student.id, email }, LoginStatus.LOGGED_IN_AS_ADMIN);

      expect(res.errors).toBeDefined();

      const reloadedStudent = await userRepo.find(student.id);
      expect(reloadedStudent).not.toBeNull();
      expect(reloadedStudent!.email).toBe(student.email);
    });

    it('permits students to update usernames', async () => {
      const username = randStr(student.username.length + 1);
      const { res } = await updateUser({ id: student.id, username }, LoginStatus.LOGGED_IN_AS_STUDENT);

      expect(res.errors).not.toBeDefined();
      expect(res.data.updateUser).not.toBeNull();
      expect(res.data.updateUser).toBeDefined();

      const reloadedUser = await userRepo.findByUsernameOrEmail(username);
      expect(reloadedUser).not.toBeNull();
      expect(reloadedUser!.id).toBe(student.id);
    });

    it('permits teachers to update usernames', async () => {
      const username = randStr(teacher.username.length + 1);
      const { res } = await updateUser({ id: teacher.id, username }, LoginStatus.LOGGED_IN_AS_TEACHER);

      expect(res.errors).not.toBeDefined();
      expect(res.data.updateUser).not.toBeNull();
      expect(res.data.updateUser).toBeDefined();

      const reloadedUser = await userRepo.findByUsernameOrEmail(username);
      expect(reloadedUser).not.toBeNull();
      expect(reloadedUser!.id).toBe(teacher.id);
    });

    it('permits admin to update usernames', async () => {
      const username = randStr(admin.username.length + 1);
      const { res } = await updateUser({ id: admin.id, username }, LoginStatus.LOGGED_IN_AS_ADMIN);

      expect(res.errors).not.toBeDefined();
      expect(res.data.updateUser).not.toBeNull();
      expect(res.data.updateUser).toBeDefined();

      const reloadedUser = await userRepo.findByUsernameOrEmail(username);
      expect(reloadedUser).not.toBeNull();
      expect(reloadedUser!.id).toBe(admin.id);
    });

    it('permits students to update emails', async () => {
      const email = randStr(3) + student.email;
      const { res } = await updateUser({ id: student.id, email }, LoginStatus.LOGGED_IN_AS_STUDENT);

      expect(res.errors).not.toBeDefined();
      expect(res.data.updateUser).not.toBeNull();
      expect(res.data.updateUser).toBeDefined();

      const reloadedUser = await userRepo.findByUsernameOrEmail(email);
      expect(reloadedUser).not.toBeNull();
      expect(reloadedUser!.id).toBe(student.id);
    });

    it('permits teachers to update emails', async () => {
      const email = randStr(3) + teacher.email;
      const { res } = await updateUser({ id: teacher.id, email }, LoginStatus.LOGGED_IN_AS_TEACHER);

      expect(res.errors).not.toBeDefined();
      expect(res.data.updateUser).not.toBeNull();
      expect(res.data.updateUser).toBeDefined();

      const reloadedUser = await userRepo.findByUsernameOrEmail(email);
      expect(reloadedUser).not.toBeNull();
      expect(reloadedUser!.id).toBe(teacher.id);
    });

    it('permits admin to update emails', async () => {
      const email = randStr(3) + admin.email;
      const { res } = await updateUser({ id: admin.id, email }, LoginStatus.LOGGED_IN_AS_ADMIN);

      expect(res.errors).not.toBeDefined();
      expect(res.data.updateUser).not.toBeNull();
      expect(res.data.updateUser).toBeDefined();

      const reloadedUser = await userRepo.findByUsernameOrEmail(email);
      expect(reloadedUser).not.toBeNull();
      expect(reloadedUser!.id).toBe(admin.id);
    });
  });
});
