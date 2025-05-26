import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICommentsRepository from '@modules/comments/repositories/ICommentsRepository';
import ILikesRepository from '@modules/likes/repositories/ILikesRepository';
import IFilesRepository from '@modules/files/repositories/IFilesRepository';
import IPostsRepository from '../repositories/IPostsRepository';
import Posts from '../infra/typeorm/entities/posts';
import IUpdatePostDTO from '../dtos/IUpdatePostDTO';

@injectable()
class UpdatePostService {
  constructor(
    @inject('PostsRepository')
    private postsRepository: IPostsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('FilesRepository')
    private filesRepository: IFilesRepository,

    @inject('LikesRepository')
    private likesRepository: ILikesRepository,

    @inject('CommentsRepository')
    private commentsRepository: ICommentsRepository,
  ) {}

  public async execute(data: IUpdatePostDTO, userId: string): Promise<Posts> {
    const user = await this.usersRepository.findById(userId);
    if (!user || !user.active) {
      throw new AppError('Usuário inválido', 400);
    }

    const item = await this.postsRepository.findById(data.id);

    if (!item) {
      throw new AppError('Postagem não encontrada', 404);
    }

    if (item.user_id !== userId) {
      if (data.active === false) {
        throw new AppError(
          'Você não tem permissão para deletar esta postagem',
          400,
        );
      } else {
        throw new AppError(
          'Você não tem permissão para editar esta postagem',
          400,
        );
      }
    }

    if (data.active === false) {
      const likes = await this.likesRepository.find({
        post_id: data.id,
      });
      if (likes?.length) {
        await Promise.all(
          likes.map(async like => {
            await this.likesRepository.save({
              ...like,
              active: false,
            });
          }),
        );
      }
      const comments = await this.commentsRepository.find({
        post_id: data.id,
      });
      if (comments?.length) {
        await Promise.all(
          comments.map(async comment => {
            const commentLikes = await this.likesRepository.find({
              comment_id: comment.id,
            });
            if (commentLikes?.length) {
              await Promise.all(
                commentLikes.map(async commentLike => {
                  await this.likesRepository.save({
                    ...commentLike,
                    active: false,
                  });
                }),
              );
            }
            await this.commentsRepository.save({
              ...comment,
              active: false,
            });
          }),
        );
      }
      const files = await this.filesRepository.find({
        post_id: data.id,
      });
      if (files?.length) {
        await Promise.all(
          files.map(async file => {
            await this.filesRepository.save({
              ...file,
              active: false,
            });
          }),
        );
      }
    } else if (data.user_id) {
      throw new AppError('Você não pode alterar o usuário desta postagem', 400);
    }

    const updated = Object.assign(item, data);

    return this.postsRepository.save(updated);
  }
}

export default UpdatePostService;
