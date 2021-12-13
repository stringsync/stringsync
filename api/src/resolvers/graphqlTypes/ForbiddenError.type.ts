import { Field, ObjectType } from 'type-graphql';
import { MessageContainer } from './types';

@ObjectType()
export class ForbiddenError {
  static of(container: MessageContainer) {
    const forbiddenError = new ForbiddenError();
    forbiddenError.message = container.message;
    return forbiddenError;
  }

  @Field()
  message!: string;
}
