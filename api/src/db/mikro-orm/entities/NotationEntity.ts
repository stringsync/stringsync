import { Collection, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { IsNotEmpty, IsOptional, IsUrl, Matches, MaxLength, MinLength } from 'class-validator';
import { Notation } from '../../../domain';
import { HACK_2099_createReference } from '../hacks';
import { BaseEntity } from './BaseEntity';
import { TagEntity } from './TagEntity';
import { TaggingEntity } from './TaggingEntity';
import { UserEntity } from './UserEntity';

@Entity({ tableName: 'notations' })
export class NotationEntity extends BaseEntity implements Notation {
  @PrimaryKey()
  id!: string;

  @Property({ persist: false })
  cursor!: number;

  @Property({ defaultRaw: 'NOW()' })
  createdAt = new Date();

  @Property({ defaultRaw: 'NOW()', onUpdate: () => new Date() })
  updatedAt = new Date();

  @Property()
  @Matches(/^[-A-Za-z0-9!?\s.()@&/']*$/)
  @MinLength(1)
  @MaxLength(64)
  songName!: string;

  @Property()
  @Matches(/^[-A-Za-z0-9!?\s.()@&/']*$/)
  @MinLength(1)
  @MaxLength(64)
  artistName!: string;

  @Property()
  deadTimeMs = 0;

  @Property()
  durationMs = 0;

  @Property()
  private = true;

  @ManyToOne(() => UserEntity, { wrappedReference: true, hidden: true })
  transcriber = HACK_2099_createReference(new UserEntity());

  @Property({ persist: false })
  @IsNotEmpty()
  get transcriberId(): string {
    return this.transcriber.id;
  }

  set transcriberId(transcriberId: string) {
    this.transcriber.set(HACK_2099_createReference(new UserEntity({ id: transcriberId })));
  }

  @Property({ nullable: true })
  @IsOptional()
  @IsUrl()
  thumbnailUrl!: string | null;

  @Property({ nullable: true })
  @IsOptional()
  @IsUrl()
  videoUrl!: string | null;

  @Property({ nullable: true })
  @IsOptional()
  @IsUrl()
  musicXmlUrl!: string | null;

  @OneToMany(
    () => TaggingEntity,
    (tagging) => tagging.notation,
    { hidden: true }
  )
  taggings = new Collection<TaggingEntity>(this);

  @ManyToMany({
    entity: () => TagEntity,
    inversedBy: 'notations',
    joinColumn: 'notation_id',
    inverseJoinColumn: 'tag_id',
    pivotTable: 'taggings',
    hidden: true,
  })
  tags = new Collection<TagEntity>(this);

  constructor(props: Partial<NotationEntity> = {}) {
    super();
    Object.assign(this, props);
  }
}
