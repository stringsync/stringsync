import { BeforeCreate, BeforeUpdate } from '@mikro-orm/core';
import { validate } from 'class-validator';
import { ValidationError } from '../../../errors';

export abstract class BaseEntity {
  @BeforeCreate()
  @BeforeUpdate()
  async validate() {
    const errors = await validate(this);
    if (errors.length > 0) {
      throw new ValidationError(errors);
    }
  }
}
