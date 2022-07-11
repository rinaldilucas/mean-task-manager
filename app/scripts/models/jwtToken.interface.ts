import { ERole } from './enum/role.enum';

export interface IJwtToken {
    userId: string;
    username: string;
    role: ERole;
    expirationDate: Date;
}
