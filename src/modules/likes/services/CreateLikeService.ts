import { inject, injectable } from 'tsyringe';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IPostsRepository from '@modules/posts/repositories/IPostsRepository';
import ICommentsRepository from '@modules/comments/repositories/ICommentsRepository';
import ICreateLikeDTO from '../dtos/ICreateLikeDTO';
import Likes from '../infra/typeorm/entities/likes';
import ILikesRepository from '../repositories/ILikesRepository';

@injectable()
class CreateLikeService {
  constructor(
    @inject('LikesRepository')
    private likesRepository: ILikesRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('PostsRepository')
    private postsRepository: IPostsRepository,

    @inject('CommentsRepository')
    private commentsRepository: ICommentsRepository,
  ) {}

  public async execute(
    data: Omit<ICreateLikeDTO, 'user_id'>,
    userId: string,
  ): Promise<Likes> {
    const user = await this.usersRepository.findById(userId);
    if (!user || !user.active) {
      throw new AppError('Usuário inválido', 400);
    }

    if (!data.comment_id && !data.post_id) {
      throw new AppError(
        'A curtida deve estar associado a um comentário ou a uma postagem',
        400,
      );
    }

    if (data.comment_id) {
      const comment = await this.commentsRepository.findById(data.comment_id);
      if (!comment || !comment.active) {
        throw new AppError('Comentário inválido', 400);
      }
    }

    if (data.post_id) {
      const post = await this.postsRepository.findById(data.post_id);
      if (!post || !post.active) {
        throw new AppError('Postagem inválida', 400);
      }
    }

    const created = await this.likesRepository.create({
      ...data,
      user_id: userId,
    });
    return created;
  }
}

export default CreateLikeService;
