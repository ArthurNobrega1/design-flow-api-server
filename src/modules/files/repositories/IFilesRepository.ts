import ICreateFilesDTO from '../dtos/ICreateFilesDTO';
import ISearchFilesDTO from '../dtos/ISearchFilesDTO';
import Files from '../infra/typeorm/entities/files';

export default interface IFilesRepository {
  create(data: ICreateFilesDTO): Promise<Files>;
  findById(id: string): Promise<Files | null>;
  find(search: ISearchFilesDTO): Promise<Files[] | undefined>;
  save(data: Files): Promise<Files>;
  delete(id: string): Promise<void>;
}
