import AppError from '@shared/errors/AppError';
import FakeStorageProvider from '@shared/providers/StorageProvider/fakes/FakeStorageProvider';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeFilesRepository from '../repositories/fakes/FakeFilesRepository';

import CreateFileService from './CreateFilesService';

let fakeFilesRepository: FakeFilesRepository;
let fakeStorageProvider: FakeStorageProvider;
let fakeUsersRepository: FakeUsersRepository;
let createFileService: CreateFileService;

describe('CreateFilesService', () => {
  beforeEach(() => {
    fakeFilesRepository = new FakeFilesRepository();
    fakeStorageProvider = new FakeStorageProvider();
    fakeUsersRepository = new FakeUsersRepository();

    createFileService = new CreateFileService(
      fakeFilesRepository,
      fakeStorageProvider,
      fakeUsersRepository,
    );
  });

  it('should be able to create a new file associated with a user', async () => {
    const user = await fakeUsersRepository.create({
      email: 'jhonDoe@gmail.com',
      fullname: 'Jhon Doe',
      password: 'impossiblepass123',
      username: 'jhonDoe001',
      bio: 'just nothing...',
      birthday: new Date('2025-04-04'),
      permission: 'anyone',
    });

    const files = await createFileService.execute(
      { user_id: user.id, path: 'images/me' },
      [
        {
          filename: 'me.jpg',
          originalname: 'me.jpg',
          mimetype: 'image/jpeg',
          path: 'images/me',
        },
      ],
    );

    expect(files).toHaveLength(1);
    expect(files[0]).toHaveProperty('id');
  });

  it('should not be able to create a file if no files are sent', async () => {
    const user = await fakeUsersRepository.create({
      email: 'jhonDoe@gmail.com',
      fullname: 'Jhon Doe',
      password: 'impossiblepass123',
      username: 'jhonDoe001',
      bio: 'just nothing...',
      birthday: new Date('2025-04-04'),
      permission: 'anyone',
    });

    await expect(
      createFileService.execute(
        { user_id: user.id, path: 'images/me' },
        undefined,
      ),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a file if empty array of files are sent', async () => {
    const user = await fakeUsersRepository.create({
      email: 'jhonDoe@gmail.com',
      fullname: 'Jhon Doe',
      password: 'impossiblepass123',
      username: 'jhonDoe001',
      bio: 'just nothing...',
      birthday: new Date('2025-04-04'),
      permission: 'anyone',
    });

    await expect(
      createFileService.execute({ user_id: user.id, path: 'images/me' }, []),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a file with an invalid user_id', async () => {
    await expect(
      createFileService.execute(
        { user_id: 'non-existent', path: 'images/me' },
        [
          {
            filename: 'me.jpg',
            originalname: 'me.jpg',
            mimetype: 'image/jpeg',
            path: 'images/me',
          },
        ],
      ),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a file without user_id', async () => {
    await expect(
      createFileService.execute({ path: 'images/no-owner' }, [
        {
          filename: 'no-owner.jpg',
          originalname: 'no-owner.jpg',
          mimetype: 'image/jpeg',
          path: 'images/no-owner',
        },
      ]),
    ).rejects.toBeInstanceOf(AppError);
  });
});
