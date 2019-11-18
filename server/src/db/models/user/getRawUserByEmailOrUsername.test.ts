import { getTestDbProvider, getFixtures } from '../../../testing';
import { getRawUserByEmailOrUsername } from './getRawUserByEmailOrUsername';

const STUDENT1 = getFixtures().User.student1;

const provideTestDb = getTestDbProvider();

it(
  'searches users by username',
  provideTestDb({ User: [STUDENT1] }, async (db) => {
    const user = await getRawUserByEmailOrUsername(db, STUDENT1.username);
    expect(user).not.toBeNull();
    expect(user!.id).toBe(STUDENT1.id);
  })
);

it(
  'searches users by email',
  provideTestDb({ User: [STUDENT1] }, async (db) => {
    const user = await getRawUserByEmailOrUsername(db, STUDENT1.email);
    expect(user).not.toBeNull();
    expect(user!.id).toBe(STUDENT1.id);
  })
);

it(
  'does not return users that do not match',
  provideTestDb({}, async (db) => {
    const user = await getRawUserByEmailOrUsername(db, STUDENT1.email);
    expect(user).toBeNull();
  })
);
