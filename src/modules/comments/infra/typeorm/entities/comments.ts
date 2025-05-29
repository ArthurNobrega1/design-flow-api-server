import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

import Users from '@modules/users/infra/typeorm/entities/users';
import Posts from '@modules/posts/infra/typeorm/entities/posts';
import Likes from '@modules/likes/infra/typeorm/entities/likes';

@Entity('comments')
class Comments {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  content: string;

  @Column({ type: 'uuid' })
  user_id: string;

  @Column({ type: 'uuid' })
  post_id: string;

  @Column({ type: 'uuid', nullable: true })
  parent_comment_id: string;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  //* ***************** *//
  // Relationship
  //* ***************** *//

  @ManyToOne(() => Users, users => users.comments, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @ManyToOne(() => Posts, posts => posts.comments, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'post_id' })
  post: Posts;

  @ManyToOne(() => Comments, comment => comment.replies, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'parent_comment_id' })
  // eslint-disable-next-line no-use-before-define
  parent_comment: Comments;

  @OneToMany(() => Comments, comment => comment.parent_comment)
  // eslint-disable-next-line no-use-before-define
  replies: Comments[];

  @OneToMany(() => Likes, likes => likes.comment)
  likes: Likes[];
}

export default Comments;
