import { inject, injectable } from 'tsyringe';

import path from 'path';
import IMailProvider from '@shared/providers/MailProvider/models/IMailProvider';
import AppError from '@shared/errors/AppError';
import IUsersRepository from '../repositories/IUsersRepository';
import ISendForgotPasswordEmailDTO from '../dtos/ISendForgotPasswordEmailDTO';
import IUserTokensRepository from '../repositories/IUserTokensRepository';

@injectable()
class SendForgotPasswordEmailService {
  constructor(
    @inject('UsersRepository')
    private usersRepository: IUsersRepository,

    @inject('MailProvider')
    private mailProvider: IMailProvider,

    @inject('UserTokensRepository')
    private userTokensRepository: IUserTokensRepository,
  ) {}

  public async execute(data: ISendForgotPasswordEmailDTO): Promise<void> {
    const users = await this.usersRepository.find({ email: data.email });

    if (!users || !users.length) {
      throw new AppError('Usuário não encontrado', 404);
    }

    const user = users[0];

    const { token } = await this.userTokensRepository.generate(user.id);

    const forgotPasswordTemplate = path.resolve(
      __dirname,
      '..',
      'views',
      'forgot_password.hbs',
    );

    await this.mailProvider.sendMail({
      to: { name: user.fullname, email: user.email },
      subject: 'Recuperação de senha - Design Flow',
      templateData: {
        file: forgotPasswordTemplate,
        variables: {
          name: user.fullname,
          link: `https://localhost:3000/reset-password?token=${token}`,
        },
      },
    });
  }
}

export default SendForgotPasswordEmailService;
