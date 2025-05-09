import { inject, injectable } from 'tsyringe';

import IFollowsRepository from '../repositories/IFollowsRepository';
import Follows from '../infra/typeorm/entities/follows';
import ISearchFollowsDTO from '../dtos/ISearchFollowsDTO';

@injectable()
class ShowFollowsService {
  constructor(
    @inject('FollowsRepository')
    private followsRepository: IFollowsRepository,
  ) {}

  public async execute(
    query: ISearchFollowsDTO,
  ): Promise<Follows[] | undefined> {
    const result = await this.followsRepository.find(query);
    return result;
  }
}

export default ShowFollowsService;
