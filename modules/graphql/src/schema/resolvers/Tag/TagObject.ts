import { NotationObject } from './../Notation/NotationObject';
import { Tag, Notation } from '@stringsync/domain';
import { ObjectType, Field, ID } from 'type-graphql';

@ObjectType()
export class TagObject implements Tag {
  @Field((type) => ID)
  id!: number;

  @Field()
  name!: string;

  @Field((type) => [NotationObject])
  notations!: Notation[];
}
