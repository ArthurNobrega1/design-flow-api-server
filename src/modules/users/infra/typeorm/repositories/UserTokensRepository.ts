import { Repository } from 'typeorm';

import timezone from '@shared/utils/timezone';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import { AppDataSource } from '@shared/database';
import UserTokens from '../entities/userTokens';

class UserTokensRepository implements IUserTokensRepository {
  private ormRepository: Repository<UserTokens>;

  constructor() {
    this.ormRepository = AppDataSource.getRepository<UserTokens>(UserTokens);
  }

  public async generate(userId: string): Promise<UserTokens> {
    const service = this.ormRepository.create({
      user_id: userId,
      created_at: timezone(),
      updated_at: timezone(),
    });

    return this.ormRepository.save(service);
  }

  public async findByToken(token: string): Promise<UserTokens | null> {
    return this.ormRepository.findOne({
      where: { token, active: true },
    });
  }

  public async findByUserId(userId: string): Promise<UserTokens[]> {
    return this.ormRepository.find({
      where: { user_id: userId, active: true },
    });
  }

  public async delete(id: string): Promise<void> {
    await this.ormRepository.delete(id);
  }

  public async save(data: UserTokens): Promise<UserTokens> {
    return this.ormRepository.save({
      ...data,
      updated_at: timezone(),
    });
  }
}

export default UserTokensRepository;
