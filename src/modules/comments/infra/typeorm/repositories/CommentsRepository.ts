import { Repository } from 'typeorm';

import timezone from '@shared/utils/timezone';
import ICommentsRepository from '@modules/comments/repositories/ICommentsRepository';
import ICreateCommentDTO from '@modules/comments/dtos/ICreateCommentDTO';
import ISearchCommentsDTO from '@modules/comments/dtos/ISearchCommentsDTO';
import { AppDataSource } from '@shared/database';
import Comments from '../entities/comments';

class CommentsRepository implements ICommentsRepository {
  private ormRepository: Repository<Comments>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository<Comments>(Comments);
  }

  public async create(data: ICreateCommentDTO): Promise<Comments> {
    const service = this.ormRepository.create({
      ...data,
      created_at: timezone(),
      updated_at: timezone(),
    });

    return this.ormRepository.save(service);
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async findById(id: string): Promise<Comments | null> {
    return this.ormRepository.findOne({
      where: { id },
    });
  }

  public async find(
    search: ISearchCommentsDTO,
  ): Promise<Comments[] | undefined> {
    const query = AppDataSource.getRepository(Comments)
      .createQueryBuilder('comments')
      .leftJoinAndSelect('comments.user', 'user')
      .leftJoinAndSelect('user.avatar', 'avatar', 'avatar.active = true')
      .leftJoinAndSelect('comments.likes', 'likes', 'likes.active = true')
      .leftJoinAndSelect('comments.replies', 'replies', 'replies.active = true')
      .leftJoinAndSelect(
        'replies.likes',
        'repliesLikes',
        'repliesLikes.active = true',
      )
      .leftJoinAndSelect(
        'replies.user',
        'repliesUser',
        'repliesUser.active = true',
      );

    if (search.id) {
      query.andWhere('comments.id = :id', {
        id: search.id,
      });
    }

    if (search.user_id) {
      query.andWhere('comments.user_id = :user_id', {
        user_id: search.user_id,
      });
    }

    if (search.parent_comment_id) {
      query.andWhere('comments.parent_comment_id = :parent_comment_id', {
        parent_comment_id: search.parent_comment_id,
      });
    }

    query.andWhere(`comments.active = 'true'`);

    query.orderBy('comments.created_at', 'DESC');

    const data = await query.getMany();

    return data;
  }

  public async save(data: Comments): Promise<Comments> {
    return this.ormRepository.save({
      ...data,
      updated_at: timezone(),
    });
  }
}

export default CommentsRepository;
