import { Ctx, Field, ID, ObjectType, Root } from 'type-graphql';
import * as domain from '../../domain';
import { TYPES } from '../../inversify.constants';
import { TagService, UserService } from '../../services';
import { TagObject } from '../Tag';
import { ResolverCtx } from '../types';
import { User } from './User.type';

type PublicNotationFields = Omit<domain.Notation, 'cursor'>;

@ObjectType()
export class Notation implements PublicNotationFields {
  @Field((type) => ID)
  id!: string;

  @Field()
  createdAt!: Date;

  @Field()
  updatedAt!: Date;

  @Field((type) => String)
  songName!: string;

  @Field((type) => String)
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

  @Field((type) => String, { nullable: true })
  musicXmlUrl!: string | null;

  @Field((type) => User, { nullable: true })
  async transcriber(@Root() notation: domain.Notation, @Ctx() ctx: ResolverCtx): Promise<domain.User | null> {
    const userService = ctx.getContainer().get<UserService>(TYPES.UserService);
    return await userService.find(notation.transcriberId);
  }

  @Field((type) => [TagObject])
  async tags(@Ctx() ctx: ResolverCtx): Promise<domain.Tag[]> {
    const tagService = ctx.getContainer().get<TagService>(TYPES.TagService);
    return await tagService.findAllByNotationId(this.id);
  }
}
