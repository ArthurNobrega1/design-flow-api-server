import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import Users from '../infra/typeorm/entities/users';
import ICreateUserDTO from '../dtos/ICreateUserDTO';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

@injectable()
class CreateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute(data: ICreateUserDTO): Promise<Users> {
    const emailRegex = /\S+@\S+\.\S+/;
    if (!emailRegex.test(data.email)) {
      throw new AppError('Email inválido', 400);
    }

    if (data.password.toString().length < 3) {
      throw new AppError('A senha deve ter no mínimo 3 caracteres', 400);
    }

    const usersSameEmail = await this.usersRepository.find({
      email: data.email,
    });
    if (usersSameEmail?.length && usersSameEmail[0].active) {
      throw new AppError('Email já registrado', 400);
    }

    const usersSameUsername = await this.usersRepository.find({
      username: data.username,
    });
    if (usersSameUsername?.length && usersSameUsername[0].active) {
      throw new AppError('Nome de usuário já registrado', 400);
    }

    const hashedPassword = await this.hashProvider.generateHash(
      data.password.toString(),
    );

    const created = Object.assign(data, { password: hashedPassword });
    return this.usersRepository.create(created);
  }
}

export default CreateUserService;
