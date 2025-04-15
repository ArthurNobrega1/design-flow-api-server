import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';

@injectable()
class DeleteUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    const item = await this.usersRepository.findById(id);

    if (!item) {
      throw new AppError('Usuário não encontrado', 400);
    }

    return this.usersRepository.delete(id);
  }
}

export default DeleteUserService;
