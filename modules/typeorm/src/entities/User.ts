import { Entity, Column, PrimaryColumn } from 'typeorm';
import * as domain from '@stringsync/domain';

@Entity()
export class User implements domain.User {
  @PrimaryColumn()
  id!: string;

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

  @Column()
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
