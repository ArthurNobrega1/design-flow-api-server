import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IPostsRepository from '../repositories/IPostsRepository';
import Posts from '../infra/typeorm/entities/posts';
import ICreatePostDTO from '../dtos/ICreatePostDTO';

@injectable()
class CreatePostService {
  constructor(
    @inject('PostsRepository')
    private postsRepository: IPostsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(data: ICreatePostDTO): Promise<Posts> {
    const user = await this.usersRepository.findById(data.user_id);
    if (!user || !user.active) {
      throw new AppError('Usuário inválido', 400);
    }

    const created = await this.postsRepository.create(data);
    return created;
  }
}

export default CreatePostService;
