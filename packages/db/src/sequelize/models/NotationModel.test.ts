// import { NotationModel } from './NotationModel';
// import { useTestContainer, TYPES } from '@stringsync/di';
// import { EntityBuilder } from '@stringsync/common';
// import { Notation, User } from '@stringsync/domain';
// import { NotationRepo, UserRepo } from '@stringsync/repos';

// const container = useTestContainer();

// let userRepo: UserRepo;
// let notationRepo: NotationRepo;

// let transcriber: User;
// let notation: Notation;

// beforeEach(async () => {
//   userRepo = container.get<UserRepo>(TYPES.UserRepo);
//   notationRepo = container.get<NotationRepo>(TYPES.NotationRepo);

//   transcriber = await userRepo.create(EntityBuilder.buildRandUser());
//   notation = await notationRepo.create(EntityBuilder.buildRandNotation({ transcriberId: transcriber.id }));
// });

// it('permits valid notations', async () => {
//   const notation = NotationModel.build(EntityBuilder.buildRandNotation());
//   await expect(notation.validate()).resolves.not.toThrow();
// });

// it.each(['Above And Beyond (The Call Of Love)', `no i don't shave my thighs`, `You Can't Come with Me`])(
//   'permits valid song names',
//   async (songName) => {
//     const notation = NotationModel.build(EntityBuilder.buildRandNotation({ songName }));
//     await expect(notation.validate()).resolves.not.toThrow();
//   }
// );

// it.each(['; ATTEMPTED SQL INJECTION', '<script>ATTEMPTED XSS</script>'])(
//   'disallows invalid song names',
//   async (songName) => {
//     const notation = NotationModel.build(EntityBuilder.buildRandNotation({ songName }));
//     await expect(notation.validate()).rejects.toThrow();
//   }
// );

// it.each(['@jaredplaysguitar', 'tekashi69'])('permits valid artist names', async (artistName) => {
//   const notation = NotationModel.build(EntityBuilder.buildRandNotation({ artistName }));
//   await expect(notation.validate()).resolves.not.toThrow();
// });

// it.each(['; ATTEMPTED SQL INJECTION', '<script>ATTEMPTED XSS</script>'])(
//   'disallows invalid artist names',
//   async (artistName) => {
//     const notation = NotationModel.build(EntityBuilder.buildRandNotation({ artistName }));
//     await expect(notation.validate()).rejects.toThrow();
//   }
// );

// it('fetches the transcriber association', async () => {
//   const notationDao = await NotationModel.findByPk(notation.id, { include: 'transcriber' });
//   expect(notationDao).not.toBeNull();
//   expect(notationDao!.transcriber).not.toBeNull();
//   expect(notationDao!.transcriber!.id).toBe(transcriber.id);
// });
