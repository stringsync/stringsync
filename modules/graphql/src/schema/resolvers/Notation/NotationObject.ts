import { Tag } from './../../../../../domain/src/tag/types';
import { TagObject } from './../Tag/TagObject';
import { UserObject } from './../User';
import { Notation, User } from '@stringsync/domain';
import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType()
export class NotationObject implements Notation {
  @Field((type) => ID)
  id!: number;

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
  bpm!: number;

  @Field()
  featured!: boolean;

  @Field()
  transcriberId!: string;

  @Field((type) => UserObject)
  transcriber!: User;

  @Field((type) => TagObject)
  tags!: Tag[];
}
