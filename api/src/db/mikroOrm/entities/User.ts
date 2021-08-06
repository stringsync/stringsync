import { Collection, Entity, Enum, OneToMany, PrimaryKey, Property, Unique } from '@mikro-orm/core';
import { IsEmail } from 'class-validator';
import { User as DomainUser, UserRole } from '../../../domain';
import { Notation } from './Notation';

@Entity({ tableName: 'users' })
export class User implements DomainUser {
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

  @Enum(() => UserRole)
  role = UserRole.STUDENT;

  @Property({ type: 'TIMESTAMP', nullable: true })
  confirmedAt: Date | null = null;

  @Property({ nullable: true })
  confirmationToken: string | null = null;

  @Property({ type: 'TIMESTAMP', nullable: true })
  resetPasswordTokenSentAt: Date | null = null;

  @Property({ nullable: true })
  resetPasswordToken: string | null = null;

  @Property({ nullable: true })
  avatarUrl: string | null = null;

  @OneToMany(
    () => Notation,
    (notation) => notation.transcriber
  )
  notations = new Collection<Notation>(this);

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

  constructor(user: Partial<User> = {}) {
    Object.assign(this, user);
  }
}
