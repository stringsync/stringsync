// import { EntityBuilder, randStr } from '@stringsync/common';
// import { TYPES, useTestContainer } from '@stringsync/di';
// import { User } from '@stringsync/domain';
// import { isPlainObject } from 'lodash';
// import { UserSequelizeLoader } from './UserSequelizeLoader';
// import { UserSequelizeRepo } from './UserSequelizeRepo';

// const container = useTestContainer();

// let userLoader: UserSequelizeLoader;
// let userRepo: UserSequelizeRepo;

// let user1: User;
// let user2: User;

// beforeEach(async () => {
//   userLoader = container.get<UserSequelizeLoader>(TYPES.UserSequelizeLoader);
//   userRepo = container.get<UserSequelizeRepo>(TYPES.UserSequelizeRepo);
//   [user1, user2] = await userRepo.bulkCreate([EntityBuilder.buildRandUser(), EntityBuilder.buildRandUser()]);
// });

// describe('findById', () => {
//   it('finds a user by id', async () => {
//     const user = await userLoader.findById(user1.id);
//     expect(user).not.toBeNull();
//     expect(user!.id).toBe(user1.id);
//   });

//   it('returns null for a user that does not exist', async () => {
//     const user = await userLoader.findById(randStr(10));
//     expect(user).toBeNull();
//   });

//   it('returns a plain object', async () => {
//     const user = await userLoader.findById(user1.id);
//     expect(isPlainObject(user)).toBe(true);
//   });
// });