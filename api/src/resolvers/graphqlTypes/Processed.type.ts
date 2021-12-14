import { Field, ObjectType } from 'type-graphql';

/**
 * An object that represents an indeterminate result to protect attacked from inferring state from the database.
 */
@ObjectType()
export class Processed {
  static now() {
    return Processed.of(new Date());
  }

  static of(at: Date) {
    const processed = new Processed();
    processed.at = at;
    return processed;
  }

  @Field((type) => Date)
  at!: Date;
}
