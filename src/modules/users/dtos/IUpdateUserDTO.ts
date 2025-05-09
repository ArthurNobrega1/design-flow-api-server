export default interface IUpdateUserDTO {
  id: string;
  bio?: string;
  birthday?: Date;
  email?: string;
  username?: string;
  fullname?: string;
  permission?: string;
  active?: boolean;
  is_private?: boolean;
}
