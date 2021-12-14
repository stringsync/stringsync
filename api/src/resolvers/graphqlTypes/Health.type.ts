import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class Health {
  @Field()
  isDbHealthy!: boolean;

  @Field()
  isCacheHealthy!: boolean;
}
