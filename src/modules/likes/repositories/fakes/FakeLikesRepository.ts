import timezone from '@shared/utils/timezone';
import { parse } from 'date-fns';
import { v4 as uuid } from 'uuid';
import Likes from '@modules/likes/infra/typeorm/entities/likes';
import ISearchLikesDTO from '@modules/likes/dtos/ISearchLikesDTO';
import ICreateLikeDTO from '@modules/likes/dtos/ICreateLikeDTO';
import ILikesRepository from '../ILikesRepository';

class FakeLikesRepository implements ILikesRepository {
  private likes: Likes[] = [];

  public async create(data: ICreateLikeDTO): Promise<Likes> {
    const like = { ...new Likes(), active: true, ...data, id: uuid() };
    like.created_at = parse(timezone(), 'yyyy-MM-dd HH:mm:ss', new Date());
    like.updated_at = parse(timezone(), 'yyyy-MM-dd HH:mm:ss', new Date());
    this.likes.push(like);
    return like;
  }

  public async delete(id: string): Promise<void> {
    this.likes = this.likes.filter(like => like.id !== id);
  }

  public async findById(id: string): Promise<Likes | null> {
    const likeFiltered = this.likes.find(like => like.id === id);
    if (!likeFiltered) {
      return null;
    }
    return likeFiltered;
  }

  public async find(search: ISearchLikesDTO): Promise<Likes[] | undefined> {
    const likesFiltered = this.likes.filter(like =>
      Object.entries(search).every(
        ([key, value]) => like[key as keyof Likes] === value,
      ),
    );

    return likesFiltered.length ? likesFiltered : undefined;
  }

  public async save(data: Likes): Promise<Likes> {
    const index = this.likes.findIndex(like => like.id === data.id);

    const updatedLike = {
      ...(index >= 0 ? this.likes[index] : {}),
      ...data,
      updated_at: parse(timezone(), 'yyyy-MM-dd HH:mm:ss', new Date()),
    };

    if (index >= 0) {
      this.likes[index] = updatedLike;
    } else {
      this.likes.push(updatedLike);
    }

    return updatedLike;
  }
}

export default FakeLikesRepository;
