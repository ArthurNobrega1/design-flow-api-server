export default interface ICreateFollowDTO {
  follower_id: string;
  following_id: string;
  is_accepted?: boolean;
}
