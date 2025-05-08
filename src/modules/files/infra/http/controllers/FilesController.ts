import 'reflect-metadata';
import { Request, Response } from 'express';
import { container } from 'tsyringe';
import CreateFilesService from '@modules/files/services/CreateFilesService';
import ShowFilesService from '@modules/files/services/ShowFilesService';
import DeleteFileService from '@modules/files/services/DeleteFileService';
import UpdateFileService from '@modules/files/services/UpdateFileService';

class FilesController {
  public async create(request: Request, response: Response): Promise<void> {
    const createFilesService = container.resolve(CreateFilesService);

    const userId = request.user.id;

    const files = await createFilesService.execute(
      request.body,
      userId,
      request.files,
    );

    response.status(201).json(files);
  }

  public async update(request: Request, response: Response): Promise<void> {
    const updateFileService = container.resolve(UpdateFileService);

    const userId = request.user.id;

    const newFile = await updateFileService.execute(
      {
        ...request.body,
      },
      userId,
    );

    response.status(200).json(newFile);
  }

  public async show(request: Request, response: Response): Promise<void> {
    const showFilesService = container.resolve(ShowFilesService);

    const files = await showFilesService.execute(request.query);

    response.status(200).json(files);
  }

  public async delete(request: Request, response: Response): Promise<void> {
    const deleteFileService = container.resolve(DeleteFileService);

    const id: string = request.query.id as string;

    const userId = request.user.id;

    const deleted = await deleteFileService.execute(id, userId);

    response.status(204).json(deleted);
  }
}

export default new FilesController();
