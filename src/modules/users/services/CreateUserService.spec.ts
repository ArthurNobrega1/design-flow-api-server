import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import CreateUserService from './CreateUserService';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUserService: CreateUserService;

describe('CreateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });
  it('should be able to create a new user', async () => {
    const user = await createUserService.execute({
      email: 'jhonDoe@gmail.com',
      fullname: 'Jhon Doe',
      password: 'impossiblepass123',
      username: 'jhonDoe001',
      bio: 'just nothing...',
      birthday: new Date('2025-04-04'),
      permission: 'anyone',
    });

    expect(user).toHaveProperty('id');
  });

  it('should not be able to create two users with the same email', async () => {
    await createUserService.execute({
      email: 'jhonDoe@gmail.com',
      fullname: 'Jhon Doe',
      password: 'impossiblepass123',
      username: 'jhonDoe001',
      bio: 'just nothing...',
      birthday: new Date('2025-04-04'),
      permission: 'anyone',
    });

    await expect(
      createUserService.execute({
        email: 'jhonDoe@gmail.com',
        fullname: 'Jhon Tre',
        password: 'impossiblepass321',
        username: 'jhonTre100',
        bio: 'just nothing too...',
        birthday: new Date('2025-04-04'),
        permission: 'anyone',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create two users with the same username', async () => {
    await createUserService.execute({
      email: 'jhonDoe@gmail.com',
      fullname: 'Jhon Doe',
      password: 'impossiblepass123',
      username: 'jhonDoe001',
      bio: 'just nothing...',
      birthday: new Date('2025-04-04'),
      permission: 'anyone',
    });

    await expect(
      createUserService.execute({
        email: 'jhonTre@gmail.com',
        fullname: 'Jhon Tre',
        password: 'impossiblepass321',
        username: 'jhonDoe001',
        bio: 'just nothing too...',
        birthday: new Date('2025-04-04'),
        permission: 'anyone',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a user with invalid email', async () => {
    await expect(
      createUserService.execute({
        email: 'jhonDoe@notemail',
        fullname: 'Jhon Doe',
        password: 'impossiblepass123',
        username: 'jhonDoe001',
        bio: 'just nothing...',
        birthday: new Date('2025-04-04'),
        permission: 'anyone',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a user with a password shorter than 3 characters', async () => {
    await expect(
      createUserService.execute({
        email: 'jhonDoe@gmail.com',
        fullname: 'Jhon Doe',
        password: '12',
        username: 'jhonDoe001',
        bio: 'just nothing...',
        birthday: new Date('2025-04-04'),
        permission: 'anyone',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
