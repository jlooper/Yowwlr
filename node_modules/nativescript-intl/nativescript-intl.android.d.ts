import common = require("./nativescript-intl-common");
export declare class DateTimeFormat extends common.DateTimeFormat {
    getNativePattern(patternDefinition: {
        date?: string;
        time?: string;
    }, locale?: string): string;
    formatNative(pattern: string, locale?: string, date?: Date): string;
}
export declare class NumberFormat extends common.NumberFormat {
    formatNative(value: number, locale?: string, options?: Intl.NumberFormatOptions, pattern?: string): any;
}
