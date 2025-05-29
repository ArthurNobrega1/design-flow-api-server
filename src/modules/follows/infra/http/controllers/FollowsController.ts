import 'reflect-metadata';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateFollowService from '@modules/follows/services/CreateFollowService';
import UpdateFollowService from '@modules/follows/services/UpdateFollowService';
import ShowFollowsService from '@modules/follows/services/ShowFollowsService';
import DeleteFollowService from '@modules/follows/services/DeleteFollowService';

class FollowsController {
  public async create(request: Request, response: Response): Promise<void> {
    const createFollowService = container.resolve(CreateFollowService);

    const followerId = request.user.id;

    const follow = await createFollowService.execute(
      {
        ...request.body,
      },
      followerId,
    );

    response.status(201).json(follow);
  }

  public async update(request: Request, response: Response): Promise<void> {
    const updateFollowService = container.resolve(UpdateFollowService);

    const userId = request.user.id;

    const newFollow = await updateFollowService.execute(
      {
        ...request.body,
      },
      userId,
    );

    response.status(200).json(newFollow);
  }

  public async show(request: Request, response: Response): Promise<void> {
    const showFollowsService = container.resolve(ShowFollowsService);

    const follows = await showFollowsService.execute(request.query);

    response.status(200).json(follows);
  }

  public async delete(request: Request, response: Response): Promise<void> {
    const deleteFollowService = container.resolve(DeleteFollowService);

    const id: string = request.query.id as string;

    const followerId = request.user.id;

    const deleted = await deleteFollowService.execute(id, followerId);

    response.status(204).json(deleted);
  }
}

export default new FollowsController();
