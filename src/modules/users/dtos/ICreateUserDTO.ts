export default interface ICreateUserDTO {
  bio?: string;
  birthday?: Date;
  email: string;
  username: string;
  fullname: string;
  password: string;
  permission?: string;
  active?: boolean;
}
