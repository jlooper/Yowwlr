export declare var global: any;
export declare function isPresent(obj: any): boolean;
export declare function isBlank(obj: any): boolean;
export declare function isNumber(obj: any): boolean;
export declare function isDate(obj: any): obj is Date;
export declare function print(obj: Error | Object): void;
export declare function isJsObject(o: any): boolean;
export declare function isArray(obj: any): boolean;
export declare function getSymbolIterator(): string | symbol;
export declare class DateWrapper {
    static create(year: number, month?: number, day?: number, hour?: number, minutes?: number, seconds?: number, milliseconds?: number): Date;
    static fromISOString(str: string): Date;
    static fromMillis(ms: number): Date;
    static toMillis(date: Date): number;
    static now(): Date;
    static toJson(date: Date): string;
}
export declare function setValueOnPath(global: any, path: string, value: any): void;
