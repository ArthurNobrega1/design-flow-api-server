import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICommentsRepository from '../repositories/ICommentsRepository';
import Comments from '../infra/typeorm/entities/comments';
import IUpdateCommentDTO from '../dtos/IUpdateCommentDTO';

@injectable()
class UpdateCommentService {
  constructor(
    @inject('CommentsRepository')
    private commentsRepository: ICommentsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(
    data: IUpdateCommentDTO,
    userId: string,
  ): Promise<Comments> {
    const user = await this.usersRepository.findById(userId);
    if (!user || !user.active) {
      throw new AppError('Usuário inválido', 400);
    }

    const item = await this.commentsRepository.findById(data.id);

    if (!item) {
      throw new AppError('Comentário não encontrado', 404);
    }

    if (item.user_id !== userId) {
      if (data.active === false) {
        throw new AppError(
          'Você não tem permissão para deletar este comentário',
          400,
        );
      } else {
        throw new AppError(
          'Você não tem permissão para editar este comentário',
          400,
        );
      }
    }

    const updated = Object.assign(item, data);

    return this.commentsRepository.save(updated);
  }
}

export default UpdateCommentService;
