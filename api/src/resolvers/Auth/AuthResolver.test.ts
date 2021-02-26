import { container } from '../../inversify.config';
import { TYPES } from '../../inversify.constants';
import { SessionUser } from '../../server';
import { EntityFactory, gql, Query, resolve } from '../../testing';
import { generateSchema } from '../generateSchema';

describe('AuthResolver', () => {
  const schema = generateSchema();
  let entityFactory: EntityFactory;

  beforeEach(() => {
    entityFactory = container.get<EntityFactory>(TYPES.EntityFactory);
  });

  describe('whoami', () => {
    it('returns null when logged out', async () => {
      const { res } = await resolve<Query, 'whoami'>(
        gql`
          query {
            whoami {
              id
            }
          }
        `,
        {}
      );

      expect(res.data.whoami).toBeNull();
    });

    it('returns the session user', async () => {
      const user = await entityFactory.createRandUser();

      const sessionUser: SessionUser = {
        id: user.id,
        isLoggedIn: true,
        role: user.role,
      };

      const { res } = await resolve<Query, 'whoami'>(
        gql`
          query {
            whoami {
              id
            }
          }
        `,
        {},
        { sessionUser }
      );

      expect(res.data).not.toBeNull();
      expect(res.data.whoami).not.toBeNull();
      expect(res.data!.whoami!.id).toBe(sessionUser.id);
    });
  });
});
