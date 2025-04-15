import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import Users from '../infra/typeorm/entities/users';
import IUpdateUserDTO from '../dtos/IUpdateUserDTO';

@injectable()
class UpdateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(data: IUpdateUserDTO): Promise<Users> {
    const item = await this.usersRepository.findById(data.id);

    if (!item) {
      throw new AppError('Usuário não encontrado', 400);
    }

    if (data.email) {
      const email = await this.usersRepository.find({ email: data.email });
      if (email && email.length) {
        throw new AppError('Email já registrado', 400);
      }
    }

    if (data.username) {
      const username = await this.usersRepository.find({
        username: data.username,
      });
      if (username && username.length) {
        throw new AppError('Nomde de usuário já registrado', 400);
      }
    }

    const updated = Object.assign(item, data);

    return this.usersRepository.save(updated);
  }
}

export default UpdateUserService;
