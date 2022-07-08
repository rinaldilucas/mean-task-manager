export interface IJwtToken {
    token: string;
    userId: string;
    success?: boolean;
    response?: Object;
    expiresIn?: number;
    expirationDate?: Date;
}
