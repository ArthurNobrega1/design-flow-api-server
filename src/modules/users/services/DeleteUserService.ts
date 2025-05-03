import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';

@injectable()
class DeleteUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,
  ) {}

  public async execute(id: string): Promise<void> {
    const itens = await this.usersRepository.find({ id });

    if (!itens || !itens.length) {
      throw new AppError('Usuário não encontrado', 404);
    }

    const item = itens[0];

    item.user_tokens.map(userToken =>
      this.userTokensRepository.delete(userToken.id),
    );

    return this.usersRepository.delete(id);
  }
}

export default DeleteUserService;
