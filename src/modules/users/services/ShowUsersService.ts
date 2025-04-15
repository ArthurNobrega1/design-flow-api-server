import { inject, injectable } from 'tsyringe';

import IUsersRepository from '../repositories/IUsersRepository';
import Users from '../infra/typeorm/entities/users';
import ISearchUsersDTO from '../dtos/ISearchUsersDTO';

@injectable()
class ShowUsersService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(query: ISearchUsersDTO): Promise<Users[] | undefined> {
    const result = await this.usersRepository.find(query);
    return result;
  }
}

export default ShowUsersService;
