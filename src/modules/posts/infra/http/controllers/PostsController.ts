import 'reflect-metadata';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreatePostService from '@modules/posts/services/CreatePostService';
import UpdatePostService from '@modules/posts/services/UpdatePostService';
import ShowPostsService from '@modules/posts/services/ShowPostsService';
import DeletePostService from '@modules/posts/services/DeletePostService';

class PostsController {
  public async create(request: Request, response: Response): Promise<void> {
    const createPostService = container.resolve(CreatePostService);

    const userId = request.user.id;

    const post = await createPostService.execute(
      {
        ...request.body,
      },
      userId,
    );

    response.status(201).json(post);
  }

  public async update(request: Request, response: Response): Promise<void> {
    const updatePostService = container.resolve(UpdatePostService);

    const userId = request.user.id;

    const newPost = await updatePostService.execute(
      {
        ...request.body,
      },
      userId,
    );

    response.status(200).json(newPost);
  }

  public async show(request: Request, response: Response): Promise<void> {
    const showPostsService = container.resolve(ShowPostsService);

    const posts = await showPostsService.execute(request.query);

    response.status(200).json(posts);
  }

  public async delete(request: Request, response: Response): Promise<void> {
    const deletePostService = container.resolve(DeletePostService);

    const id: string = request.query.id as string;

    const userId = request.user.id;

    const deleted = await deletePostService.execute(id, userId);

    response.status(204).json(deleted);
  }
}

export default new PostsController();
