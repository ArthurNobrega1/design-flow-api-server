import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IPostsRepository from '../repositories/IPostsRepository';

@injectable()
class DeletePostService {
  constructor(
    @inject('PostsRepository')
    private postsRepository: IPostsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(id: string, userId: string): Promise<void> {
    const user = await this.usersRepository.findById(userId);
    if (!user || !user.active) {
      throw new AppError('Usuário inválido', 400);
    }

    const item = await this.postsRepository.findById(id);

    if (!item) {
      throw new AppError('Postagem não encontrada', 404);
    }

    if (item.user_id !== userId) {
      throw new AppError(
        'Você não tem permissão para deletar esta postagem',
        400,
      );
    }

    return this.postsRepository.delete(id);
  }
}

export default DeletePostService;
