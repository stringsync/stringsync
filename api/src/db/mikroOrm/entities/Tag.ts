import { Entity, PrimaryKey, Property } from '@mikro-orm/core';

@Entity()
export class Tag {
  @PrimaryKey()
  id!: string;

  @Property()
  name!: string;
}
