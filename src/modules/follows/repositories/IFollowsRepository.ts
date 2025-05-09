import ICreateFollowDTO from '../dtos/ICreateFollowDTO';
import ISearchFollowsDTO from '../dtos/ISearchFollowsDTO';
import Follows from '../infra/typeorm/entities/follows';

export default interface IFollowsRepository {
  create(data: ICreateFollowDTO): Promise<Follows>;
  findById(id: string): Promise<Follows | null>;
  find(search: ISearchFollowsDTO): Promise<Follows[] | undefined>;
  save(data: Follows): Promise<Follows>;
  delete(id: string): Promise<void>;
}
