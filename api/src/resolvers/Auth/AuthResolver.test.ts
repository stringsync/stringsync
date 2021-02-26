import { gql, Query, resolve } from '../../testing';
import { generateSchema } from '../generateSchema';

describe('AuthResolver', () => {
  const schema = generateSchema();

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
  });
});
