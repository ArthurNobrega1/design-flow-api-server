import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ILikesRepository from '@modules/likes/repositories/ILikesRepository';
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

    @inject('LikesRepository')
    private likesRepository: ILikesRepository,
  ) {}

  private async deactivateRepliesAndLikes(commentId: string): Promise<void> {
    if (!commentId) {
      return;
    }

    const likes = await this.likesRepository.find({ comment_id: commentId });
    if (likes?.length) {
      await Promise.all(
        likes.map(async like => {
          await this.likesRepository.save({ ...like, active: false });
        }),
      );
    }

    const replies = await this.commentsRepository.find({
      parent_comment_id: commentId,
    });

    if (replies?.length) {
      await Promise.all(
        replies.map(async reply => {
          if (reply.id && reply.id !== commentId) {
            await this.deactivateRepliesAndLikes(reply.id);
          }

          await this.commentsRepository.save({ ...reply, active: false });
        }),
      );
    }
  }

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

    if (data.active === false) {
      await this.deactivateRepliesAndLikes(data.id);
    }

    const updated = Object.assign(item, data);

    return this.commentsRepository.save(updated);
  }
}

export default UpdateCommentService;
