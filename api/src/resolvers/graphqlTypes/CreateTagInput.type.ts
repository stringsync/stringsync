import { Field, InputType } from 'type-graphql';
import { TagCategory } from '../../domain';

@InputType()
export class CreateTagInput {
  @Field()
  name!: string;

  @Field((type) => TagCategory)
  category!: TagCategory;
}
