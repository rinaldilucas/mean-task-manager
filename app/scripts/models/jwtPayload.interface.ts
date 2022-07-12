import { ERole } from '@app/scripts/models/enum/role.enum';

export interface IJwtPayload {
    token: string;
    expiresIn: number;
    expirationDate: Date;
    userId: string;
    userRole: ERole;
}
