import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IFilesRepository from '@modules/files/repositories/IFilesRepository';
import IPostsRepository from '@modules/posts/repositories/IPostsRepository';
import ICommentsRepository from '@modules/comments/repositories/ICommentsRepository';

import IUsersRepository from '../repositories/IUsersRepository';
import Users from '../infra/typeorm/entities/users';
import IUpdateUserDTO from '../dtos/IUpdateUserDTO';
import IUserTokensRepository from '../repositories/IUserTokensRepository';

@injectable()
class UpdateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,

    @inject('FilesRepository')
    private filesRepository: IFilesRepository,

    @inject('PostsRepository')
    private postsRepository: IPostsRepository,

    @inject('CommentsRepository')
    private commentsRepository: ICommentsRepository,
  ) {}

  public async execute(data: IUpdateUserDTO, userId: string): Promise<Users> {
    if (data.id !== userId) {
      throw new AppError(
        'Você não tem permissão para editar este usuário',
        401,
      );
    }

    const item = await this.usersRepository.findById(data.id);

    if (!item) {
      throw new AppError('Usuário não encontrado', 404);
    }

    if (data.email) {
      const email = await this.usersRepository.find({ email: data.email });
      if (email && email.length) {
        throw new AppError('Email já registrado', 400);
      }
    }

    if (data.username) {
      const username = await this.usersRepository.find({
        username: data.username,
      });
      if (username && username.length) {
        throw new AppError('Nome de usuário já registrado', 400);
      }
    }

    if (data.active === false) {
      const userTokens = await this.userTokensRepository.findByUserId(data.id);
      if (userTokens.length) {
        await Promise.all(
          userTokens.map(async userToken => {
            await this.userTokensRepository.save({
              ...userToken,
              active: false,
            });
          }),
        );
      }

      const avatars = await this.filesRepository.find({ user_id: data.id });
      if (avatars?.length) {
        const avatar = avatars[0];
        await this.filesRepository.save({ ...avatar, active: false });
      }

      const posts = await this.postsRepository.find({
        user_id: data.id,
      });

      if (posts?.length) {
        await Promise.all(
          posts.map(async post => {
            const comments = await this.commentsRepository.find({
              post_id: post.id,
            });
            if (comments?.length) {
              await Promise.all(
                comments.map(async comment => {
                  await this.commentsRepository.save({
                    ...comment,
                    active: false,
                  });
                }),
              );
            }
            const files = await this.filesRepository.find({
              post_id: post.id,
            });
            if (files?.length) {
              await Promise.all(
                files.map(async file => {
                  await this.filesRepository.save({
                    ...file,
                    active: false,
                  });
                }),
              );
            }
            await this.postsRepository.save({
              ...post,
              active: false,
            });
          }),
        );
      }
    }

    const updated = Object.assign(item, data);

    return this.usersRepository.save(updated);
  }
}

export default UpdateUserService;
