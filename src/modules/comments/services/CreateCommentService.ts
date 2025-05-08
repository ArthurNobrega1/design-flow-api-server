import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IPostsRepository from '@modules/posts/repositories/IPostsRepository';
import ICommentsRepository from '../repositories/ICommentsRepository';
import Comments from '../infra/typeorm/entities/comments';
import ICreateCommentDTO from '../dtos/ICreateCommentDTO';

@injectable()
class CreateCommentService {
  constructor(
    @inject('CommentsRepository')
    private commentsRepository: ICommentsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('PostsRepository')
    private postsRepository: IPostsRepository,
  ) {}

  public async execute(
    data: Omit<ICreateCommentDTO, 'user_id'>,
    userId: string,
  ): Promise<Comments> {
    const user = await this.usersRepository.findById(userId);
    if (!user || !user.active) {
      throw new AppError('Usuário inválido', 400);
    }

    const post = await this.postsRepository.findById(data.post_id);
    if (!post || !post.active) {
      throw new AppError('Postagem inválida', 400);
    }

    const created = await this.commentsRepository.create({
      ...data,
      user_id: userId,
    });
    return created;
  }
}

export default CreateCommentService;
