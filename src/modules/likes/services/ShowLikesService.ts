import { inject, injectable } from 'tsyringe';

import ILikesRepository from '../repositories/ILikesRepository';
import ISearchLikesDTO from '../dtos/ISearchLikesDTO';
import Likes from '../infra/typeorm/entities/likes';

@injectable()
class ShowLikesService {
  constructor(
    @inject('LikesRepository')
    private likesRepository: ILikesRepository,
  ) {}

  public async execute(query: ISearchLikesDTO): Promise<Likes[] | undefined> {
    const result = await this.likesRepository.find(query);
    return result;
  }
}

export default ShowLikesService;
