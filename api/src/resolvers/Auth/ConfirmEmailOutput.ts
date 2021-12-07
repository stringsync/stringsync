import { createUnionType, Field, ObjectType } from 'type-graphql';
import { BadRequestError, ForbiddenError, NotFoundError } from '../types';

@ObjectType()
export class EmailConfirmation {
  static of(confirmedAt: Date) {
    const emailConfirmation = new EmailConfirmation();
    emailConfirmation.confirmedAt = confirmedAt;
    return emailConfirmation;
  }

  @Field((type) => Date)
  confirmedAt!: Date;
}

export const ConfirmEmailOutput = createUnionType({
  name: 'ConfirmEmailOutput',
  types: () => [EmailConfirmation, NotFoundError, BadRequestError, ForbiddenError] as const,
});
