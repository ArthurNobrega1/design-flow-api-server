import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import Files from '../infra/typeorm/entities/files';
import IFilesRepository from '../repositories/IFilesRepository';
import IUpdateFileDTO from '../dtos/IUpdateFileDTO';

@injectable()
class UpdateFileService {
  constructor(
    @inject('FilesRepository')
    private filesRepository: IFilesRepository,
  ) {}

  public async execute(data: IUpdateFileDTO): Promise<Files> {
    const item = await this.filesRepository.findById(data.id);

    if (!item) {
      throw new AppError('Arquivo não encontrado', 404);
    }

    const updated = Object.assign(item, data);

    return this.filesRepository.save(updated);
  }
}

export default UpdateFileService;
