import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IStorageProvider from '@shared/providers/StorageProvider/models/IStorageProvider';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IPostsRepository from '@modules/posts/repositories/IPostsRepository';
import IFilesRepository from '../repositories/IFilesRepository';

@injectable()
class DeleteFileService {
  constructor(
    @inject('FilesRepository')
    private filesRepository: IFilesRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('PostsRepository')
    private postsRepository: IPostsRepository,
  ) {}

  public async execute(id: string, userId: string): Promise<void> {
    const user = await this.usersRepository.findById(userId);
    if (!user || !user.active) {
      throw new AppError('Usuário inválido', 400);
    }

    if (user.permission !== 'admin') {
      throw new AppError('Você não tem permissão para deletar arquivos', 400);
    }

    const item = await this.filesRepository.findById(id);

    if (!item) {
      throw new AppError('Arquivo não encontrado', 404);
    }

    if (item.post_id) {
      const post = await this.postsRepository.findById(item.post_id);
      if (!post || !post.active) {
        throw new AppError('Postagem inválida', 400);
      }
      if (post.user_id !== userId) {
        throw new AppError(
          'Você não tem permissão para deletar este arquivo',
          400,
        );
      }
    }

    await this.storageProvider.deleteFile(item.path);

    return this.filesRepository.delete(id);
  }
}

export default DeleteFileService;
