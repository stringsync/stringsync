import { Cascade, Entity, ManyToOne, PrimaryKey, Property } from '@mikro-orm/core';
import { Matches, MaxLength, MinLength } from 'class-validator';
import { Notation } from '../../../domain';
import { UserEntity } from './UserEntity';

@Entity()
export class NotationEntity implements Notation {
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

  @Property()
  transcriberId!: string;

  @Property({ nullable: true })
  thumbnailUrl!: string | null;

  @Property({ nullable: true })
  videoUrl!: string | null;

  @ManyToOne(() => UserEntity, { cascade: [Cascade.ALL] })
  transcriber!: UserEntity;
}
