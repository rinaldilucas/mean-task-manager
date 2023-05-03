import { ERole } from '@app/scripts/models/enum/role.enum';

export interface IAuthData {
    userId: string;
    email: string;
    role: ERole;
    expirationDate?: Date;
 }
