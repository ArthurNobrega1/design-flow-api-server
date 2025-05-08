import { Repository } from 'typeorm';

import timezone from '@shared/utils/timezone';
import ICreateFilesDTO from '@modules/files/dtos/ICreateFilesDTO';
import ISearchFilesDTO from '@modules/files/dtos/ISearchFilesDTO';
import { AppDataSource } from '@shared/database';
import IFilesRepository from '@modules/files/repositories/IFilesRepository';
import Files from '../entities/files';

class FilesRepository implements IFilesRepository {
  private ormRepository: Repository<Files>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository<Files>(Files);
  }

  public async create(data: ICreateFilesDTO): Promise<Files> {
    const service = this.ormRepository.create({
      ...data,
      created_at: timezone(),
      updated_at: timezone(),
    });

    return this.ormRepository.save(service);
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async findById(id: string): Promise<Files | null> {
    return this.ormRepository.findOne({
      where: { id },
    });
  }

  public async find(search: ISearchFilesDTO): Promise<Files[] | undefined> {
    const query =
      AppDataSource.getRepository(Files).createQueryBuilder('files');

    if (search.id) {
      query.andWhere(`files.id = '${search.id}'`);
    }

    if (search.path) {
      query.andWhere(`files.path = '${search.path}'`);
    }

    if (search.user_id) {
      query.andWhere(`files.user_id = '${search.user_id}'`);
    }

    if (search.post_id) {
      query.andWhere(`files.post_id = '${search.post_id}'`);
    }

    query.andWhere(`files.active = 'true'`);

    query.orderBy('files.created_at', 'DESC');

    const data = await query.getMany();

    return data;
  }

  public async save(data: Files): Promise<Files> {
    return this.ormRepository.save({
      ...data,
      updated_at: timezone(),
    });
  }
}

export default FilesRepository;
