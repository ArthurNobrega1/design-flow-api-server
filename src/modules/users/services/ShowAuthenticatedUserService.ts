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
    const user = await this.usersRepository.findById(userId);

    if (!user) {
      throw new AppError('Usuário não encontrado.', 404);
    }

    return user;
  }
}

export default ShowAuthenticatedUserService;
