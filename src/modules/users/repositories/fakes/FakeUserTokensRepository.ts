import UserTokens from '@modules/users/infra/typeorm/entities/userTokens';
import timezone from '@shared/utils/timezone';
import { parse } from 'date-fns';
import { uuid } from 'uuidv4';
import IUserTokensRepository from '../IUserTokensRepository';

class FakeUserTokensRepository implements IUserTokensRepository {
  private userTokens: UserTokens[] = [];

  public async generate(userId: string): Promise<UserTokens> {
    const userToken = {
      ...new UserTokens(),
      id: uuid(),
      token: uuid(),
      user_id: userId,
    };
    userToken.created_at = parse(timezone(), 'yyyy-MM-dd HH:mm:ss', new Date());
    userToken.updated_at = parse(timezone(), 'yyyy-MM-dd HH:mm:ss', new Date());
    this.userTokens.push(userToken);
    return userToken;
  }

  public async findByToken(token: string): Promise<UserTokens | null> {
    const userTokenFiltered = this.userTokens.find(
      userToken => userToken.token === token,
    );
    if (!userTokenFiltered) {
      return null;
    }

    return userTokenFiltered;
  }

  public async delete(id: string): Promise<void> {
    this.userTokens = this.userTokens.filter(userToken => userToken.id !== id);
  }
}

export default FakeUserTokensRepository;
