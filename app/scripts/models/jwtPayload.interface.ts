import { ERole } from './enum/role.enum';

export interface IJwtPayload {
    token: string;
    expiresIn?: number;
    expirationDate?: Date;
    userId: string;
    userRole: ERole;
}
