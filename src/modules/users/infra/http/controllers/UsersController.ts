import 'reflect-metadata';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateUserService from '@modules/users/services/CreateUserService';
import UpdateUserService from '@modules/users/services/UpdateUserService';
import ShowUsersService from '@modules/users/services/ShowUsersService';
import DeleteUserService from '@modules/users/services/DeleteUserService';

class UsersController {
  public async create(request: Request, response: Response): Promise<void> {
    const createUserService = container.resolve(CreateUserService);

    const user = await createUserService.execute({
      ...request.body,
    });

    response.status(201).json(user);
  }

  public async update(request: Request, response: Response): Promise<void> {
    const updateUserService = container.resolve(UpdateUserService);

    const userId = request.user.id;

    const newUser = await updateUserService.execute(
      {
        ...request.body,
      },
      userId,
    );

    response.status(200).json(newUser);
  }

  public async show(request: Request, response: Response): Promise<void> {
    const showUsersService = container.resolve(ShowUsersService);

    const users = await showUsersService.execute(request.query);

    response.status(200).json(users);
  }

  public async delete(request: Request, response: Response): Promise<void> {
    const deleteUserService = container.resolve(DeleteUserService);

    const id: string = request.query.id as string;

    const userId = request.user.id;

    const deleted = await deleteUserService.execute(id, userId);

    response.status(204).json(deleted);
  }
}

export default new UsersController();
