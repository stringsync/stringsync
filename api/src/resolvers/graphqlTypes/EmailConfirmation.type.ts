import { Field, ObjectType } from 'type-graphql';

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
