import timezone from '@shared/utils/timezone';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import Users from '@modules/users/infra/typeorm/entities/users';
import ISearchUsersDTO from '@modules/users/dtos/ISearchUsersDTO';
import { parse } from 'date-fns';
import { uuid } from 'uuidv4';

class FakeUsersRepository implements IUsersRepository {
  private users: Users[] = [];

  public async create(data: ICreateUserDTO): Promise<Users> {
    const user = { ...new Users(), ...data, id: uuid() };
    user.created_at = parse(timezone(), 'yyyy-MM-dd HH:mm:ss', new Date());
    user.updated_at = parse(timezone(), 'yyyy-MM-dd HH:mm:ss', new Date());
    this.users.push(user);
    return user;
  }

  public async delete(id: string): Promise<void> {
    this.users = this.users.filter(user => user.id !== id);
  }

  public async findById(id: string): Promise<Users | null> {
    const userFiltered = this.users.find(user => user.id === id);
    if (!userFiltered) {
      return null;
    }
    return userFiltered;
  }

  public async find(search: ISearchUsersDTO): Promise<Users[] | undefined> {
    const usersFiltered = this.users.filter(user =>
      Object.entries(search).every(
        ([key, value]) => user[key as keyof Users] === value,
      ),
    );

    return usersFiltered.length ? usersFiltered : undefined;
  }

  public async save(data: Users): Promise<Users> {
    const userFiltered = {
      ...(this.users.find(user => user.id === data.id) as Users),
      ...data,
    };
    userFiltered.updated_at = parse(
      timezone(),
      'yyyy-MM-dd HH:mm:ss',
      new Date(),
    );
    this.users.push(userFiltered);
    return userFiltered;
  }
}

export default FakeUsersRepository;
