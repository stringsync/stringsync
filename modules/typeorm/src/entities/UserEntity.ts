import { NotationEntity } from './NotationEntity';
import { Entity, Column, PrimaryGeneratedColumn, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { User, UserRole } from '@stringsync/domain';

interface Props extends Omit<User, 'notations'> {
  notations: NotationEntity[] | Promise<NotationEntity[]>;
}

@Entity({ name: 'users' })
export class UserEntity implements Props {
  @PrimaryGeneratedColumn()
  id!: number;

  @CreateDateColumn({ type: 'timestamp' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamp' })
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
  notations!: NotationEntity[] | Promise<NotationEntity[]>;
}
