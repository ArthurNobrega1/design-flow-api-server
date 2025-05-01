import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  Generated,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import Users from './users';

@Entity('user_tokens')
class UserTokens {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  @Generated('uuid')
  token: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  //* ***************** *//
  // Relationship
  //* ***************** *//

  @ManyToOne(() => Users, users => users.user_tokens, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: Users;
}

export default UserTokens;
