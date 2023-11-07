import { ERole } from '@app/scripts/models/enums/role.enum';

export interface IJwtToken {
  userId: string;
  email: string;
  role: ERole;
  expirationDate: Date;
}
