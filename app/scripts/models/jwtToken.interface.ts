import { ERole } from '@scripts/models/enum/role.enum';

export interface IJwtToken {
    userId: string;
    email: string;
    role: ERole;
    expirationDate: Date;
}
