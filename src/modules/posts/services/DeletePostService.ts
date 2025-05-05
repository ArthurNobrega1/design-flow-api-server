import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IPostsRepository from '../repositories/IPostsRepository';

@injectable()
class DeletePostService {
  constructor(
    @inject('PostsRepository')
    private postsRepository: IPostsRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    const item = await this.postsRepository.findById(id);

    if (!item) {
      throw new AppError('Postagem não encontrada', 404);
    }

    return this.postsRepository.delete(id);
  }
}

export default DeletePostService;
