import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class HealthResult {
  @Field()
  isDbHealthy!: boolean;

  @Field()
  isCacheHealthy!: boolean;
}
