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
    return this.omitPassword(user);
  }

  public async delete(id: string): Promise<void> {
    this.users = this.users.filter(user => user.id !== id);
  }

  public async findById(id: string): Promise<Users | null> {
    const userFiltered = this.users.find(user => user.id === id);
    if (!userFiltered) {
      return null;
    }

    return this.omitPassword(userFiltered);
  }

  public async find(search: ISearchUsersDTO): Promise<Users[] | undefined> {
    const userFiltered = this.users.filter(user =>
      Object.entries(search).every(
        ([key, value]) => user[key as keyof Users] === value,
      ),
    );

    return userFiltered.length
      ? userFiltered.map(existingUser => this.omitPassword(existingUser))
      : undefined;
  }

  public async save(data: Users): Promise<Users> {
    const index = this.users.findIndex(user => user.id === data.id);

    const updatedUser = {
      ...(index >= 0 ? this.users[index] : {}),
      ...data,
      updated_at: parse(timezone(), 'yyyy-MM-dd HH:mm:ss', new Date()),
    };

    if (index >= 0) {
      this.users[index] = updatedUser;
    } else {
      this.users.push(updatedUser);
    }

    return updatedUser;
  }

  public async findWithPassword({
    email,
    username,
  }: {
    email?: string;
    username?: string;
  }): Promise<Users | null> {
    const foundUser = this.users.find(
      existingUser =>
        (email && existingUser.email === email) ||
        (username && existingUser.username === username),
    );

    return foundUser || null;
  }

  private omitPassword(user: Users): Users {
    const userCopy = { ...user };
    delete (userCopy as { password?: string }).password;
    return userCopy;
  }
}

export default FakeUsersRepository;
