import { useTestDb, getFixtures } from '../../../testing';
import { getRawUserByEmailOrUsername } from './getRawUserByEmailOrUsername';

const STUDENT1 = getFixtures().User.student1;

it(
  'searches users by username',
  useTestDb({ User: [STUDENT1] }, async (db) => {
    const user = await getRawUserByEmailOrUsername(db, STUDENT1.username);
    expect(user).not.toBeNull();
    expect(user!.id).toBe(STUDENT1.id);
  })
);

it(
  'searches users by email',
  useTestDb({ User: [STUDENT1] }, async (db) => {
    const user = await getRawUserByEmailOrUsername(db, STUDENT1.email);
    expect(user).not.toBeNull();
    expect(user!.id).toBe(STUDENT1.id);
  })
);

it(
  'does not return users that do not match',
  useTestDb({}, async (db) => {
    const user = await getRawUserByEmailOrUsername(db, STUDENT1.email);
    expect(user).toBeNull();
  })
);
