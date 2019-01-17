export declare var NUMERIC: string;
export declare var LONG: string;
export declare var SHORT: string;
export declare var TWODIGIT: string;
export declare var FULL: string;
export declare class DateTimeFormat {
    private locale;
    private options;
    private pattern;
    constructor(locale?: string, options?: Intl.DateTimeFormatOptions, pattern?: string);
    private hasTimeOptions(options);
    private hasDateOptions(options);
    private useFullDatePattern(intlOptions);
    getNativePattern(patternDefinition: {
        date?: string;
        time?: string;
    }, locale?: string): string;
    private getCorrectPatternForLocale();
    private dateTimeFormatElements;
    private getDateElementsFromPattern(pattern);
    private prepareDateElement(intlOption, dateElement);
    private preparePattern(pattern, options);
    formatNative(pattern: string, locale?: string, date?: Date): string;
    private _preparedPattern;
    readonly preparedPattern: string;
    format(date?: Date): string;
}
export declare class NumberFormat {
    private locale;
    private options;
    private pattern;
    constructor(locale?: string, options?: Intl.NumberFormatOptions, pattern?: string);
    formatNative(value: number, locale?: string, options?: Intl.NumberFormatOptions, pattern?: string): string;
    format(value: number): string;
}
