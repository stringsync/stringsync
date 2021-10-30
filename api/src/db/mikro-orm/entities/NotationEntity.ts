import { Collection, Entity, ManyToMany, ManyToOne, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { IsNotEmpty, IsOptional, IsUrl, Matches, MaxLength, MinLength } from 'class-validator';
import { BaseEntityOpts } from '.';
import { Notation } from '../../../domain';
import { HACK_2099_createReference } from '../hacks';
import { BaseEntity } from './BaseEntity';
import { NotationTagEntity } from './NotationTagEntity';
import { TagEntity } from './TagEntity';
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
  @Matches(/^[-_A-Za-z0-9!?\s.()@&/']*$/)
  @MinLength(1)
  @MaxLength(64)
  songName!: string;

  @Property()
  @Matches(/^[-_A-Za-z0-9!?\s.()@&/']*$/)
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
    if (transcriberId === this.transcriberId) {
      return;
    }
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
    () => NotationTagEntity,
    (notationTag) => notationTag.notation,
    { hidden: true }
  )
  notationTags = new Collection<NotationTagEntity>(this);

  @ManyToMany({
    entity: () => TagEntity,
    inversedBy: 'notations',
    joinColumn: 'notation_id',
    inverseJoinColumn: 'tag_id',
    pivotTable: 'notation_tags',
    hidden: true,
  })
  tags = new Collection<TagEntity>(this);

  constructor(attrs: Partial<NotationEntity> = {}, opts: BaseEntityOpts = {}) {
    super(opts);
    Object.assign(this, attrs);
  }
}
