import { DateAdapter } from '@angular/material/core';
import * as i0 from '@angular/core';
import { InjectionToken } from '@angular/core';
import { MatDateFormats } from '@angular/material/core';
import { Moment } from 'moment';

/** InjectionToken for moment date adapter to configure options. */
export declare const MAT_MOMENT_DATE_ADAPTER_OPTIONS: InjectionToken<MatMomentDateAdapterOptions>;

/** @docs-private */
export declare function MAT_MOMENT_DATE_ADAPTER_OPTIONS_FACTORY(): MatMomentDateAdapterOptions;

export declare const MAT_MOMENT_DATE_FORMATS: MatDateFormats;

/** Configurable options for {@see MomentDateAdapter}. */
export declare interface MatMomentDateAdapterOptions {
    /**
     * When enabled, the dates have to match the format exactly.
     * See https://momentjs.com/guides/#/parsing/strict-mode/.
     */
    strict?: boolean;
    /**
     * Turns the use of utc dates on or off.
     * Changing this will change how Angular Material components like DatePicker output dates.
     * {@default false}
     */
    useUtc?: boolean;
}

export declare class MatMomentDateModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<MatMomentDateModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<MatMomentDateModule, never, [typeof MomentDateModule], never>;
    static ɵinj: i0.ɵɵInjectorDeclaration<MatMomentDateModule>;
}

/** Adapts Moment.js Dates for use with Angular Material. */
export declare class MomentDateAdapter extends DateAdapter<Moment> {
    private _options?;
    private _localeData;
    constructor(dateLocale: string, _options?: MatMomentDateAdapterOptions | undefined);
    setLocale(locale: string): void;
    getYear(date: Moment): number;
    getMonth(date: Moment): number;
    getDate(date: Moment): number;
    getDayOfWeek(date: Moment): number;
    getMonthNames(style: 'long' | 'short' | 'narrow'): string[];
    getDateNames(): string[];
    getDayOfWeekNames(style: 'long' | 'short' | 'narrow'): string[];
    getYearName(date: Moment): string;
    getFirstDayOfWeek(): number;
    getNumDaysInMonth(date: Moment): number;
    clone(date: Moment): Moment;
    createDate(year: number, month: number, date: number): Moment;
    today(): Moment;
    parse(value: any, parseFormat: string | string[]): Moment | null;
    format(date: Moment, displayFormat: string): string;
    addCalendarYears(date: Moment, years: number): Moment;
    addCalendarMonths(date: Moment, months: number): Moment;
    addCalendarDays(date: Moment, days: number): Moment;
    toIso8601(date: Moment): string;
    /**
     * Returns the given value if given a valid Moment or null. Deserializes valid ISO 8601 strings
     * (https://www.ietf.org/rfc/rfc3339.txt) and valid Date objects into valid Moments and empty
     * string into null. Returns an invalid date for all other values.
     */
    deserialize(value: any): Moment | null;
    isDateInstance(obj: any): boolean;
    isValid(date: Moment): boolean;
    invalid(): Moment;
    /** Creates a Moment instance while respecting the current UTC settings. */
    private _createMoment;
    static ɵfac: i0.ɵɵFactoryDeclaration<MomentDateAdapter, [{ optional: true; }, { optional: true; }]>;
    static ɵprov: i0.ɵɵInjectableDeclaration<MomentDateAdapter>;
}

export declare class MomentDateModule {
    static ɵfac: i0.ɵɵFactoryDeclaration<MomentDateModule, never>;
    static ɵmod: i0.ɵɵNgModuleDeclaration<MomentDateModule, never, never, never>;
    static ɵinj: i0.ɵɵInjectorDeclaration<MomentDateModule>;
}

export { }
