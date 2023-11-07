import { ERole } from '@app/scripts/models/enums/role.enum';

export interface IUser {
  _id?: string;
  email: string;
  password: string;
  createdAt?: Date;
  role: ERole;
}
