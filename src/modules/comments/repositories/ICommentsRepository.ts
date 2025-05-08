import ICreateCommentDTO from '../dtos/ICreateCommentDTO';
import ISearchCommentsDTO from '../dtos/ISearchCommentsDTO';
import Comments from '../infra/typeorm/entities/comments';

export default interface ICommentsRepository {
  create(data: ICreateCommentDTO): Promise<Comments>;
  findById(id: string): Promise<Comments | null>;
  find(search: ISearchCommentsDTO): Promise<Comments[] | undefined>;
  save(data: Comments): Promise<Comments>;
  delete(id: string): Promise<void>;
}
