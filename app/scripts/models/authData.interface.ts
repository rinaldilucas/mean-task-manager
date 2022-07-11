import { ERole } from '@app/scripts/models/enum/role.enum';

export interface IAuthData {
    userId: string;
    username: string;
    role: ERole;
    expirationDate?: Date;
}
