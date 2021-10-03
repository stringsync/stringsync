import { BeforeCreate, BeforeUpdate, EntityManager } from '@mikro-orm/core';
import { validate } from 'class-validator';
import { ValidationError } from '../../../errors';

export abstract class BaseEntity {
  em?: EntityManager;

  async isValid(): Promise<boolean> {
    const errors = await this.errors();
    return errors.length === 0;
  }

  async errors(): Promise<string[]> {
    const errors = await validate(this);
    return errors.flatMap((error) => (error.constraints ? Object.values(error.constraints) : []));
  }

  @BeforeCreate()
  @BeforeUpdate()
  async validate() {
    const details = await this.errors();
    if (details.length > 0) {
      throw new ValidationError(details);
    }
  }
}
