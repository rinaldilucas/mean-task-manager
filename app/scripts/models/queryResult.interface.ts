export interface IQueryResult<T> {
    success: boolean;
    message: string;
    data: T[];
    status: number;
    count: number;
}
