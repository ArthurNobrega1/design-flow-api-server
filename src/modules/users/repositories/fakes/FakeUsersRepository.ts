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
    const newUser = { ...new Users(), ...data, id: uuid() };
    newUser.created_at = parse(timezone(), 'yyyy-MM-dd HH:mm:ss', new Date());
    newUser.updated_at = parse(timezone(), 'yyyy-MM-dd HH:mm:ss', new Date());
    this.users.push(newUser);
    return this.omitPassword(newUser);
  }

  public async delete(id: string): Promise<void> {
    this.users = this.users.filter(existingUser => existingUser.id !== id);
  }

  public async findById(id: string): Promise<Users | null> {
    const foundUser = this.users.find(existingUser => existingUser.id === id);
    return foundUser ? this.omitPassword(foundUser) : null;
  }

  public async find(search: ISearchUsersDTO): Promise<Users[] | undefined> {
    const filtered = this.users.filter(existingUser =>
      Object.entries(search).every(
        ([key, value]) => existingUser[key as keyof Users] === value,
      ),
    );

    if (!filtered.length) return undefined;

    return filtered.map(existingUser => this.omitPassword(existingUser));
  }

  public async save(data: Users): Promise<Users> {
    const updatedUser = {
      ...data,
      updated_at: parse(timezone(), 'yyyy-MM-dd HH:mm:ss', new Date()),
    };

    const index = this.users.findIndex(
      existingUser => existingUser.id === data.id,
    );
    if (index >= 0) {
      this.users[index] = { ...this.users[index], ...updatedUser };
      return this.omitPassword(this.users[index]);
    }

    this.users.push(updatedUser);
    return this.omitPassword(updatedUser);
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
