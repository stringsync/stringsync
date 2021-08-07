import { BeforeCreate, BeforeUpdate } from '@mikro-orm/core';
import { validate } from 'class-validator';
import { ValidationError } from '../../../errors';

export abstract class BaseEntity {
  @BeforeCreate()
  @BeforeUpdate()
  async validate() {
    const errors = await validate(this, {
      validationError: {
        target: false,
        value: false,
      },
    });

    if (errors.length > 0) {
      const details = errors.flatMap((error) => Object.values(error.constraints || []));
      throw new ValidationError(details);
    }
  }
}
