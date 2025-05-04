import timezone from '@shared/utils/timezone';
import { parse } from 'date-fns';
import { uuid } from 'uuidv4';
import Files from '@modules/files/infra/typeorm/entities/files';
import ISearchFilesDTO from '@modules/files/dtos/ISearchFilesDTO';
import ICreateFilesDTO from '@modules/files/dtos/ICreateFilesDTO';
import IFilesRepository from '../IFilesRepository';

class FakeFilesRepository implements IFilesRepository {
  private files: Files[] = [];

  public async create(data: ICreateFilesDTO): Promise<Files> {
    const file = { ...new Files(), ...data, id: uuid() };
    file.created_at = parse(timezone(), 'yyyy-MM-dd HH:mm:ss', new Date());
    file.updated_at = parse(timezone(), 'yyyy-MM-dd HH:mm:ss', new Date());
    this.files.push(file);
    return file;
  }

  public async delete(id: string): Promise<void> {
    this.files = this.files.filter(file => file.id !== id);
  }

  public async findById(id: string): Promise<Files | null> {
    const fileFiltered = this.files.find(file => file.id === id);
    if (!fileFiltered) {
      return null;
    }
    return fileFiltered;
  }

  public async find(search: ISearchFilesDTO): Promise<Files[] | undefined> {
    const filesFiltered = this.files.filter(file =>
      Object.entries(search).every(
        ([key, value]) => file[key as keyof Files] === value,
      ),
    );

    return filesFiltered.length ? filesFiltered : undefined;
  }

  public async save(data: Files): Promise<Files> {
    const index = this.files.findIndex(file => file.id === data.id);

    const updatedFile = {
      ...(index >= 0 ? this.files[index] : {}),
      ...data,
      updated_at: parse(timezone(), 'yyyy-MM-dd HH:mm:ss', new Date()),
    };

    if (index >= 0) {
      this.files[index] = updatedFile;
    } else {
      this.files.push(updatedFile);
    }

    return updatedFile;
  }
}

export default FakeFilesRepository;
