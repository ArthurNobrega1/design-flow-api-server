import nodemailer, { Transporter } from 'nodemailer';
import { inject, injectable } from 'tsyringe';
import IMailTemplateProvider from '@shared/providers/MailTemplateProvider/models/IMailTemplateProvider';
import IMailProvider from '../models/IMailProvider';
import ISendMailDTO from '../dtos/ISendMailDTO';

@injectable()
class BrevoMailProvider implements IMailProvider {
  private client: Transporter;

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider,
  ) {
    this.client = nodemailer.createTransport({
      host: 'smtp-relay.sendinblue.com',
      port: 587,
      secure: false,
      auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_PASS,
      },
    });
  }

  public async sendMail(data: ISendMailDTO): Promise<void> {
    await this.client.sendMail({
      from: {
        name: data.from?.name || 'Design Flow',
        address: data.from?.email || 'brunoraraujo02@gmail.com',
      },
      to: {
        name: data.to.name,
        address: data.to.email,
      },
      subject: data.subject,
      html: await this.mailTemplateProvider.parse(data.templateData),
    });
  }
}

export default BrevoMailProvider;
