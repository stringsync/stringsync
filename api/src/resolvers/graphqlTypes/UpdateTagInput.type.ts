import { Field, InputType } from 'type-graphql';
import { TagCategory } from '../../domain';

@InputType()
export class UpdateTagInput {
  @Field()
  id!: string;

  @Field((type) => String, { nullable: true })
  name?: string;

  @Field((type) => TagCategory, { nullable: true })
  category?: TagCategory;
}
