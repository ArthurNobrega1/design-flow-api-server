import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IPostsRepository from '../repositories/IPostsRepository';
import Posts from '../infra/typeorm/entities/posts';
import IUpdatePostDTO from '../dtos/IUpdatePostDTO';

@injectable()
class UpdatePostService {
  constructor(
    @inject('PostsRepository')
    private postsRepository: IPostsRepository,
  ) {}

  public async execute(data: IUpdatePostDTO): Promise<Posts> {
    const item = await this.postsRepository.findById(data.id);

    if (!item) {
      throw new AppError('Postagem não encontrada', 404);
    }

    const updated = Object.assign(item, data);

    return this.postsRepository.save(updated);
  }
}

export default UpdatePostService;
