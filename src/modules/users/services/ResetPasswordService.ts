import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import timezone from '@shared/utils/timezone';
import { addHours, isAfter } from 'date-fns';
import IUsersRepository from '../repositories/IUsersRepository';
import IUserTokensRepository from '../repositories/IUserTokensRepository';
import IResetPasswordDTO from '../dtos/IResetPasswordDTO';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

@injectable()
class ResetPasswordService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute(data: IResetPasswordDTO): Promise<void> {
    const userToken = await this.userTokensRepository.findByToken(data.token);

    if (data.password.toString().length < 3) {
      throw new AppError('A senha deve ter no mínimo 3 caracteres', 400);
    }

    if (!userToken || !userToken.active) {
      throw new AppError('Token expirado', 401);
    }

    const user = await this.usersRepository.findById(userToken.user_id);

    if (!user) {
      throw new AppError('Usuário não encontrado', 404);
    }

    const tokenCreatedAt = userToken.created_at;
    const compareDate = addHours(tokenCreatedAt, 2);

    if (isAfter(timezone(), compareDate)) {
      await this.userTokensRepository.save({
        ...userToken,
        active: false,
      });
      throw new AppError('Token expirado', 401);
    }

    user.password = await this.hashProvider.generateHash(data.password);

    await this.usersRepository.save(user);

    await this.userTokensRepository.save({
      ...userToken,
      active: false,
    });
  }
}

export default ResetPasswordService;
