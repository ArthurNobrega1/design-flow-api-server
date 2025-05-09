import { Repository } from 'typeorm';

import timezone from '@shared/utils/timezone';
import IFollowsRepository from '@modules/follows/repositories/IFollowsRepository';
import ICreateFollowDTO from '@modules/follows/dtos/ICreateFollowDTO';
import ISearchFollowsDTO from '@modules/follows/dtos/ISearchFollowsDTO';
import { AppDataSource } from '@shared/database';
import Follows from '../entities/follows';

class FollowsRepository implements IFollowsRepository {
  private ormRepository: Repository<Follows>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository<Follows>(Follows);
  }

  public async create(data: ICreateFollowDTO): Promise<Follows> {
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

  public async findById(id: string): Promise<Follows | null> {
    return this.ormRepository.findOne({
      where: { id },
    });
  }

  public async find(search: ISearchFollowsDTO): Promise<Follows[] | undefined> {
    const query = AppDataSource.getRepository(Follows)
      .createQueryBuilder('follows')
      .leftJoinAndSelect(
        'follows.follower',
        'follower',
        'follower.active = true',
      )
      .leftJoinAndSelect(
        'follows.following',
        'following',
        'following.active = true',
      );

    if (search.id) {
      query.andWhere('follows.id = :id', {
        id: search.id,
      });
    }

    if (search.follower_id) {
      query.andWhere('follows.follower_id = :follower_id', {
        follower_id: search.follower_id,
      });
    }

    if (search.following_id) {
      query.andWhere('follows.following_id = :following_id', {
        following_id: search.following_id,
      });
    }

    query.andWhere(`follows.active = 'true'`);

    query.orderBy('follows.created_at', 'DESC');

    const data = await query.getMany();

    return data;
  }

  public async save(data: Follows): Promise<Follows> {
    return this.ormRepository.save({
      ...data,
      updated_at: timezone(),
    });
  }
}

export default FollowsRepository;
