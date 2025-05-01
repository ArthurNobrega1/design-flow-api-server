import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import authConfig from '@config/auth';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import {
  ICreateSessionRequestDTO,
  ICreateSessionResponseDTO,
} from '../dtos/ISessionsDTO';
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
    const user = await this.usersRepository.findWithPassword({
      email,
      username,
    });

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

    const userWithoutPassword = { ...user };
    delete (userWithoutPassword as { password?: string }).password;

    return { user: userWithoutPassword, token };
  }
}

export default AuthenticateUserService;
