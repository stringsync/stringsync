import { Ctx, Field, ID, ObjectType } from 'type-graphql';
import * as domain from '../../domain';
import { InternalError } from '../../errors';
import { TYPES } from '../../inversify.constants';
import { TagService, UserService } from '../../services';
import { ResolverCtx } from '../types';
import { Tag } from './Tag.type';
import { User } from './User.type';

type PublicNotationFields = Omit<domain.Notation, 'cursor'>;

@ObjectType()
export class Notation implements PublicNotationFields {
  static of(attrs: domain.Notation) {
    const notation = new Notation();
    notation.id = attrs.id;
    notation.createdAt = attrs.createdAt;
    notation.updatedAt = attrs.updatedAt;
    notation.songName = attrs.songName;
    notation.artistName = attrs.artistName;
    notation.deadTimeMs = attrs.deadTimeMs;
    notation.durationMs = attrs.durationMs;
    notation.private = attrs.private;
    notation.transcriberId = attrs.transcriberId;
    notation.thumbnailUrl = attrs.thumbnailUrl;
    notation.videoUrl = attrs.videoUrl;
    notation.musicXmlUrl = attrs.musicXmlUrl;
    return notation;
  }

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

  @Field((type) => User)
  async transcriber(@Ctx() ctx: ResolverCtx): Promise<domain.User> {
    const userService = ctx.getContainer().get<UserService>(TYPES.UserService);
    const user = await userService.find(this.transcriberId);
    if (!user) {
      // Technically this should never happen since there's a cascade on delete for
      // notations.transcriber_id. We do this to keep the compiler happy and to be
      // a little resilient against database schema changes.
      throw new InternalError(
        `unexpected missing foreign key relationship on notations table: transcriberId=${this.transcriberId}`
      );
    }
    return user;
  }

  @Field((type) => [Tag])
  async tags(@Ctx() ctx: ResolverCtx): Promise<domain.Tag[]> {
    const tagService = ctx.getContainer().get<TagService>(TYPES.TagService);
    return await tagService.findAllByNotationId(this.id);
  }
}
