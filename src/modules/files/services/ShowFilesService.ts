import { inject, injectable } from 'tsyringe';

import IFilesRepository from '../repositories/IFilesRepository';
import Files from '../infra/typeorm/entities/files';
import ISearchFilesDTO from '../dtos/ISearchFilesDTO';

@injectable()
class ShowFilesService {
  constructor(
    @inject('FilesRepository')
    private filesRepository: IFilesRepository,
  ) {}

  public async execute(query: ISearchFilesDTO): Promise<Files[] | undefined> {
    const result = await this.filesRepository.find(query);
    return result;
  }
}

export default ShowFilesService;
