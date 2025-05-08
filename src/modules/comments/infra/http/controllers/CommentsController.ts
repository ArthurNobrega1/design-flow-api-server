import 'reflect-metadata';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateCommentService from '@modules/comments/services/CreateCommentService';
import UpdateCommentService from '@modules/comments/services/UpdateCommentService';
import ShowCommentsService from '@modules/comments/services/ShowCommentsService';
import DeleteCommentService from '@modules/comments/services/DeleteCommentService';

class CommentsController {
  public async create(request: Request, response: Response): Promise<void> {
    const createCommentService = container.resolve(CreateCommentService);

    const userId = request.user.id;

    const comment = await createCommentService.execute(
      {
        ...request.body,
      },
      userId,
    );

    response.status(201).json(comment);
  }

  public async update(request: Request, response: Response): Promise<void> {
    const updateCommentService = container.resolve(UpdateCommentService);

    const userId = request.user.id;

    const newComment = await updateCommentService.execute(
      {
        ...request.body,
      },
      userId,
    );

    response.status(200).json(newComment);
  }

  public async show(request: Request, response: Response): Promise<void> {
    const showCommentsService = container.resolve(ShowCommentsService);

    const comments = await showCommentsService.execute(request.query);

    response.status(200).json(comments);
  }

  public async delete(request: Request, response: Response): Promise<void> {
    const deleteCommentService = container.resolve(DeleteCommentService);

    const id: string = request.query.id as string;

    const userId = request.user.id;

    const deleted = await deleteCommentService.execute(id, userId);

    response.status(204).json(deleted);
  }
}

export default new CommentsController();
