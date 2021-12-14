import { Field, ObjectType } from 'type-graphql';

type MessageContainer = {
  message: string;
};

@ObjectType()
export class BadRequestError {
  static of(container: MessageContainer) {
    const badRequestError = new BadRequestError();
    badRequestError.message = container.message;
    return badRequestError;
  }

  @Field()
  message!: string;
}
