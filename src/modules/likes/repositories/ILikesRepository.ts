import ICreateLikeDTO from '../dtos/ICreateLikeDTO';
import ISearchLikesDTO from '../dtos/ISearchLikesDTO';
import Likes from '../infra/typeorm/entities/likes';

export default interface ILikesRepository {
  create(data: ICreateLikeDTO): Promise<Likes>;
  findById(id: string): Promise<Likes | null>;
  find(search: ISearchLikesDTO): Promise<Likes[] | undefined>;
  save(data: Likes): Promise<Likes>;
  delete(id: string): Promise<void>;
}
