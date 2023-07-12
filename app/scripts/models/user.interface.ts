import { ERole } from '@scripts/models/enum/role.enum';

export interface IUser {
  _id?: string;
  email: string;
  password: string;
  createdAt?: Date;
  role: ERole;
}
