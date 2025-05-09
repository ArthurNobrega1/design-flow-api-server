import timezone from '@shared/utils/timezone';
import { parse } from 'date-fns';
import { v4 as uuid } from 'uuid';
import Follows from '@modules/follows/infra/typeorm/entities/follows';
import ICreateFollowDTO from '@modules/follows/dtos/ICreateFollowDTO';
import ISearchFollowsDTO from '@modules/follows/dtos/ISearchFollowsDTO';
import IFollowsRepository from '../IFollowsRepository';

class FakeFollowsRepository implements IFollowsRepository {
  private follows: Follows[] = [];

  public async create(data: ICreateFollowDTO): Promise<Follows> {
    const follow = {
      ...new Follows(),
      active: true,
      is_accepted: false,
      ...data,
      id: uuid(),
    };
    follow.created_at = parse(timezone(), 'yyyy-MM-dd HH:mm:ss', new Date());
    follow.updated_at = parse(timezone(), 'yyyy-MM-dd HH:mm:ss', new Date());
    this.follows.push(follow);
    return follow;
  }

  public async delete(id: string): Promise<void> {
    this.follows = this.follows.filter(follow => follow.id !== id);
  }

  public async findById(id: string): Promise<Follows | null> {
    const followFiltered = this.follows.find(follow => follow.id === id);
    if (!followFiltered) {
      return null;
    }
    return followFiltered;
  }

  public async find(search: ISearchFollowsDTO): Promise<Follows[] | undefined> {
    const followsFiltered = this.follows.filter(follow =>
      Object.entries(search).every(
        ([key, value]) => follow[key as keyof Follows] === value,
      ),
    );

    return followsFiltered.length ? followsFiltered : undefined;
  }

  public async save(data: Follows): Promise<Follows> {
    const index = this.follows.findIndex(follow => follow.id === data.id);

    const updatedFollow = {
      ...(index >= 0 ? this.follows[index] : {}),
      ...data,
      updated_at: parse(timezone(), 'yyyy-MM-dd HH:mm:ss', new Date()),
    };

    if (index >= 0) {
      this.follows[index] = updatedFollow;
    } else {
      this.follows.push(updatedFollow);
    }

    return updatedFollow;
  }
}

export default FakeFollowsRepository;
