import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakePostsRepository from '@modules/posts/repositories/fakes/FakePostsRepository';
import FakeCommentsRepository from '../repositories/fakes/FakeCommentsRepository';
import CreateCommentService from './CreateCommentService';

let fakeCommentsRepository: FakeCommentsRepository;
let fakeUsersRepository: FakeUsersRepository;
let fakePostsRepository: FakePostsRepository;
let createCommentService: CreateCommentService;

describe('CreateComment', () => {
  beforeEach(() => {
    fakeCommentsRepository = new FakeCommentsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    fakePostsRepository = new FakePostsRepository();
    createCommentService = new CreateCommentService(
      fakeCommentsRepository,
      fakeUsersRepository,
      fakePostsRepository,
    );
  });
  it('should be able to create a comment', async () => {
    const user = await fakeUsersRepository.create({
      email: 'jhonDoe@gmail.com',
      fullname: 'Jhon Doe',
      password: 'impossiblepass123',
      username: 'jhonDoe001',
      bio: 'just nothing...',
      birthday: new Date('2025-04-04'),
    });

    const post = await fakePostsRepository.create({
      title: 'First post',
      user_id: user.id,
    });

    const comment = await createCommentService.execute(
      {
        content: 'first',
        post_id: post.id,
      },
      user.id,
    );

    expect(comment).toHaveProperty('id');
  });

  it('should not be able to create a post with an invalid user_id', async () => {
    const user = await fakeUsersRepository.create({
      email: 'jhonDoe@gmail.com',
      fullname: 'Jhon Doe',
      password: 'impossiblepass123',
      username: 'jhonDoe001',
      bio: 'just nothing...',
      birthday: new Date('2025-04-04'),
    });

    const post = await fakePostsRepository.create({
      title: 'First post',
      user_id: user.id,
    });

    await expect(
      createCommentService.execute(
        {
          content: 'second',
          post_id: post.id,
        },
        'non-existent-id',
      ),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a post with an invalid post_id', async () => {
    const user = await fakeUsersRepository.create({
      email: 'jhonDoe@gmail.com',
      fullname: 'Jhon Doe',
      password: 'impossiblepass123',
      username: 'jhonDoe001',
      bio: 'just nothing...',
      birthday: new Date('2025-04-04'),
    });

    await expect(
      createCommentService.execute(
        {
          content: 'third',
          post_id: 'non-existent',
        },
        user.id,
      ),
    ).rejects.toBeInstanceOf(AppError);
  });
});
