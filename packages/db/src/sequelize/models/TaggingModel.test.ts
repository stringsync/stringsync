import { useTestContainer } from '@stringsync/di';
import { EntityBuilder, Notation, Tag, Tagging, User } from '@stringsync/domain';
import { DB } from '../../DB';
import { NotationModel } from './NotationModel';
import { TaggingModel } from './TaggingModel';
import { TagModel } from './TagModel';
import { UserModel } from './UserModel';

describe('TaggingModel', () => {
  useTestContainer(DB);

  let tag: Tag;
  let user: User;
  let notation: Notation;
  let tagging: Tagging;

  beforeEach(async () => {
    [tag, user] = await Promise.all([
      TagModel.create(EntityBuilder.buildRandTag()),
      UserModel.create(EntityBuilder.buildRandUser()),
    ]);
    notation = await NotationModel.create(EntityBuilder.buildRandNotation({ transcriberId: user.id }));
    tagging = await TaggingModel.create(EntityBuilder.buildRandTagging({ notationId: notation.id, tagId: tag.id }));
  });

  it('permits valid taggings', async () => {
    const tagging = TaggingModel.build(EntityBuilder.buildRandTagging());
    await expect(tagging.validate()).resolves.not.toThrow();
  });

  it('fetches the tag association', async () => {
    const taggingDao = await TaggingModel.findByPk(tagging.id, { include: 'tag' });
    expect(taggingDao).not.toBeNull();
    expect(taggingDao!.tag).toBeDefined();
  });

  it('fetches the notation association', async () => {
    const taggingDao = await TaggingModel.findByPk(tagging.id, {
      include: [{ model: NotationModel as any, as: 'notation', required: true }],
    });
    expect(taggingDao).not.toBeNull();
    expect(taggingDao!.notation).toBeDefined();
  });

  it('does not fetch random associations', async () => {
    await expect(TaggingModel.findByPk(tagging.id, { include: 'fakeAssociation' })).rejects.toThrow();
  });

  it('prevents taggings with the same (notationId, tagId)', async () => {
    const taggingDao = await TaggingModel.findOne({
      where: { notationId: notation.id, tagId: tag.id },
    });
    expect(taggingDao).not.toBeNull();

    await expect(TaggingModel.create({ notationId: notation.id, tagId: tag.id })).rejects.toThrow();
  });
});
