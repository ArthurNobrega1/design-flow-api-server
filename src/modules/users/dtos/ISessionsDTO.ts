import User from '../infra/typeorm/entities/users';

export interface ICreateSessionRequestDTO {
  email?: string;
  username?: string;
  password: string;
}

export interface ICreateSessionResponseDTO {
  user: User;
  token: string;
}
