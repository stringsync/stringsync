import { destroyUserSession } from './destroyUserSession';
import { useTestDb, getFixtures } from '../../../testing';

const FIXTURES = getFixtures();
const USER = FIXTURES.User.student1;
const USER_SESSION = FIXTURES.UserSession.student1Session;

it(
  'destroys a user session matching the token',
  useTestDb({ User: [USER], UserSession: [USER_SESSION] }, async (db) => {
    const { UserSession } = db.models;
    let userSession = await UserSession.findOne({
      where: { token: USER_SESSION.token },
    });
    expect(userSession).not.toBeNull();

    await destroyUserSession(db, USER_SESSION.token);

    userSession = await UserSession.findOne({
      where: { token: USER_SESSION.token },
    });
    expect(userSession).toBeNull();

    const count = await UserSession.count();
    expect(count).toBe(0);
  })
);
