import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IFilesRepository from '@modules/files/repositories/IFilesRepository';
import IPostsRepository from '@modules/posts/repositories/IPostsRepository';
import ICommentsRepository from '@modules/comments/repositories/ICommentsRepository';
import IStorageProvider from '@shared/providers/StorageProvider/models/IStorageProvider';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';

@injectable()
class DeleteUserService {
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

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute(id: string, userId: string): Promise<void> {
    if (id !== userId) {
      throw new AppError(
        'Você não tem permissão para editar este usuário',
        401,
      );
    }

    const itens = await this.usersRepository.find({ id });

    if (!itens || !itens.length) {
      throw new AppError('Usuário não encontrado', 404);
    }

    const item = itens[0];

    const userTokens = await this.userTokensRepository.findByUserId(id);
    if (userTokens.length) {
      await Promise.all(
        userTokens.map(async userToken => {
          await this.userTokensRepository.delete(userToken.id);
        }),
      );
    }

    if (item.avatar) {
      await this.storageProvider.deleteFile(item.avatar.path);
      await this.filesRepository.delete(item.avatar.id);
    }

    const posts = await this.postsRepository.find({
      user_id: id,
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
                await this.commentsRepository.delete(comment.id);
              }),
            );
          }
          const files = await this.filesRepository.find({
            post_id: post.id,
          });
          if (files?.length) {
            await Promise.all(
              files.map(async file => {
                await this.storageProvider.deleteFile(file.path);
                await this.filesRepository.delete(file.id);
              }),
            );
          }
          await this.postsRepository.delete(post.id);
        }),
      );
    }

    return this.usersRepository.delete(id);
  }
}

export default DeleteUserService;
