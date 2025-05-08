export default interface IUpdateCommentDTO {
  id: string;
  content?: string;
  post_id?: string;
  active?: boolean;
}
