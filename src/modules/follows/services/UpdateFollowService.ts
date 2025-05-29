import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IFollowsRepository from '../repositories/IFollowsRepository';
import Follows from '../infra/typeorm/entities/follows';
import IUpdateFollowDTO from '../dtos/IUpdateFollowDTO';

@injectable()
class UpdateFollowService {
  constructor(
    @inject('FollowsRepository')
    private followsRepository: IFollowsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(
    data: IUpdateFollowDTO,
    userId: string,
  ): Promise<Follows> {
    const user = await this.usersRepository.findById(userId);
    if (!user || !user.active) {
      throw new AppError('Usuário inválido', 400);
    }

    const item = await this.followsRepository.findById(data.id);

    if (!item) {
      throw new AppError('Seguidor/Seguindo não encontrado', 404);
    }

    if (item.follower_id !== userId && item.following_id !== userId) {
      if (data.active === false) {
        throw new AppError(
          'Você não tem permissão para parar de seguir/ser seguido por este usuário',
          400,
        );
      } else {
        throw new AppError(
          'Você não tem permissão para alterar sua relação de seguir/ser seguido com este usuário',
          400,
        );
      }
    }

    if (
      item.following_id !== userId &&
      data.is_accepted !== undefined &&
      data.is_accepted !== null
    ) {
      throw new AppError(
        'Você não tem permissão para aprovar ou rejeitar essa relação de seguir/ser seguido com este usuário',
        400,
      );
    }

    const updated = Object.assign(item, data);

    return this.followsRepository.save(updated);
  }
}

export default UpdateFollowService;
