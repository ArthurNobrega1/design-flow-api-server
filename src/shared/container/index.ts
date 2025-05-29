import { container } from 'tsyringe';

import '../providers';
import '@modules/users/providers';

import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

import UserTokensRepository from '@modules/users/infra/typeorm/repositories/UserTokensRepository';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';

import FilesRepository from '@modules/files/infra/typeorm/repositories/FilesRepository';
import IFilesRepository from '@modules/files/repositories/IFilesRepository';

import PostsRepository from '@modules/posts/infra/typeorm/repositories/PostsRepository';
import IPostsRepository from '@modules/posts/repositories/IPostsRepository';

import CommentsRepository from '@modules/comments/infra/typeorm/repositories/CommentsRepository';
import ICommentsRepository from '@modules/comments/repositories/ICommentsRepository';

import LikesRepository from '@modules/likes/infra/typeorm/repositories/LikesRepository';
import ILikesRepository from '@modules/likes/repositories/ILikesRepository';

import FollowsRepository from '@modules/follows/infra/typeorm/repositories/FollowsRepository';
import IFollowsRepository from '@modules/follows/repositories/IFollowsRepository';

container.registerSingleton<IUsersRepository>(
  'UsersRepository',
  UsersRepository,
);

container.registerSingleton<IUserTokensRepository>(
  'UserTokensRepository',
  UserTokensRepository,
);

container.registerSingleton<IFilesRepository>(
  'FilesRepository',
  FilesRepository,
);

container.registerSingleton<IPostsRepository>(
  'PostsRepository',
  PostsRepository,
);

container.registerSingleton<ICommentsRepository>(
  'CommentsRepository',
  CommentsRepository,
);

container.registerSingleton<ILikesRepository>(
  'LikesRepository',
  LikesRepository,
);

container.registerSingleton<IFollowsRepository>(
  'FollowsRepository',
  FollowsRepository,
);
