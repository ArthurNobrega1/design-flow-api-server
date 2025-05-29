import { Repository } from 'typeorm';

import timezone from '@shared/utils/timezone';
import ICreateLikeDTO from '@modules/likes/dtos/ICreateLikeDTO';
import ISearchLikesDTO from '@modules/likes/dtos/ISearchLikesDTO';
import { AppDataSource } from '@shared/database';
import ILikesRepository from '@modules/likes/repositories/ILikesRepository';
import Likes from '../entities/likes';

class LikesRepository implements ILikesRepository {
  private ormRepository: Repository<Likes>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository<Likes>(Likes);
  }

  public async create(data: ICreateLikeDTO): Promise<Likes> {
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

  public async findById(id: string): Promise<Likes | null> {
    return this.ormRepository.findOne({
      where: { id },
    });
  }

  public async find(search: ISearchLikesDTO): Promise<Likes[] | undefined> {
    const query =
      AppDataSource.getRepository(Likes).createQueryBuilder('likes');

    if (search.id) {
      query.andWhere('likes.id = :id', {
        id: search.id,
      });
    }

    if (search.user_id) {
      query.andWhere('likes.user_id = :user_id', {
        user_id: search.user_id,
      });
    }

    if (search.post_id) {
      query.andWhere('likes.post_id = :post_id', {
        post_id: search.post_id,
      });
    }

    if (search.comment_id) {
      query.andWhere('likes.post_id = :post_id', {
        post_id: search.post_id,
      });
    }

    query.andWhere(`likes.active = 'true'`);

    query.orderBy('likes.created_at', 'DESC');

    const data = await query.getMany();

    return data;
  }

  public async save(data: Likes): Promise<Likes> {
    return this.ormRepository.save({
      ...data,
      updated_at: timezone(),
    });
  }
}

export default LikesRepository;
