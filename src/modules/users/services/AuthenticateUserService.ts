import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import {
  ICreateSessionRequestDTO,
  ICreateSessionResponseDTO,
} from '../dtos/ISessionsDTO';
import Users from '../infra/typeorm/entities/users';
import IHashProvider from '../providers/HashProvider/models/IHashProvider';

@injectable()
class AuthenticateUserService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('HashProvider')
    private hashProvider: IHashProvider,
  ) {}

  public async execute({
    email,
    username,
    password,
  }: ICreateSessionRequestDTO): Promise<ICreateSessionResponseDTO> {
    let users: Users[] | undefined;

    if (email) {
      users = await this.usersRepository.find({ email });
    } else if (username) {
      users = await this.usersRepository.find({ username });
    }

    if (!users || !users.length) {
      throw new AppError('Verifique o email e a senha', 401);
    }

    const user = users[0];

    if (!user) {
      throw new AppError('Verifique o email e a senha', 401);
    }

    const passwordMatch = await this.hashProvider.compareHash(
      password,
      user.password,
    );

    if (!passwordMatch) {
      throw new AppError('Verifique o email e a senha', 401);
    }

    const { expiresIn, secret } = authConfig.jwt;

    if (!secret) {
      throw new AppError('A chave secreta (secret) não foi definida ', 500);
    }

    type Unit =
      | 'Years'
      | 'Year'
      | 'Yrs'
      | 'Yr'
      | 'Y'
      | 'Weeks'
      | 'Week'
      | 'W'
      | 'Days'
      | 'Day'
      | 'D'
      | 'Hours'
      | 'Hour'
      | 'Hrs'
      | 'Hr'
      | 'H'
      | 'Minutes'
      | 'Minute'
      | 'Mins'
      | 'Min'
      | 'M'
      | 'Seconds'
      | 'Second'
      | 'Secs'
      | 'Sec'
      | 's'
      | 'Milliseconds'
      | 'Millisecond'
      | 'Msecs'
      | 'Msec'
      | 'Ms';

    type UnitAnyCase = Unit | Uppercase<Unit> | Lowercase<Unit>;
    type StringValue =
      | `${number}`
      | `${number}${UnitAnyCase}`
      | `${number} ${UnitAnyCase}`;

    const token = sign({}, secret, {
      subject: user.id,
      expiresIn: expiresIn as StringValue,
    });

    return { user, token };
  }
}

export default AuthenticateUserService;
