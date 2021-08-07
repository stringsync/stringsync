import {
  Collection,
  Entity,
  IdentifiedReference,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryKey,
  Property,
  Reference,
} from '@mikro-orm/core';
import { IsNotEmpty, IsOptional, IsUrl, Matches, MaxLength, MinLength } from 'class-validator';
import { Notation } from '../../../domain';
import { BaseEntity } from './BaseEntity';
import { TagEntity } from './TagEntity';
import { TaggingEntity } from './TaggingEntity';
import { UserEntity } from './UserEntity';

@Entity({ tableName: 'notations' })
export class NotationEntity extends BaseEntity implements Notation {
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
    this.transcriber = Reference.create(new UserEntity({ id: transcriberId }));
  }

  @Property({ nullable: true })
  @IsOptional()
  @IsUrl()
  thumbnailUrl!: string | null;

  @Property({ nullable: true })
  @IsOptional()
  @IsUrl()
  videoUrl!: string | null;

  @ManyToOne(() => UserEntity, { wrappedReference: true })
  transcriber!: IdentifiedReference<UserEntity, 'id'>;

  @OneToMany(
    () => TaggingEntity,
    (tagging) => tagging.notation
  )
  taggings = new Collection<TaggingEntity>(this);

  @ManyToMany({ entity: () => TagEntity, inversedBy: 'notations' })
  tags = new Collection<TagEntity>(this);

  constructor(props: Partial<NotationEntity> = {}) {
    super();
    Object.assign(this, props);
  }
}
