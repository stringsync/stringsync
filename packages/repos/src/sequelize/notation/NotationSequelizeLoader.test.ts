// import { EntityBuilder, randStr } from '@stringsync/common';
// import { TYPES, useTestContainer } from '@stringsync/di';
// import { Notation, User } from '@stringsync/domain';
// import { isPlainObject, sortBy } from 'lodash';
// import { UserSequelizeRepo } from '../user';
// import { NotationSequelizeLoader, NotationSequelizeRepo } from './';

// const container = useTestContainer();

// let notationLoader: NotationSequelizeLoader;

// let transcriber1: User;
// let transcriber2: User;
// let notation1: Notation;
// let notation2: Notation;
// let notation3: Notation;

// beforeEach(async () => {
//   notationLoader = container.get<NotationSequelizeLoader>(TYPES.NotationSequelizeLoader);

//   const userRepo = container.get<UserSequelizeRepo>(TYPES.UserSequelizeRepo);
//   const notationRepo = container.get<NotationSequelizeRepo>(TYPES.NotationSequelizeRepo);

//   [transcriber1, transcriber2] = await userRepo.bulkCreate([
//     EntityBuilder.buildRandUser(),
//     EntityBuilder.buildRandUser(),
//   ]);
//   [notation1, notation2, notation3] = await notationRepo.bulkCreate([
//     EntityBuilder.buildRandNotation({ transcriberId: transcriber1.id }),
//     EntityBuilder.buildRandNotation({ transcriberId: transcriber1.id }),
//     EntityBuilder.buildRandNotation({ transcriberId: transcriber2.id }),
//   ]);
// });

// describe('findById', () => {
//   it('finds a notation by id', async () => {
//     const notation = await notationLoader.findById(notation1.id);
//     expect(notation).not.toBeNull();
//     expect(notation!.id).toBe(notation1.id);
//   });

//   it('returns null for missing notations', async () => {
//     const notation = await notationLoader.findById(randStr(10));
//     expect(notation).toBeNull();
//   });

//   it('returns a plain object', async () => {
//     const notation = await notationLoader.findById(notation1.id);
//     expect(isPlainObject(notation)).toBe(true);
//   });
// });

// describe('findByTranscriberId', () => {
//   it('finds a notation by transcriberId', async () => {
//     const notations = await notationLoader.findAllByTranscriberId(transcriber1.id);
//     expect(notations).toHaveLength(2);
//     expect(sortBy(notations, 'id')).toStrictEqual(sortBy([notation1, notation2], 'id'));
//   });

//   it('returns an empty array for a missing transcriber', async () => {
//     const notations = await notationLoader.findAllByTranscriberId(randStr(10));
//     expect(notations).toStrictEqual([]);
//   });

//   it('returns plain objects', async () => {
//     const notations = await notationLoader.findAllByTranscriberId(transcriber1.id);
//     expect(notations).toHaveLength(2);
//     expect(notations.every(isPlainObject)).toBe(true);
//   });
// });
