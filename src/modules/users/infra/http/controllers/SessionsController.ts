import 'reflect-metadata';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AuthenticateUserService from '@modules/users/services/AuthenticateUserService';

class SessionsController {
  public async create(request: Request, response: Response): Promise<void> {
    const sessionsService = container.resolve(AuthenticateUserService);

    const { user, token } = await sessionsService.execute(request.body);

    response.status(201).json({ user, token });
  }
}

export default new SessionsController();
