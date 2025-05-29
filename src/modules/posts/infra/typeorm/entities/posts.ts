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
import Files from '@modules/files/infra/typeorm/entities/files';
import Comments from '@modules/comments/infra/typeorm/entities/comments';
import Likes from '@modules/likes/infra/typeorm/entities/likes';

@Entity('posts')
class Posts {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar' })
  title: string;

  @Column({ type: 'uuid', nullable: true })
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

  @ManyToOne(() => Users, users => users.posts, {
    onDelete: 'SET NULL',
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' })
  user: Users;

  @OneToMany(() => Files, files => files.post)
  files: Files[];

  @OneToMany(() => Comments, comments => comments.post)
  comments: Comments[];

  @OneToMany(() => Likes, likes => likes.post)
  likes: Likes[];
}

export default Posts;
