import 'reflect-metadata';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ResetPasswordService from '@modules/users/services/ResetPasswordService';

class ResetPasswordController {
  public async create(request: Request, response: Response): Promise<void> {
    const resetPasswordService = container.resolve(ResetPasswordService);

    await resetPasswordService.execute(request.body);

    response.status(204).json();
  }
}

export default new ResetPasswordController();
