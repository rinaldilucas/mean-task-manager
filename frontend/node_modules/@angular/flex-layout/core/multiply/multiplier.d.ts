export interface Multiplier {
    readonly unit: string;
    readonly value: number;
}
export declare function multiply(value: string, multiplier?: Multiplier): string;
