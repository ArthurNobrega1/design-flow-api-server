import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ILikesRepository from '../repositories/ILikesRepository';

@injectable()
class DeleteLikeService {
  constructor(
    @inject('LikesRepository')
    private likesRepository: ILikesRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(id: string, userId: string): Promise<void> {
    const user = await this.usersRepository.findById(userId);
    if (!user || !user.active) {
      throw new AppError('Usuário inválido', 400);
    }

    if (user.permission !== 'admin') {
      throw new AppError('Você não tem permissão para deletar curtidas', 400);
    }

    const item = await this.likesRepository.findById(id);

    if (!item) {
      throw new AppError('Curtida não encontrada', 404);
    }

    return this.likesRepository.delete(id);
  }
}

export default DeleteLikeService;
