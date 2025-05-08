import timezone from '@shared/utils/timezone';
import { parse } from 'date-fns';
import { uuid } from 'uuidv4';
import Comments from '@modules/comments/infra/typeorm/entities/comments';
import ICreateCommentDTO from '@modules/comments/dtos/ICreateCommentDTO';
import ISearchCommentsDTO from '@modules/comments/dtos/ISearchCommentsDTO';
import ICommentsRepository from '../ICommentsRepository';

class FakeCommentsRepository implements ICommentsRepository {
  private comments: Comments[] = [];

  public async create(data: ICreateCommentDTO): Promise<Comments> {
    const comment = { ...new Comments(), active: true, ...data, id: uuid() };
    comment.created_at = parse(timezone(), 'yyyy-MM-dd HH:mm:ss', new Date());
    comment.updated_at = parse(timezone(), 'yyyy-MM-dd HH:mm:ss', new Date());
    this.comments.push(comment);
    return comment;
  }

  public async delete(id: string): Promise<void> {
    this.comments = this.comments.filter(comment => comment.id !== id);
  }

  public async findById(id: string): Promise<Comments | null> {
    const commentFiltered = this.comments.find(comment => comment.id === id);
    if (!commentFiltered) {
      return null;
    }
    return commentFiltered;
  }

  public async find(
    search: ISearchCommentsDTO,
  ): Promise<Comments[] | undefined> {
    const commentsFiltered = this.comments.filter(comment =>
      Object.entries(search).every(
        ([key, value]) => comment[key as keyof Comments] === value,
      ),
    );

    return commentsFiltered.length ? commentsFiltered : undefined;
  }

  public async save(data: Comments): Promise<Comments> {
    const index = this.comments.findIndex(comment => comment.id === data.id);

    const updatedComment = {
      ...(index >= 0 ? this.comments[index] : {}),
      ...data,
      updated_at: parse(timezone(), 'yyyy-MM-dd HH:mm:ss', new Date()),
    };

    if (index >= 0) {
      this.comments[index] = updatedComment;
    } else {
      this.comments.push(updatedComment);
    }

    return updatedComment;
  }
}

export default FakeCommentsRepository;
