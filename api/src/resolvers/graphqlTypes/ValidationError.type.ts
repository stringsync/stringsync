import { Field, ObjectType } from 'type-graphql';

type DetailsContainer = {
  details: string[];
};

@ObjectType()
export class ValidationError {
  static of(container: DetailsContainer) {
    const validationError = new ValidationError();
    validationError.details = container.details;
    return validationError;
  }

  @Field((type) => [String])
  details!: string[];
}
