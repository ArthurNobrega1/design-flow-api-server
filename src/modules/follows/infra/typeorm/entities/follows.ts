import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import Users from '@modules/users/infra/typeorm/entities/users';

@Entity('follows')
class Follows {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  follower_id: string;

  @Column({ type: 'uuid' })
  following_id: string;

  @Column({ type: 'boolean', default: false })
  is_accepted: boolean;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  //* ***************** *//
  // Relationship
  //* ***************** *//

  @ManyToOne(() => Users, users => users.follower_users, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'follower_id' })
  follower: Users;

  @ManyToOne(() => Users, users => users.following_users, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'following_id' })
  following: Users;
}

export default Follows;
