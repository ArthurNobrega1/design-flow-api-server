import UserTokens from '../infra/typeorm/entities/userTokens';

export default interface IUserTokensRepository {
  generate(user_id: string): Promise<UserTokens>;
  findByToken(token: string): Promise<UserTokens | null>;
  delete(id: string): Promise<void>;
}
