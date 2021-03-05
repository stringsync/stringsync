import { Ctx, Field, ID, ObjectType, Root } from 'type-graphql';
import { Notation, Tag, User } from '../../domain';
import { NotFoundError } from '../../errors';
import { TYPES } from '../../inversify.constants';
import { TagService, UserService } from '../../services';
import { TagObject } from '../Tag';
import { ResolverCtx } from '../types';
import { UserObject } from '../User';

type PublicNotation = Omit<Notation, 'cursor'>;

@ObjectType()
export class NotationObject implements PublicNotation {
  @Field((type) => ID)
  id!: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;

  @Field((type) => String, { nullable: true })
  songName!: string;

  @Field((type) => String, { nullable: true })
  artistName!: string;

  @Field()
  deadTimeMs!: number;

  @Field()
  durationMs!: number;

  @Field()
  private!: boolean;

  @Field()
  transcriberId!: string;

  @Field((type) => String, { nullable: true })
  thumbnailUrl!: string | null;

  @Field((type) => String, { nullable: true })
  videoUrl!: string | null;

  @Field((type) => UserObject)
  async transcriber(@Root() notation: Notation, @Ctx() ctx: ResolverCtx): Promise<User> {
    const userService = ctx.getContainer().get<UserService>(TYPES.UserService);
    const user = await userService.find(notation.transcriberId);
    if (!user) {
      throw new NotFoundError('user not found');
    }
    return user;
  }

  @Field((type) => [TagObject])
  async tags(@Root() notation: Notation, @Ctx() ctx: ResolverCtx): Promise<Tag[]> {
    const tagService = ctx.getContainer().get<TagService>(TYPES.TagService);
    return await tagService.findAllByNotationId(notation.id);
  }
}
