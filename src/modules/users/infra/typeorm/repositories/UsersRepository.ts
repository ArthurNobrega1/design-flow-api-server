import { Repository } from 'typeorm';

import timezone from '@shared/utils/timezone';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import ISearchUsersDTO from '@modules/users/dtos/ISearchUsersDTO';
import { AppDataSource } from '@shared/database';
import Users from '../entities/users';

class UsersRepository implements IUsersRepository {
  private ormRepository: Repository<Users>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository<Users>(Users);
  }

  public async create(data: ICreateUserDTO): Promise<Users> {
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

  public async findById(id: string): Promise<Users | null> {
    return this.ormRepository.findOne({
      where: { id },
    });
  }

  public async findWithPassword({
    email,
    username,
  }: {
    email?: string;
    username?: string;
  }): Promise<Users | null> {
    const query = this.ormRepository
      .createQueryBuilder('user')
      .addSelect('user.password');

    if (email) {
      query.where('user.email = :email', { email });
    } else if (username) {
      query.where('user.username = :username', { username });
    } else {
      return null;
    }

    return query.getOne();
  }

  public async find(search: ISearchUsersDTO): Promise<Users[] | undefined> {
    const query =
      AppDataSource.getRepository(Users).createQueryBuilder('users');

    if (search.id) {
      query.andWhere(`users.id = '${search.id}'`);
    }

    if (search.birthday) {
      query.andWhere(`users.birthday = '${search.birthday}'`);
    }

    if (search.email) {
      query.andWhere(`users.email = '${search.email}'`);
    }

    if (search.username) {
      query.andWhere(`users.username = '${search.username}'`);
    }

    if (search.fullname) {
      query.andWhere(`users.fullname = '${search.fullname}'`);
    }

    if (search.permission) {
      query.andWhere(`users.permission = '${search.permission}'`);
    }

    query.orderBy('users.created_at', 'DESC');

    const data = await query.getMany();

    return data;
  }

  public async save(data: Users): Promise<Users> {
    return this.ormRepository.save({
      ...data,
      updated_at: timezone(),
    });
  }
}

export default UsersRepository;
