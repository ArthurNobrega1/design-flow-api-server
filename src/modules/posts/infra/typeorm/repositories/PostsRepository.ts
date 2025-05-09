import { Repository } from 'typeorm';

import timezone from '@shared/utils/timezone';
import IPostsRepository from '@modules/posts/repositories/IPostsRepository';
import ICreatePostDTO from '@modules/posts/dtos/ICreatePostDTO';
import ISearchPostsDTO from '@modules/posts/dtos/ISearchPostsDTO';
import { AppDataSource } from '@shared/database';
import Posts from '../entities/posts';

class PostsRepository implements IPostsRepository {
  private ormRepository: Repository<Posts>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository<Posts>(Posts);
  }

  public async create(data: ICreatePostDTO): Promise<Posts> {
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

  public async findById(id: string): Promise<Posts | null> {
    return this.ormRepository.findOne({
      where: { id },
    });
  }

  public async find(search: ISearchPostsDTO): Promise<Posts[] | undefined> {
    const query = AppDataSource.getRepository(Posts)
      .createQueryBuilder('posts')
      .leftJoinAndSelect('posts.user', 'user')
      .leftJoinAndSelect('posts.files', 'files', 'files.active = true')
      .leftJoinAndSelect('posts.comments', 'comments', 'comments.active = true')
      .leftJoinAndSelect('posts.likes', 'likes', 'likes.active = true');

    if (search.id) {
      query.andWhere('posts.id = :id', {
        id: search.id,
      });
    }

    if (search.title) {
      query.andWhere('posts.title = :title', {
        title: search.title,
      });
    }

    if (search.user_id) {
      query.andWhere('posts.user_id = :user_id', {
        user_id: search.user_id,
      });
    }

    query.andWhere(`posts.active = 'true'`);

    query.orderBy('posts.created_at', 'DESC');

    const data = await query.getMany();

    return data;
  }

  public async save(data: Posts): Promise<Posts> {
    return this.ormRepository.save({
      ...data,
      updated_at: timezone(),
    });
  }
}

export default PostsRepository;
