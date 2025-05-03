import 'dotenv/config';

import AppError from '@shared/errors/AppError';
import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import AuthenticateUserService from './AuthenticateUserService';
import CreateUserService from './CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let createUserService: CreateUserService;
let authenticateUserService: AuthenticateUserService;

describe('AuthenticateUser', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeHashProvider = new FakeHashProvider();
    createUserService = new CreateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
    authenticateUserService = new AuthenticateUserService(
      fakeUsersRepository,
      fakeHashProvider,
    );
  });
  it('should be able to authenticate with email', async () => {
    const user = await createUserService.execute({
      email: 'jhonDoe@gmail.com',
      fullname: 'Jhon Doe',
      password: 'impossiblepass123',
      username: 'jhonDoe001',
      bio: 'just nothing...',
      birthday: new Date('2025-04-04'),
      permission: 'anyone',
    });

    const response = await authenticateUserService.execute({
      email: 'jhonDoe@gmail.com',
      password: 'impossiblepass123',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should be able to authenticate with username', async () => {
    const user = await createUserService.execute({
      email: 'jhonDoe@gmail.com',
      fullname: 'Jhon Doe',
      password: 'impossiblepass123',
      username: 'jhonDoe001',
      bio: 'just nothing...',
      birthday: new Date('2025-04-04'),
      permission: 'anyone',
    });

    const response = await authenticateUserService.execute({
      username: 'jhonDoe001',
      password: 'impossiblepass123',
    });

    expect(response).toHaveProperty('token');
    expect(response.user).toEqual(user);
  });

  it('should not be able to authenticate with non existing user', async () => {
    await expect(
      authenticateUserService.execute({
        username: 'jhonDoe001',
        password: 'impossiblepass123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to authenticate with wrong password', async () => {
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
      authenticateUserService.execute({
        username: 'jhonDoe001',
        password: 'wrong-password',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
