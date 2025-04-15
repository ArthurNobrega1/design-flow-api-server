import { Request, Response } from 'express';

export default class IndexController {
  public show(request: Request, response: Response) {
    response.status(200).json({ message: 'Olá!' });
  }
}
