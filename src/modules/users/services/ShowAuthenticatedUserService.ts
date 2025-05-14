import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import Users from '../infra/typeorm/entities/users';

@injectable()
class ShowAuthenticatedUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(userId: string): Promise<Users> {
    const users = await this.usersRepository.find({ id: userId });

    if (!users?.length) {
      throw new AppError('Usuário não encontrado.', 404);
    }

    const user = users[0];

    return user;
  }
}

export default ShowAuthenticatedUserService;
