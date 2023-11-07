import { ERole } from '@app/scripts/models/enums/role.enum';

export interface IAuthData {
  userId: string;
  email: string;
  role: ERole;
  expirationDate?: Date;
}
