import { Collection, Entity, Enum, OneToMany, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { IsEmail } from 'class-validator';
import { User as UserDomain, UserRole, USER_ROLES } from '../../../domain';
import { Notation } from './Notation';

@Entity({ tableName: 'users' })
export class User implements UserDomain {
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
  username!: string;

  @Property()
  encryptedPassword!: string;

  @Enum(() => USER_ROLES)
  role!: UserRole;

  @Property({ name: 'email' })
  @Unique()
  @IsEmail()
  _email!: string;

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

  @Property({ type: 'TIMESTAMP', nullable: true })
  confirmedAt!: Date | null;

  @Property({ nullable: true })
  confirmationToken!: string | null;

  @Property({ type: 'TIMESTAMP', nullable: true })
  resetPasswordTokenSentAt!: Date | null;

  @Property({ nullable: true })
  resetPasswordToken!: string | null;

  @Property({ nullable: true })
  avatarUrl!: string | null;

  @OneToMany(
    () => Notation,
    (notation) => notation.transcriber
  )
  notations = new Collection<Notation>(this);
}
