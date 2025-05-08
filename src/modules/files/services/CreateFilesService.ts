import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IStorageProvider from '@shared/providers/StorageProvider/models/IStorageProvider';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IPostsRepository from '@modules/posts/repositories/IPostsRepository';
import Files from '../infra/typeorm/entities/files';
import ICreateFilesDTO from '../dtos/ICreateFilesDTO';
import IFilesRepository from '../repositories/IFilesRepository';
import IFileDTO from '../dtos/IFileDTO';

@injectable()
class CreateFilesService {
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

  public async execute(
    data: ICreateFilesDTO,
    userId: string,
    files?: IFileDTO[] | { [fieldname: string]: IFileDTO[] },
  ): Promise<Files[]> {
    if (!files || !files.length) {
      throw new AppError('Arquivos não enviados', 400);
    }

    if (!data.user_id && !data.post_id) {
      throw new AppError(
        'O arquivo deve estar associado a um usuário ou a uma postagem',
        400,
      );
    }

    if (data.user_id) {
      if (data.user_id !== userId) {
        throw new AppError(
          'Você não tem permissão para enviar arquivos para outro usuário',
          400,
        );
      }

      const user = await this.usersRepository.findById(data.user_id);
      if (!user || !user.active) {
        throw new AppError('Usuário inválido', 400);
      }
    }

    if (data.post_id) {
      const post = await this.postsRepository.findById(data.post_id);
      if (!post || !post.active) {
        throw new AppError('Postagem inválida', 400);
      }
      if (post.user_id !== userId) {
        throw new AppError(
          'Você não tem permissão para enviar arquivos para um post de outro usuário',
          400,
        );
      }
    }

    let realFiles: IFileDTO[] = [];

    if (!Array.isArray(files)) {
      const firstKey = Object.keys(files)[0];
      realFiles = files[firstKey];
    } else {
      realFiles = files;
    }

    const createdFiles = await Promise.all(
      realFiles.map(async file => {
        const savedFilename = await this.storageProvider.saveFile(
          file.filename,
        );

        const created = await this.filesRepository.create({
          ...data,
          path: savedFilename,
        });

        return created;
      }),
    );

    return createdFiles;
  }
}

export default CreateFilesService;
