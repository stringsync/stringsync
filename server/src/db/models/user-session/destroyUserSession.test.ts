import { destroyUserSession } from './destroyUserSession';
import {
  getTestDbProvider,
  getUserFixtures,
  getUserSessionFixtures,
} from '../../../testing';

const USER = getUserFixtures().student1;
const USER_SESSION = getUserSessionFixtures().student1Session;

const provideTestDb = getTestDbProvider();

it(
  'destroys a user session matching the token',
  provideTestDb({ User: [USER], UserSession: [USER_SESSION] }, async (db) => {
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
