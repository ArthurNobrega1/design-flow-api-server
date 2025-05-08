import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IFilesRepository from '@modules/files/repositories/IFilesRepository';
import ICommentsRepository from '@modules/comments/repositories/ICommentsRepository';
import IStorageProvider from '@shared/providers/StorageProvider/models/IStorageProvider';
import IPostsRepository from '../repositories/IPostsRepository';

@injectable()
class DeletePostService {
  constructor(
    @inject('PostsRepository')
    private postsRepository: IPostsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('FilesRepository')
    private filesRepository: IFilesRepository,

    @inject('CommentsRepository')
    private commentsRepository: ICommentsRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute(id: string, userId: string): Promise<void> {
    const user = await this.usersRepository.findById(userId);
    if (!user || !user.active) {
      throw new AppError('Usuário inválido', 400);
    }

    const item = await this.postsRepository.findById(id);

    if (!item) {
      throw new AppError('Postagem não encontrada', 404);
    }

    if (item.user_id !== userId) {
      throw new AppError(
        'Você não tem permissão para deletar esta postagem',
        400,
      );
    }

    const comments = await this.commentsRepository.find({
      post_id: id,
    });
    if (comments?.length) {
      await Promise.all(
        comments.map(async comment => {
          await this.commentsRepository.delete(comment.id);
        }),
      );
    }
    const files = await this.filesRepository.find({
      post_id: id,
    });
    if (files?.length) {
      await Promise.all(
        files.map(async file => {
          await this.storageProvider.deleteFile(file.path);
          await this.filesRepository.delete(file.id);
        }),
      );
    }

    return this.postsRepository.delete(id);
  }
}

export default DeletePostService;
