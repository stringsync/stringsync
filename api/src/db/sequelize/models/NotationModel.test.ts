import { Notation, User } from '../../../domain';
import { EntityBuilder } from '../../../testing';
import { NotationModel } from './NotationModel';
import { UserModel } from './UserModel';

describe('NotationModel', () => {
  let transcriber: User;
  let notation: Notation;

  beforeEach(async () => {
    transcriber = await UserModel.create(EntityBuilder.buildRandUser());
    notation = await NotationModel.create(EntityBuilder.buildRandNotation({ transcriberId: transcriber.id }));
  });

  it('permits valid notations', async () => {
    const notation = NotationModel.build(EntityBuilder.buildRandNotation());
    await expect(notation.validate()).resolves.not.toThrow();
  });

  it.each(['Above And Beyond (The Call Of Love)', `no i don't shave my thighs`, `You Can't Come with Me`])(
    'permits valid song names',
    async (songName) => {
      const notation = NotationModel.build(EntityBuilder.buildRandNotation({ songName }));
      await expect(notation.validate()).resolves.not.toThrow();
    }
  );

  it.each(['; ATTEMPTED SQL INJECTION', '<script>ATTEMPTED XSS</script>'])(
    'disallows invalid song names',
    async (songName) => {
      const notation = NotationModel.build(EntityBuilder.buildRandNotation({ songName }));
      await expect(notation.validate()).rejects.toThrow();
    }
  );

  it.each(['@jaredplaysguitar', 'tekashi69'])('permits valid artist names', async (artistName) => {
    const notation = NotationModel.build(EntityBuilder.buildRandNotation({ artistName }));
    await expect(notation.validate()).resolves.not.toThrow();
  });

  it.each(['; ATTEMPTED SQL INJECTION', '<script>ATTEMPTED XSS</script>'])(
    'disallows invalid artist names',
    async (artistName) => {
      const notation = NotationModel.build(EntityBuilder.buildRandNotation({ artistName }));
      await expect(notation.validate()).rejects.toThrow();
    }
  );

  it('fetches the transcriber association', async () => {
    const notationEntity = await NotationModel.findByPk(notation.id, { include: 'transcriber' });
    expect(notationEntity).not.toBeNull();
    expect(notationEntity!.transcriber).not.toBeNull();
    expect(notationEntity!.transcriber!.id).toBe(transcriber.id);
  });
});
