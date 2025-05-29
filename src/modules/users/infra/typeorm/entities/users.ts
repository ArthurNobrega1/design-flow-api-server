import {
  Entity,
  PrimaryGeneratedColumn,
  CreateDateColumn,
  UpdateDateColumn,
  Column,
  OneToOne,
  OneToMany,
} from 'typeorm';
import Files from '@modules/files/infra/typeorm/entities/files';
import Posts from '@modules/posts/infra/typeorm/entities/posts';
import Comments from '@modules/comments/infra/typeorm/entities/comments';
import Follows from '@modules/follows/infra/typeorm/entities/follows';
import Likes from '@modules/likes/infra/typeorm/entities/likes';
import UserTokens from './userTokens';

@Entity('users')
class Users {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', nullable: true })
  bio: string;

  @Column({ type: 'timestamp', nullable: true })
  birthday: Date;

  @Column({ type: 'varchar', unique: true })
  email: string;

  @Column({ type: 'varchar', unique: true })
  username: string;

  @Column({ type: 'varchar' })
  fullname: string;

  @Column({ type: 'varchar', select: false })
  password: string;

  @Column({ type: 'varchar', default: 'default' })
  permission: string;

  @Column({ type: 'boolean', default: false })
  is_private: boolean;

  @Column({ type: 'boolean', default: true })
  active: boolean;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  //* ***************** *//
  // Relationship
  //* ***************** *//

  @OneToOne(() => Files, file => file.user)
  avatar: Files;

  @OneToMany(() => UserTokens, userTokens => userTokens.user)
  user_tokens: UserTokens[];

  @OneToMany(() => Posts, posts => posts.user)
  posts: Posts[];

  @OneToMany(() => Comments, comments => comments.user)
  comments: Comments[];

  @OneToMany(() => Follows, follows => follows.follower)
  follower_users: Follows[];

  @OneToMany(() => Follows, follows => follows.following)
  following_users: Follows[];

  @OneToMany(() => Likes, likes => likes.user)
  likes: Likes[];
}

export default Users;
