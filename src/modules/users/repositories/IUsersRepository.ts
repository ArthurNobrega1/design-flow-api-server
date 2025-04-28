import ICreateUserDTO from '../dtos/ICreateUserDTO';
import ISearchUsersDTO from '../dtos/ISearchUsersDTO';
import Users from '../infra/typeorm/entities/users';

export default interface IUsersRepository {
  create(data: ICreateUserDTO): Promise<Users>;
  findById(id: string): Promise<Users | null>;
  findWithPassword(search: {
    email?: string;
    username?: string;
  }): Promise<Users | null>;
  find(search: ISearchUsersDTO): Promise<Users[] | undefined>;
  save(data: Users): Promise<Users>;
  delete(id: string): Promise<void>;
}
