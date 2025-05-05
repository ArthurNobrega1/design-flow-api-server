import { inject, injectable } from 'tsyringe';

import IPostsRepository from '../repositories/IPostsRepository';
import Posts from '../infra/typeorm/entities/posts';
import ISearchPostsDTO from '../dtos/ISearchPostsDTO';

@injectable()
class ShowPostsService {
  constructor(
    @inject('PostsRepository')
    private postsRepository: IPostsRepository,
  ) {}

  public async execute(query: ISearchPostsDTO): Promise<Posts[] | undefined> {
    const result = await this.postsRepository.find(query);
    return result;
  }
}

export default ShowPostsService;
