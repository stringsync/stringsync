import { Notation, User, UserRole } from '../../domain';
import { container } from '../../inversify.config';
import { TYPES } from '../../inversify.constants';
import { SessionUser } from '../../server';
import { EntityFactory, gql, Mutation, Query, QueryNotationArgs, QueryNotationsArgs, resolve } from '../../testing';
import { CreateNotationInput } from './CreateNotationInput';

describe('NotationResolver', () => {
  let entityFactory: EntityFactory;

  let notations: Notation[];

  beforeEach(async () => {
    entityFactory = container.get<EntityFactory>(TYPES.EntityFactory);

    notations = await Promise.all([
      entityFactory.createRandNotation({ cursor: 1 }),
      entityFactory.createRandNotation({ cursor: 2 }),
      entityFactory.createRandNotation({ cursor: 3 }),
    ]);
  });

  describe('notations', () => {
    // Avoid name clash with notations variable.
    const queryNotations = (args: QueryNotationsArgs) => {
      return resolve<Query, 'notations', QueryNotationsArgs>(
        gql`
          query notations($before: String, $after: String, $first: Float, $last: Float) {
            notations(before: $before, after: $after, first: $first, last: $last) {
              edges {
                cursor
                node {
                  id
                }
              }
            }
          }
        `,
        args,
        {}
      );
    };

    it('returns  notations', async () => {
      const { res } = await queryNotations({});

      expect(res.errors).toBeUndefined();

      const { edges } = res.data.notations;
      const notationIds = edges.map((edge) => edge.node.id);
      expect(notationIds).toIncludeSameMembers(notations.map((notation) => notation.id));
    });

    it('returns the first N notations', async () => {
      const { res } = await queryNotations({ first: 2 });

      expect(res.errors).toBeUndefined();

      const { edges } = res.data.notations;
      const notationIds = edges.map((edge) => edge.node.id);
      const [notation1, notation2] = notations;
      expect(notationIds).toIncludeSameMembers([notation1.id, notation2.id]);
    });
  });

  describe('notation', () => {
    const notation = (args: QueryNotationArgs) => {
      return resolve<Query, 'notation', QueryNotationArgs>(
        gql`
          query notation($id: String!) {
            notation(id: $id) {
              id
            }
          }
        `,
        args,
        {}
      );
    };

    it('returns the record matching the id', async () => {
      const id = notations[0].id;

      const { res } = await notation({ id });

      expect(res.errors).toBeUndefined();
      expect(res.data.notation).toBeDefined();
      expect(res.data.notation!.id).toBe(id);
    });

    it('returns null when no record matches', async () => {
      const { res } = await notation({ id: 'fake_id_i_promise_since_its_super_long' });

      expect(res.errors).toBeUndefined();
      expect(res.data.notation).toBeNull();
    });
  });

  describe('createNotation', () => {
    enum LoginStatus {
      LOGGED_IN_AS_ADMIN = 'LOGGED_IN_AS_ADMIN',
      LOGGED_IN_AS_TEACHER = 'LOGGED_IN_AS_TEACHER',
      LOGGED_IN_AS_STUDENT = 'LOGGED_IN_AS_STUDENT',
      LOGGED_OUT = 'LOGGED_OUT',
    }

    let student: User;
    let teacher: User;
    let admin: User;

    beforeEach(async () => {
      [student, teacher, admin] = await Promise.all([
        entityFactory.createRandUser({ role: UserRole.STUDENT }),
        entityFactory.createRandUser({ role: UserRole.TEACHER }),
        entityFactory.createRandUser({ role: UserRole.ADMIN }),
      ]);
    });

    const getSessionUser = (loginStatus: LoginStatus): SessionUser => {
      switch (loginStatus) {
        case LoginStatus.LOGGED_IN_AS_ADMIN:
          return { id: student.id, isLoggedIn: true, role: student.role };
        case LoginStatus.LOGGED_IN_AS_TEACHER:
          return { id: teacher.id, isLoggedIn: true, role: teacher.role };
        case LoginStatus.LOGGED_IN_AS_STUDENT:
          return { id: admin.id, isLoggedIn: true, role: admin.role };
        case LoginStatus.LOGGED_OUT:
          return { id: '', isLoggedIn: false, role: UserRole.STUDENT };
        default:
          throw new Error(`unhandled loging status: ${loginStatus}`);
      }
    };

    const createNotation = (input: CreateNotationInput, loginStatus: LoginStatus) => {
      return resolve<Mutation, 'createNotation', { input: CreateNotationInput }>(
        gql`
          mutation createNotation($input: CreateNotationInput!) {
            createNotation(input: $input) {
              id
            }
          }
        `,
        { input },
        { sessionUser: getSessionUser(loginStatus) }
      );
    };

    it.todo('creates a notation record when logged in as admin');

    it.todo('creates a notation record when logged in as teacher');

    it.todo('forbids notation creation when logged in as student');

    it.todo('forbids notation creation when not logged in');
  });
});
