export default interface ICreateLikeDTO {
  user_id: string;
  post_id?: string;
  comment_id?: string;
  active?: boolean;
}
