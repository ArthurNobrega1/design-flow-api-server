export default interface ICreateCommentDTO {
  content: string;
  user_id: string;
  post_id: string;
  active?: boolean;
}
