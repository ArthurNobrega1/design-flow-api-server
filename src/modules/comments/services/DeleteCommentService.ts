import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ILikesRepository from '@modules/likes/repositories/ILikesRepository';
import ICommentsRepository from '../repositories/ICommentsRepository';

@injectable()
class DeleteCommentService {
  constructor(
    @inject('CommentsRepository')
    private commentsRepository: ICommentsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('LikesRepository')
    private likesRepository: ILikesRepository,
  ) {}

  public async execute(id: string, userId: string): Promise<void> {
    const user = await this.usersRepository.findById(userId);
    if (!user || !user.active) {
      throw new AppError('Usuário inválido', 400);
    }

    const item = await this.commentsRepository.findById(id);

    if (!item) {
      throw new AppError('Comentário não encontrado', 404);
    }

    if (item.user_id !== userId) {
      throw new AppError(
        'Você não tem permissão para deletar es comentário',
        400,
      );
    }

    const likes = await this.likesRepository.find({
      comment_id: id,
    });
    if (likes?.length) {
      await Promise.all(
        likes.map(async like => {
          await this.likesRepository.delete(like.id);
        }),
      );
    }

    return this.commentsRepository.delete(id);
  }
}

export default DeleteCommentService;
