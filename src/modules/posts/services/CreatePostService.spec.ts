import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import AppError from '@shared/errors/AppError';
import FakePostsRepository from '../repositories/fakes/FakePostsRepository';
import CreatePostService from './CreatePostService';

let fakePostsRepository: FakePostsRepository;
let fakeUsersRepository: FakeUsersRepository;
let createPostService: CreatePostService;

describe('CreatePost', () => {
  beforeEach(() => {
    fakePostsRepository = new FakePostsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    createPostService = new CreatePostService(
      fakePostsRepository,
      fakeUsersRepository,
    );
  });
  it('should be able to create a post', async () => {
    const user = await fakeUsersRepository.create({
      email: 'jhonDoe@gmail.com',
      fullname: 'Jhon Doe',
      password: 'impossiblepass123',
      username: 'jhonDoe001',
      bio: 'just nothing...',
      birthday: new Date('2025-04-04'),
    });

    const post = await createPostService.execute(
      {
        title: 'First post',
      },
      user.id,
    );

    expect(post).toHaveProperty('id');
  });

  it('should not be able to create a post with an invalid user_id', async () => {
    await expect(
      createPostService.execute(
        {
          title: 'First post',
        },
        'non-existent-id',
      ),
    ).rejects.toBeInstanceOf(AppError);
  });
});
