import { Field, ObjectType } from 'type-graphql';

type MessageContainer = {
  message: string;
};

@ObjectType()
export class NotFoundError {
  static of(container: MessageContainer) {
    const notFoundError = new NotFoundError();
    notFoundError.message = container.message;
    return notFoundError;
  }

  @Field()
  message!: string;
}
