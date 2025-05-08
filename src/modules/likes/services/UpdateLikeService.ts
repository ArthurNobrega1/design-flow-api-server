import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ILikesRepository from '../repositories/ILikesRepository';
import IUpdateLikeDTO from '../dtos/IUpdateLikeDTO';
import Likes from '../infra/typeorm/entities/likes';

@injectable()
class UpdateLikeService {
  constructor(
    @inject('LikesRepository')
    private likesRepository: ILikesRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(data: IUpdateLikeDTO, userId: string): Promise<Likes> {
    const user = await this.usersRepository.findById(userId);
    if (!user || !user.active) {
      throw new AppError('Usuário inválido', 400);
    }

    const item = await this.likesRepository.findById(data.id);

    if (!item) {
      throw new AppError('Curtida não encontrada', 404);
    }

    if (item.user_id !== userId) {
      if (data.active === false) {
        throw new AppError(
          'Você não tem permissão para deletar esta curtida',
          400,
        );
      } else {
        throw new AppError(
          'Você não tem permissão para atualizar esta curtida',
          400,
        );
      }
    }

    const updated = Object.assign(item, data);

    return this.likesRepository.save(updated);
  }
}

export default UpdateLikeService;
