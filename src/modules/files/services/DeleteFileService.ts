import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IStorageProvider from '@shared/providers/StorageProvider/models/IStorageProvider';
import IFilesRepository from '../repositories/IFilesRepository';

@injectable()
class DeleteFileService {
  constructor(
    @inject('FilesRepository')
    private filesRepository: IFilesRepository,

    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
  ) {}

  public async execute(id: string): Promise<void> {
    const item = await this.filesRepository.findById(id);

    if (!item) {
      throw new AppError('Arquivo não encontrado', 404);
    }

    await this.storageProvider.deleteFile(item.path);

    return this.filesRepository.delete(id);
  }
}

export default DeleteFileService;
