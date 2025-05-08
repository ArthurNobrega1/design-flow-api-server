import { inject, injectable } from 'tsyringe';

import ICommentsRepository from '../repositories/ICommentsRepository';
import Comments from '../infra/typeorm/entities/comments';
import ISearchCommentsDTO from '../dtos/ISearchCommentsDTO';

@injectable()
class ShowCommentsService {
  constructor(
    @inject('CommentsRepository')
    private commentsRepository: ICommentsRepository,
  ) {}

  public async execute(
    query: ISearchCommentsDTO,
  ): Promise<Comments[] | undefined> {
    const result = await this.commentsRepository.find(query);
    return result;
  }
}

export default ShowCommentsService;
