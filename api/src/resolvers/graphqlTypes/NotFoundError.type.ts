import { Field, ObjectType } from 'type-graphql';
import { MessageContainer } from './types';

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
