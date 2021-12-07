import { Field, ObjectType } from 'type-graphql';

@ObjectType()
export class HealthOutput {
  @Field()
  isDbHealthy!: boolean;

  @Field()
  isCacheHealthy!: boolean;
}
