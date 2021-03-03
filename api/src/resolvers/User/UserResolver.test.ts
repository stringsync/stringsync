import { User, UserRole } from '../../domain';
import { container } from '../../inversify.config';
import { TYPES } from '../../inversify.constants';
import { UserRepo } from '../../repos';
import { buildRandUser, createRandUser, getSessionUser, gql, LoginStatus, Query, resolve } from '../../testing';
import { UserConnectionArgs } from '../../util';
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
});
