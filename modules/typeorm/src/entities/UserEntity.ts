import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';
import * as domain from '@stringsync/domain';
import { UserRole } from '@stringsync/domain';

@Entity({ name: 'users' })
export class UserEntity implements domain.User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  createdAt!: Date;

  @Column()
  updatedAt!: Date;

  @Column()
  username!: string;

  @Column()
  email!: string;

  @Column()
  encryptedPassword!: string;

  @Column({ type: 'text', default: UserRole.STUDENT })
  role!: domain.UserRole;

  @Column({ type: 'text', nullable: true })
  confirmationToken!: string | null;

  @Column({ type: 'text', nullable: true })
  confirmedAt!: Date | null;

  @Column({ type: 'text', nullable: true })
  resetPasswordToken!: string | null;

  @Column({ type: 'text', nullable: true })
  resetPasswordTokenSentAt!: Date | null;

  @Column({ type: 'text', nullable: true })
  avatarUrl!: string | null;
}
