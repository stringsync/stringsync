import { Collection, Entity, Enum, OneToMany, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { IsEmail, IsOptional, IsUrl, Matches, MaxLength, MinLength } from 'class-validator';
import { User, UserRole } from '../../../domain';
import { BaseEntity } from './BaseEntity';
import { NotationEntity } from './NotationEntity';

@Entity({ tableName: 'users' })
export class UserEntity extends BaseEntity implements User {
  associations = ['notations'];

  @PrimaryKey()
  id!: string;

  @Property({ nullable: true, defaultRaw: 'DEFAULT' })
  cursor!: number;

  @Property({ type: 'TIMESTAMP' })
  createdAt = new Date();

  @Property({ type: 'TIMESTAMP', onUpdate: () => new Date() })
  updatedAt!: Date;

  @Property()
  @Unique()
  @MinLength(3)
  @MaxLength(24)
  @Matches(/^[A-Za-z0-9-_.]*$/)
  username!: string;

  @Property()
  encryptedPassword!: string;

  @Enum(() => UserRole)
  role = UserRole.STUDENT;

  @Property({ type: 'TIMESTAMP', nullable: true })
  @IsOptional()
  confirmedAt: Date | null = null;

  @Property({ nullable: true })
  @IsOptional()
  confirmationToken: string | null = null;

  @Property({ type: 'TIMESTAMP', nullable: true })
  @IsOptional()
  resetPasswordTokenSentAt: Date | null = null;

  @Property({ nullable: true })
  @IsOptional()
  resetPasswordToken: string | null = null;

  @Property({ nullable: true })
  @IsOptional()
  @IsUrl()
  avatarUrl: string | null = null;

  @OneToMany(
    () => NotationEntity,
    (notation) => notation.transcriber
  )
  notations = new Collection<NotationEntity>(this);

  private _email!: string;

  @Property()
  @Unique()
  @IsEmail()
  get email(): string {
    return this._email;
  }

  set email(email: string) {
    if (email !== this._email) {
      this.resetPasswordToken = null;
      this.resetPasswordTokenSentAt = null;
      this.confirmedAt = null;
      this.confirmationToken = null;
    }
    this._email = email;
  }

  constructor(user: Partial<UserEntity> = {}) {
    super();
    Object.assign(this, user);
  }
}
