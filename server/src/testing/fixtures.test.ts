import { createUser } from './fixtures';
import { Provider } from './Provider';
import { randStr } from './rand';

describe('createUser', () => {
  it('creates a user in the db', () => {
    const id = randStr(10);
    Provider.run({}, async (p) => {
      const db = p.gctx.db;
      await createUser(db, { id });
      const user = await db.User.findByPk(id);
      expect(user).not.toBeNull();
    });
  });
});
