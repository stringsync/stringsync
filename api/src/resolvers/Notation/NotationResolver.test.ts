import { Notation, User, UserRole } from '../../domain';
import { container } from '../../inversify.config';
import { TYPES } from '../../inversify.constants';
import { EntityFactory, gql, Query, QueryNotationsArgs, resolve } from '../../testing';

describe('NotationResolver', () => {
  let entityFactory: EntityFactory;

  let notations: Notation[];

  let student: User;
  let teacher: User;
  let admin: User;

  beforeEach(async () => {
    entityFactory = container.get<EntityFactory>(TYPES.EntityFactory);

    notations = await Promise.all([
      entityFactory.createRandNotation({ cursor: 1 }),
      entityFactory.createRandNotation({ cursor: 2 }),
      entityFactory.createRandNotation({ cursor: 3 }),
    ]);

    [student, teacher, admin] = await Promise.all([
      entityFactory.createRandUser({ role: UserRole.STUDENT }),
      entityFactory.createRandUser({ role: UserRole.TEACHER }),
      entityFactory.createRandUser({ role: UserRole.ADMIN }),
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

    it('returns the first n notations', async () => {
      const { res } = await queryNotations({});

      expect(res.errors).toBeUndefined();

      const { edges } = res.data.notations;
      const notationIds = edges.map((edge) => edge.node.id);
      expect(notationIds).toIncludeSameMembers(notations.map((notation) => notation.id));
    });
  });
});
