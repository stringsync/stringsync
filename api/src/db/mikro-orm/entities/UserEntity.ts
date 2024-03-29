import { Collection, Entity, Enum, OneToMany, PrimaryKey, Property } from '@mikro-orm/core';
import { IsEmail, IsOptional, IsUrl, Matches, MaxLength, MinLength } from 'class-validator';
import { User, UserRole } from '../../../domain';
import { BaseEntity, BaseEntityOpts } from './BaseEntity';
import { NotationEntity } from './NotationEntity';

@Entity({ tableName: 'users' })
export class UserEntity extends BaseEntity implements User {
  @PrimaryKey()
  id!: string;

  @Property({ persist: false })
  cursor!: number;

  @Property({ type: 'TIMESTAMP' })
  createdAt = new Date();

  @Property({ type: 'TIMESTAMP', onUpdate: () => new Date() })
  updatedAt!: Date;

  @Property()
  @MinLength(3)
  @MaxLength(24)
  @Matches(/^[A-Za-z0-9-_.]*$/)
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

  @Property({ nullable: true, fieldName: 'reset_password_token' })
  resetPasswordToken: string | null = null;

  @Property({ nullable: true })
  @IsOptional()
  @IsUrl()
  avatarUrl: string | null = null;

  @OneToMany(
    () => NotationEntity,
    (notation) => notation.transcriber,
    { hidden: true }
  )
  notations = new Collection<NotationEntity>(this);

  private _email!: string;

  @Property()
  @IsEmail()
  get email(): string {
    return this._email;
  }

  set email(email: string) {
    if (this._email && email !== this._email) {
      this.resetPasswordToken = null;
      this.resetPasswordTokenSentAt = null;
      this.confirmedAt = null;
      this.confirmationToken = null;
    }
    this._email = email;
  }

  constructor(attrs: Partial<UserEntity> = {}, opts: BaseEntityOpts = {}) {
    super(opts);
    Object.assign(this, attrs);
  }

  async errors(): Promise<string[]> {
    const errors = await Promise.all([
      super.errors(),
      this.getUsernameUniquenessErrors(),
      this.getEmailUniquenessErrors(),
    ]);
    return errors.flat();
  }

  private async getUsernameUniquenessErrors(): Promise<string[]> {
    const user = await this.em!.findOne(UserEntity, { username: this.username });
    return user && user.id !== this.id ? ['username is already taken'] : [];
  }

  private async getEmailUniquenessErrors(): Promise<string[]> {
    const user = await this.em!.findOne(UserEntity, { email: this.email });
    return user && user.id !== this.id ? ['email is already taken'] : [];
  }
}
