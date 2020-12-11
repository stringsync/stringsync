import { NotFoundError } from '@stringsync/common';
import { Notation, PublicNotation, Tag, User } from '@stringsync/domain';
import { SERVICES, TagService, UserService } from '@stringsync/services';
import { Ctx, Field, ID, ObjectType, Root } from 'type-graphql';
import { ReqCtx } from '../../../ctx';
import { TagObject } from '../Tag';
import { UserObject } from '../User';

const TYPES = { ...SERVICES.TYPES };

@ObjectType()
export class NotationObject implements PublicNotation {
  @Field((type) => ID)
  id!: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;

  @Field()
  songName!: string;

  @Field()
  artistName!: string;

  @Field()
  deadTimeMs!: number;

  @Field()
  durationMs!: number;

  @Field()
  featured!: boolean;

  @Field()
  transcriberId!: string;

  @Field((type) => String, { nullable: true })
  thumbnailUrl!: string | null;

  @Field((type) => String, { nullable: true })
  videoUrl!: string | null;

  @Field((type) => UserObject)
  async transcriber(@Root() notation: Notation, @Ctx() ctx: ReqCtx): Promise<User> {
    const userService = ctx.container.get<UserService>(TYPES.UserService);
    const user = await userService.find(notation.transcriberId);
    if (!user) {
      throw new NotFoundError('user not found');
    }
    return user;
  }

  @Field((type) => [TagObject])
  async tags(@Root() notation: Notation, @Ctx() ctx: ReqCtx): Promise<Tag[]> {
    const tagService = ctx.container.get<TagService>(TYPES.TagService);
    return await tagService.findAllByNotationId(notation.id);
  }
}
