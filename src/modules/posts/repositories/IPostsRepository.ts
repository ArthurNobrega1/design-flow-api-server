import ICreatePostDTO from '../dtos/ICreatePostDTO';
import ISearchPostsDTO from '../dtos/ISearchPostsDTO';
import Posts from '../infra/typeorm/entities/posts';

export default interface IPostsRepository {
  create(data: ICreatePostDTO): Promise<Posts>;
  findById(id: string): Promise<Posts | null>;
  find(search: ISearchPostsDTO): Promise<Posts[] | undefined>;
  save(data: Posts): Promise<Posts>;
  delete(id: string): Promise<void>;
}
