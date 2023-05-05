import { ERole } from '@scripts/models/enum/role.enum';

export interface IJwtPayload {
    access: string;
    refresh: string;
    expiresIn: number;
    expirationDate: Date;
    userId: string;
    userRole: ERole;
    keepUserLoggedIn: boolean;
}
