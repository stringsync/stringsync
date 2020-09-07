import { NotationModel } from './NotationModel';
import { useTestContainer, TYPES } from '@stringsync/container';
import { TestFactory } from '@stringsync/common';

const container = useTestContainer();

let notationModel: typeof NotationModel;

beforeEach(() => {
  notationModel = container.get<typeof NotationModel>(TYPES.NotationModel);
});

it('permits valid notations', async () => {
  const notation = notationModel.build(TestFactory.buildRandNotation());
  await expect(notation.validate()).resolves.not.toThrow();
});

it.each(['Above And Beyond (The Call Of Love)', `no i don't shave my thighs`, `You Can't Come with Me`])(
  'permits valid song names',
  async (songName) => {
    const notation = notationModel.build(TestFactory.buildRandNotation({ songName }));
    await expect(notation.validate()).resolves.not.toThrow();
  }
);

it.each(['; ATTEMPTED SQL INJECTION', '<script>ATTEMPTED XSS</script>'])(
  'disallows invalid song names',
  async (songName) => {
    const notation = notationModel.build(TestFactory.buildRandNotation({ songName }));
    await expect(notation.validate()).rejects.toThrow();
  }
);

it.each(['@jaredplaysguitar', 'tekashi69'])('permits valid artist names', async (artistName) => {
  const notation = notationModel.build(TestFactory.buildRandNotation({ artistName }));
  await expect(notation.validate()).resolves.not.toThrow();
});

it.each(['; ATTEMPTED SQL INJECTION', '<script>ATTEMPTED XSS</script>'])(
  'disallows invalid artist names',
  async (artistName) => {
    const notation = notationModel.build(TestFactory.buildRandNotation({ artistName }));
    await expect(notation.validate()).rejects.toThrow();
  }
);
