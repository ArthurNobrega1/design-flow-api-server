import timezone from '@shared/utils/timezone';
import { parse } from 'date-fns';
import { uuid } from 'uuidv4';
import Posts from '@modules/posts/infra/typeorm/entities/posts';
import ICreatePostDTO from '@modules/posts/dtos/ICreatePostDTO';
import ISearchPostsDTO from '@modules/posts/dtos/ISearchPostsDTO';
import IPostsRepository from '../IPostsRepository';

class FakePostsRepository implements IPostsRepository {
  private posts: Posts[] = [];

  public async create(data: ICreatePostDTO): Promise<Posts> {
    const post = { ...new Posts(), active: true, ...data, id: uuid() };
    post.created_at = parse(timezone(), 'yyyy-MM-dd HH:mm:ss', new Date());
    post.updated_at = parse(timezone(), 'yyyy-MM-dd HH:mm:ss', new Date());
    this.posts.push(post);
    return post;
  }

  public async delete(id: string): Promise<void> {
    this.posts = this.posts.filter(post => post.id !== id);
  }

  public async findById(id: string): Promise<Posts | null> {
    const postFiltered = this.posts.find(post => post.id === id);
    if (!postFiltered) {
      return null;
    }
    return postFiltered;
  }

  public async find(search: ISearchPostsDTO): Promise<Posts[] | undefined> {
    const postsFiltered = this.posts.filter(post =>
      Object.entries(search).every(
        ([key, value]) => post[key as keyof Posts] === value,
      ),
    );

    return postsFiltered.length ? postsFiltered : undefined;
  }

  public async save(data: Posts): Promise<Posts> {
    const index = this.posts.findIndex(post => post.id === data.id);

    const updatedPost = {
      ...(index >= 0 ? this.posts[index] : {}),
      ...data,
      updated_at: parse(timezone(), 'yyyy-MM-dd HH:mm:ss', new Date()),
    };

    if (index >= 0) {
      this.posts[index] = updatedPost;
    } else {
      this.posts.push(updatedPost);
    }

    return updatedPost;
  }
}

export default FakePostsRepository;
