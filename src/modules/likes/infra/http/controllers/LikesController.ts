import 'reflect-metadata';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateLikeService from '@modules/likes/services/CreateLikeService';
import UpdateLikeService from '@modules/likes/services/UpdateLikeService';
import ShowLikesService from '@modules/likes/services/ShowLikesService';
import DeleteLikeService from '@modules/likes/services/DeleteLikeService';

class LikesController {
  public async create(request: Request, response: Response): Promise<void> {
    const createLikeService = container.resolve(CreateLikeService);

    const userId = request.user.id;

    const like = await createLikeService.execute(
      {
        ...request.body,
      },
      userId,
    );

    response.status(201).json(like);
  }

  public async update(request: Request, response: Response): Promise<void> {
    const updateLikeService = container.resolve(UpdateLikeService);

    const userId = request.user.id;

    const newLike = await updateLikeService.execute(
      {
        ...request.body,
      },
      userId,
    );

    response.status(200).json(newLike);
  }

  public async show(request: Request, response: Response): Promise<void> {
    const showLikesService = container.resolve(ShowLikesService);

    const likes = await showLikesService.execute(request.query);

    response.status(200).json(likes);
  }

  public async delete(request: Request, response: Response): Promise<void> {
    const deleteLikeService = container.resolve(DeleteLikeService);

    const id: string = request.query.id as string;

    const userId = request.user.id;

    const deleted = await deleteLikeService.execute(id, userId);

    response.status(204).json(deleted);
  }
}

export default new LikesController();
