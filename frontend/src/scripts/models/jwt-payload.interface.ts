export interface IJwtPayload {
  access: string;
  refresh: string;
  expiresIn: number;
  expirationDate: Date;
  userId: string;
  keepUserLoggedIn: boolean;
}
