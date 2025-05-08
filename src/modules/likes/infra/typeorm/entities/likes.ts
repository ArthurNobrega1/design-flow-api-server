import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';

import Posts from '@modules/posts/infra/typeorm/entities/posts';
import Users from '@modules/users/infra/typeorm/entities/users';
import Comments from '@modules/comments/infra/typeorm/entities/comments';

@Entity('likes')
class Likes {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'uuid', nullable: true })
  post_id: string;

  @Column({ type: 'uuid', nullable: true })
  comment_id: string;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  //* ***************** *//
  // Relationship
  //* ***************** *//

  @ManyToOne(() => Users, users => users.likes, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @ManyToOne(() => Posts, posts => posts.likes, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'post_id' })
  post: Posts;

  @ManyToOne(() => Comments, comments => comments.likes, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'comment_id' })
  comment: Comments;
}

export default Likes;
