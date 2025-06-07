import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeFollowsRepository from '../repositories/fakes/FakeFollowsRepository';
import CreateFollowService from './CreateFollowService';

let fakeFollowsRepository: FakeFollowsRepository;
let fakeUsersRepository: FakeUsersRepository;
let createFollowService: CreateFollowService;

describe('CreateFollow', () => {
  beforeEach(() => {
    fakeFollowsRepository = new FakeFollowsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    createFollowService = new CreateFollowService(
      fakeFollowsRepository,
      fakeUsersRepository,
    );
  });
  it('should be able to follow', async () => {
    const follower = await fakeUsersRepository.create({
      email: 'jhonDoe@gmail.com',
      fullname: 'Jhon Doe',
      password: 'impossiblepass123',
      username: 'jhonDoe001',
      bio: 'just nothing...',
      birthday: new Date('2025-04-04'),
    });
    const following = await fakeUsersRepository.create({
      email: 'jhonTre@gmail.com',
      fullname: 'Jhon Tre',
      password: 'impossiblepass321',
      username: 'jhonTre100',
      bio: 'just nothing too...',
      birthday: new Date('2025-04-04'),
    });
    const follow = await createFollowService.execute(
      {
        following_id: following.id,
      },
      follower.id,
    );

    expect(follow).toHaveProperty('id');
  });

  it('should not be able to follow yourself', async () => {
    const user = await fakeUsersRepository.create({
      email: 'jhonDoe@gmail.com',
      fullname: 'Jhon Doe',
      password: 'impossiblepass123',
      username: 'jhonDoe001',
      bio: 'just nothing...',
      birthday: new Date('2025-04-04'),
    });

    await expect(
      createFollowService.execute(
        {
          following_id: user.id,
        },
        user.id,
      ),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to follow with an invalid follower_id', async () => {
    const user = await fakeUsersRepository.create({
      email: 'jhonDoe@gmail.com',
      fullname: 'Jhon Doe',
      password: 'impossiblepass123',
      username: 'jhonDoe001',
      bio: 'just nothing...',
      birthday: new Date('2025-04-04'),
    });

    await expect(
      createFollowService.execute(
        {
          following_id: user.id,
        },
        'non-existent',
      ),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to follow with an invalid following_id', async () => {
    const user = await fakeUsersRepository.create({
      email: 'jhonDoe@gmail.com',
      fullname: 'Jhon Doe',
      password: 'impossiblepass123',
      username: 'jhonDoe001',
      bio: 'just nothing...',
      birthday: new Date('2025-04-04'),
    });

    await expect(
      createFollowService.execute(
        {
          following_id: 'non-existent',
        },
        user.id,
      ),
    ).rejects.toBeInstanceOf(AppError);
  });
});
