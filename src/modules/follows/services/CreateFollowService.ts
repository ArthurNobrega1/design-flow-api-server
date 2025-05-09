import { inject, injectable } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IFollowsRepository from '../repositories/IFollowsRepository';
import Follows from '../infra/typeorm/entities/follows';
import ICreateFollowDTO from '../dtos/ICreateFollowDTO';

@injectable()
class CreateFollowService {
  constructor(
    @inject('FollowsRepository')
    private followsRepository: IFollowsRepository,

    @inject('UsersRepository')
    private usersRepository: IUsersRepository,
  ) {}

  public async execute(
    data: Omit<ICreateFollowDTO, 'follower_id'>,
    followerId: string,
  ): Promise<Follows> {
    if (followerId === data.following_id) {
      throw new AppError('Você não pode seguir você mesmo', 400);
    }

    const follower = await this.usersRepository.findById(followerId);
    if (!follower || !follower.active) {
      throw new AppError('Usuário seguidor inválido', 400);
    }

    const following = await this.usersRepository.findById(data.following_id);
    if (!following || !following.active) {
      throw new AppError('Usuário a ser seguido inválido', 400);
    }

    const isAccepted = !follower.is_private;

    const created = await this.followsRepository.create({
      ...data,
      follower_id: followerId,
      is_accepted: isAccepted,
    });
    return created;
  }
}

export default CreateFollowService;
