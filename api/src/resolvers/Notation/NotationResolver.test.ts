import { sortBy, take } from 'lodash';
import { Notation, User, UserRole } from '../../domain';
import { container } from '../../inversify.config';
import { TYPES } from '../../inversify.constants';
import { NotationRepo, UserRepo } from '../../repos';
import { SessionUser } from '../../server';
import {
  buildRandNotation,
  buildRandUser,
  createRandNotations,
  createRandUpload,
  gql,
  Mutation,
  Query,
  QueryNotationArgs,
  QueryNotationsArgs,
  QuerySuggestedNotationsArgs,
  resolve,
} from '../../testing';
import { randStr, Replace } from '../../util';
import { CreateNotationInput } from './CreateNotationInput';

describe('NotationResolver', () => {
  describe('notations', () => {
    let notations: Notation[];

    beforeEach(async () => {
      notations = await createRandNotations(3);
    });

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
      const expectedNotations = take(
        sortBy(notations, (notation) => notation.cursor),
        2
      );
      expect(notationIds).toIncludeSameMembers(expectedNotations.map((notation) => notation.id));
    });
  });

  describe('notation', () => {
    let notations: Notation[];

    beforeEach(async () => {
      notations = await createRandNotations(3);
    });

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

    let userRepo: UserRepo;
    let notationRepo: NotationRepo;

    let student: User;
    let teacher: User;
    let admin: User;

    beforeEach(async () => {
      userRepo = container.get<UserRepo>(TYPES.UserRepo);
      notationRepo = container.get<NotationRepo>(TYPES.NotationRepo);

      [student, teacher, admin] = await userRepo.bulkCreate([
        buildRandUser({ role: UserRole.STUDENT }),
        buildRandUser({ role: UserRole.TEACHER }),
        buildRandUser({ role: UserRole.ADMIN }),
      ]);
    });

    const getSessionUser = (loginStatus: LoginStatus): SessionUser => {
      switch (loginStatus) {
        case LoginStatus.LOGGED_IN_AS_ADMIN:
          return { id: admin.id, isLoggedIn: true, role: admin.role };
        case LoginStatus.LOGGED_IN_AS_TEACHER:
          return { id: teacher.id, isLoggedIn: true, role: teacher.role };
        case LoginStatus.LOGGED_IN_AS_STUDENT:
          return { id: student.id, isLoggedIn: true, role: student.role };
        case LoginStatus.LOGGED_OUT:
          return { id: '', isLoggedIn: false, role: UserRole.STUDENT };
        default:
          throw new Error(`unhandled loging status: ${loginStatus}`);
      }
    };

    type TestCreateNotationInput = Replace<CreateNotationInput, 'thumbnail' | 'video', unknown>;

    const createNotation = (input: TestCreateNotationInput, loginStatus: LoginStatus) => {
      return resolve<Mutation, 'createNotation', { input: TestCreateNotationInput }>(
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

    it.each([LoginStatus.LOGGED_IN_AS_ADMIN, LoginStatus.LOGGED_IN_AS_TEACHER])(
      'creates a notation record when %s',
      async (loginStatus) => {
        const input = {
          songName: randStr(12),
          artistName: randStr(12),
          thumbnail: createRandUpload(),
          video: createRandUpload(),
          tagIds: [],
        };

        const { res } = await createNotation(input, loginStatus);

        expect(res.errors).toBeUndefined();
        expect(res.data.createNotation).toBeDefined();
        expect(res.data.createNotation).not.toBeNull();

        const id = res.data.createNotation!.id;

        const notation = await notationRepo.find(id);
        expect(notation).not.toBeNull();
        expect(notation!.songName).toBe(input.songName);
        expect(notation!.artistName).toBe(input.artistName);
      }
    );

    it.each([LoginStatus.LOGGED_IN_AS_STUDENT, LoginStatus.LOGGED_OUT])(
      'forbids notation creation when %s',
      async (loginStatus) => {
        const input = {
          songName: randStr(12),
          artistName: randStr(12),
          thumbnail: createRandUpload(),
          video: createRandUpload(),
          tagIds: [],
        };

        const { res } = await createNotation(input, loginStatus);

        expect(res.errors).toBeDefined();
      }
    );
  });

  describe('suggestedNotations', () => {
    let userRepo: UserRepo;
    let notationRepo: NotationRepo;

    let transcriber: User;

    let notation1: Notation;
    let notation2: Notation;
    let notation3: Notation;

    const suggestedNotations = (args: QuerySuggestedNotationsArgs) => {
      return resolve<Query, 'suggestedNotations', QuerySuggestedNotationsArgs>(
        gql`
          query suggestedNotations($id: String!, $limit: Int!) {
            suggestedNotations(id: $id, limit: $limit) {
              id
            }
          }
        `,
        args,
        {}
      );
    };

    beforeEach(async () => {
      userRepo = container.get<UserRepo>(TYPES.UserRepo);
      notationRepo = container.get<NotationRepo>(TYPES.NotationRepo);

      transcriber = await userRepo.create(buildRandUser());

      [notation1, notation2, notation3] = await notationRepo.bulkCreate([
        buildRandNotation({ cursor: 1, transcriberId: transcriber.id }),
        buildRandNotation({ cursor: 2, transcriberId: transcriber.id }),
        buildRandNotation({ cursor: 3, transcriberId: transcriber.id }),
      ]);
    });

    it('finds suggestions for notations', async () => {
      const { res } = await suggestedNotations({ id: notation1.id, limit: 2 });

      expect(res.errors).toBeUndefined();
      expect(res.data.suggestedNotations).toBeDefined();

      const ids = res.data.suggestedNotations.map((notation) => notation.id);

      expect(ids).toIncludeAllMembers([notation2.id, notation3.id]);
    });
  });
});
