import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IFollowsRepository from '../repositories/IFollowsRepository';

@injectable()
class DeleteFollowService {
  constructor(
    @inject('FollowsRepository')
    private followsRepository: IFollowsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(id: string, followerId: string): Promise<void> {
    const user = await this.usersRepository.findById(followerId);
    if (!user || !user.active) {
      throw new AppError('Usuário inválido', 400);
    }

    const item = await this.followsRepository.findById(id);

    if (!item) {
      throw new AppError('Seguidor/Seguindo não encontrado', 404);
    }

    if (item.follower_id !== followerId) {
      throw new AppError(
        'Você não tem permissão para parar de seguir este usuário',
        400,
      );
    }

    return this.followsRepository.delete(id);
  }
}

export default DeleteFollowService;
