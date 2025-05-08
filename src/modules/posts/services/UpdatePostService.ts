import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IPostsRepository from '../repositories/IPostsRepository';
import Posts from '../infra/typeorm/entities/posts';
import IUpdatePostDTO from '../dtos/IUpdatePostDTO';

@injectable()
class UpdatePostService {
  constructor(
    @inject('PostsRepository')
    private postsRepository: IPostsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(data: IUpdatePostDTO, userId: string): Promise<Posts> {
    const user = await this.usersRepository.findById(userId);
    if (!user || !user.active) {
      throw new AppError('Usuário inválido', 400);
    }

    const item = await this.postsRepository.findById(data.id);

    if (!item) {
      throw new AppError('Postagem não encontrada', 404);
    }

    if (item.user_id !== userId) {
      if (data.active === false) {
        throw new AppError(
          'Você não tem permissão para deletar esta postagem',
          400,
        );
      } else {
        throw new AppError(
          'Você não tem permissão para editar esta postagem',
          400,
        );
      }
    }

    const updated = Object.assign(item, data);

    return this.postsRepository.save(updated);
  }
}

export default UpdatePostService;
