import {
  Collection,
  Entity,
  IdentifiedReference,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
  Reference,
} from '@mikro-orm/core';
import { IsNotEmpty, Matches, MaxLength, MinLength } from 'class-validator';
import { Notation as DomainNotation } from '../../../domain';
import { Tagging } from './Tagging';
import { User } from './User';

@Entity({ tableName: 'notations' })
export class Notation implements DomainNotation {
  @PrimaryKey()
  id!: string;

  @Property({ nullable: true, defaultRaw: 'DEFAULT' })
  cursor!: number;

  @Property({ type: 'TIMESTAMP' })
  createdAt = new Date();

  @Property({ type: 'TIMESTAMP', onUpdate: () => new Date() })
  updatedAt!: Date;

  @Property()
  @Matches(/^[A-Za-z0-9!?\s()']*$/)
  @MinLength(1)
  @MaxLength(64)
  songName!: string;

  @Property()
  @Matches(/^[A-Za-z0-9!?\s()@']*$/)
  @MinLength(1)
  @MaxLength(64)
  artistName!: string;

  @Property()
  deadTimeMs = 0;

  @Property()
  durationMs = 0;

  @Property()
  private = true;

  @Property({ persist: false })
  @IsNotEmpty()
  get transcriberId(): string {
    return this.transcriber.id;
  }

  set transcriberId(transcriberId: string) {
    this.transcriber = Reference.create(new User({ id: transcriberId }));
  }

  @Property({ nullable: true })
  thumbnailUrl!: string | null;

  @Property({ nullable: true })
  videoUrl!: string | null;

  @ManyToOne(() => User, { wrappedReference: true })
  transcriber!: IdentifiedReference<User, 'id'>;

  @OneToMany(
    () => Tagging,
    (tagging) => tagging.notation
  )
  taggings = new Collection<Tagging>(this);

  constructor(props: Partial<Notation> = {}) {
    Object.assign(this, props);
  }
}
