import AppError from '@shared/errors/AppError';
import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakePostsRepository from '@modules/posts/repositories/fakes/FakePostsRepository';
import FakeCommentsRepository from '@modules/comments/repositories/fakes/FakeCommentsRepository';
import FakeLikesRepository from '../repositories/fakes/FakeLikesRepository';
import CreateLikeService from './CreateLikeService';

let fakeLikesRepository: FakeLikesRepository;
let fakeCommentsRepository: FakeCommentsRepository;
let fakeUsersRepository: FakeUsersRepository;
let fakePostsRepository: FakePostsRepository;
let createLikeService: CreateLikeService;

describe('CreateLike', () => {
  beforeEach(() => {
    fakeCommentsRepository = new FakeCommentsRepository();
    fakeUsersRepository = new FakeUsersRepository();
    fakePostsRepository = new FakePostsRepository();
    fakeLikesRepository = new FakeLikesRepository();

    createLikeService = new CreateLikeService(
      fakeLikesRepository,
      fakeUsersRepository,
      fakePostsRepository,
      fakeCommentsRepository,
    );
  });
  it('should be able to like a post', async () => {
    const user = await fakeUsersRepository.create({
      email: 'jhonDoe@gmail.com',
      fullname: 'Jhon Doe',
      password: 'impossiblepass123',
      username: 'jhonDoe001',
      bio: 'just nothing...',
      birthday: new Date('2025-04-04'),
      permission: 'anyone',
    });

    const post = await fakePostsRepository.create({
      title: 'First post',
      user_id: user.id,
    });

    const like = await createLikeService.execute(
      {
        post_id: post.id,
      },
      user.id,
    );

    expect(like).toHaveProperty('id');
  });

  it('should be able to like a comment', async () => {
    const user = await fakeUsersRepository.create({
      email: 'jhonDoe@gmail.com',
      fullname: 'Jhon Doe',
      password: 'impossiblepass123',
      username: 'jhonDoe001',
      bio: 'just nothing...',
      birthday: new Date('2025-04-04'),
      permission: 'anyone',
    });

    const post = await fakePostsRepository.create({
      title: 'First post',
      user_id: user.id,
    });

    const comment = await fakeCommentsRepository.create({
      content: 'first',
      post_id: post.id,
      user_id: user.id,
    });

    const like = await createLikeService.execute(
      {
        comment_id: comment.id,
      },
      user.id,
    );

    expect(like).toHaveProperty('id');
  });

  it('should not be able to like a post with an invalid user_id', async () => {
    const user = await fakeUsersRepository.create({
      email: 'jhonDoe@gmail.com',
      fullname: 'Jhon Doe',
      password: 'impossiblepass123',
      username: 'jhonDoe001',
      bio: 'just nothing...',
      birthday: new Date('2025-04-04'),
      permission: 'anyone',
    });

    const post = await fakePostsRepository.create({
      title: 'First post',
      user_id: user.id,
    });

    await expect(
      createLikeService.execute(
        {
          post_id: post.id,
        },
        'non - existent',
      ),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to like a comment with an invalid user_id', async () => {
    const user = await fakeUsersRepository.create({
      email: 'jhonDoe@gmail.com',
      fullname: 'Jhon Doe',
      password: 'impossiblepass123',
      username: 'jhonDoe001',
      bio: 'just nothing...',
      birthday: new Date('2025-04-04'),
      permission: 'anyone',
    });

    const post = await fakePostsRepository.create({
      title: 'First post',
      user_id: user.id,
    });

    const comment = await fakeCommentsRepository.create({
      content: 'first',
      post_id: post.id,
      user_id: user.id,
    });

    await expect(
      createLikeService.execute(
        {
          comment_id: comment.id,
        },
        'non - existent',
      ),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to like an invalid post', async () => {
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
      createLikeService.execute({ post_id: 'non-existent' }, user.id),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to like an invalid comment', async () => {
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
      createLikeService.execute(
        {
          comment_id: 'non-existent',
        },
        user.id,
      ),
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to like without post_id and comment_id', async () => {
    const user = await fakeUsersRepository.create({
      email: 'jhonDoe@gmail.com',
      fullname: 'Jhon Doe',
      password: 'impossiblepass123',
      username: 'jhonDoe001',
      bio: 'just nothing...',
      birthday: new Date('2025-04-04'),
      permission: 'anyone',
    });
    await expect(createLikeService.execute({}, user.id)).rejects.toBeInstanceOf(
      AppError,
    );
  });
});
