import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IPostsRepository from '@modules/posts/repositories/IPostsRepository';
import Files from '../infra/typeorm/entities/files';
import IFilesRepository from '../repositories/IFilesRepository';
import IUpdateFileDTO from '../dtos/IUpdateFileDTO';

@injectable()
class UpdateFileService {
  constructor(
    @inject('FilesRepository')
    private filesRepository: IFilesRepository,

    @inject('PostsRepository')
    private postsRepository: IPostsRepository,
  ) {}

  public async execute(data: IUpdateFileDTO, userId: string): Promise<Files> {
    const item = await this.filesRepository.findById(data.id);

    if (!item) {
      throw new AppError('Arquivo não encontrado', 404);
    }

    if (item.user_id) {
      if (item.user_id !== userId) {
        if (data.active === false) {
          throw new AppError(
            'Você não tem permissão para deletar este arquivo',
            400,
          );
        } else {
          throw new AppError(
            'Você não tem permissão para editar este arquivo',
            400,
          );
        }
      }
    }
    if (item.post_id) {
      const post = await this.postsRepository.findById(item.post_id);
      if (!post || !post.active) {
        throw new AppError('Postagem inválida', 400);
      }
      if (post.user_id !== userId) {
        if (data.active === false) {
          throw new AppError(
            'Você não tem permissão para deletar este arquivo',
            400,
          );
        } else {
          throw new AppError(
            'Você não tem permissão para editar este arquivo',
            400,
          );
        }
      }
    }

    const updated = Object.assign(item, data);

    return this.filesRepository.save(updated);
  }
}

export default UpdateFileService;
