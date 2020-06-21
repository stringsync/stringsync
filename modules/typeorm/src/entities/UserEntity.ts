import { NotationEntity } from './NotationEntity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { User, UserRole, Notation } from '@stringsync/domain';

@Entity({ name: 'users' })
export class UserEntity implements User {
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
  role!: UserRole;

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

  @OneToMany(
    (type) => NotationEntity,
    (notation) => notation.transcriber
  )
  notations!: Promise<Notation[]>;
}
