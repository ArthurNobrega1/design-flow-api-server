import AppError from '@shared/errors/AppError';
import * as timezoneUtil from '@shared/utils/timezone';
import { format, toZonedTime } from 'date-fns-tz';

import FakeHashProvider from '../providers/HashProvider/fakes/FakeHashProvider';
import FakeUsersRepository from '../repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '../repositories/fakes/FakeUserTokensRepository';
import ResetPasswordService from './ResetPasswordService';

let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeHashProvider: FakeHashProvider;
let resetPasswordService: ResetPasswordService;

describe('ResetPasswordEmail', () => {
  beforeEach(() => {
    fakeUsersRepository = new FakeUsersRepository();
    fakeUserTokensRepository = new FakeUserTokensRepository();
    fakeHashProvider = new FakeHashProvider();
    resetPasswordService = new ResetPasswordService(
      fakeUsersRepository,
      fakeUserTokensRepository,
      fakeHashProvider,
    );
  });
  it('should be able to reset the password', async () => {
    const user = await fakeUsersRepository.create({
      email: 'jhonDoe@gmail.com',
      fullname: 'Jhon Doe',
      password: 'impossiblepass123',
      username: 'jhonDoe001',
      bio: 'just nothing...',
      birthday: new Date('2025-04-04'),
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);

    const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

    await resetPasswordService.execute({
      password: 'newimpossiblepass123',
      token,
    });

    const updatedUser = await fakeUsersRepository.findWithPassword({
      email: 'jhonDoe@gmail.com',
    });

    expect(generateHash).toHaveBeenCalledWith('newimpossiblepass123');
    expect(updatedUser?.password).toBe('newimpossiblepass123');
  });
  it('should not be able to reset the password with non-existing token', async () => {
    await expect(
      resetPasswordService.execute({
        token: 'non-existing token',
        password: 'newimpossiblepass123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to reset the password with non-existing user', async () => {
    const { token } = await fakeUserTokensRepository.generate(
      'non-existing user_id',
    );
    await expect(
      resetPasswordService.execute({
        token,
        password: 'newimpossiblepass123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to reset the password if passed more than 2 hours', async () => {
    const user = await fakeUsersRepository.create({
      email: 'jhonDoe@gmail.com',
      fullname: 'Jhon Doe',
      password: 'impossiblepass123',
      username: 'jhonDoe001',
      bio: 'just nothing...',
      birthday: new Date('2025-04-04'),
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);
    jest.spyOn(timezoneUtil, 'default').mockImplementationOnce(() => {
      const now = toZonedTime(new Date(), 'America/Recife');
      now.setHours(now.getHours() + 3);
      return format(now, 'yyyy-MM-dd HH:mm:ss', {
        timeZone: 'America/Recife',
      });
    });

    await expect(
      resetPasswordService.execute({
        token,
        password: 'newimpossiblepass123',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
  it('should not be able to reset the password with a password shorter than 3 characters', async () => {
    const user = await fakeUsersRepository.create({
      email: 'jhonDoe@gmail.com',
      fullname: 'Jhon Doe',
      password: 'impossiblepass123',
      username: 'jhonDoe001',
      bio: 'just nothing...',
      birthday: new Date('2025-04-04'),
    });

    const { token } = await fakeUserTokensRepository.generate(user.id);
    await expect(
      resetPasswordService.execute({
        token,
        password: '12',
      }),
    ).rejects.toBeInstanceOf(AppError);
  });
});
