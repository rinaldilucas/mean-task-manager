import { BreakPoint, ɵMatchMedia as MatchMedia, StylesheetMap, MediaMarshaller } from '@angular/flex-layout/core';
import { ServerMatchMedia } from './server-match-media';
/**
 * Activate all the registered breakpoints in sequence, and then
 * retrieve the associated stylings from the virtual stylesheet
 * @param serverSheet the virtual stylesheet that stores styles for each
 *        element
 * @param mediaController the MatchMedia service to activate/deactivate breakpoints
 * @param breakpoints the registered breakpoints to activate/deactivate
 * @param mediaMarshaller the MediaMarshaller service to disable fallback styles dynamically
 */
export declare function generateStaticFlexLayoutStyles(serverSheet: StylesheetMap, mediaController: ServerMatchMedia, breakpoints: BreakPoint[], mediaMarshaller: MediaMarshaller): string;
/**
 * Create a style tag populated with the dynamic stylings from Flex
 * components and attach it to the head of the DOM
 */
export declare function FLEX_SSR_SERIALIZER_FACTORY(serverSheet: StylesheetMap, mediaController: ServerMatchMedia, _document: Document, breakpoints: BreakPoint[], mediaMarshaller: MediaMarshaller): () => void;
/**
 *  Provider to set static styles on the server
 */
export declare const SERVER_PROVIDERS: ({
    provide: import("@angular/core").InjectionToken<(() => void | Promise<void>)[]>;
    useFactory: typeof FLEX_SSR_SERIALIZER_FACTORY;
    deps: (import("@angular/core").InjectionToken<Document> | typeof StylesheetMap | typeof MatchMedia | typeof MediaMarshaller)[];
    multi: boolean;
    useValue?: undefined;
    useClass?: undefined;
} | {
    provide: import("@angular/core").InjectionToken<boolean>;
    useValue: boolean;
    useFactory?: undefined;
    deps?: undefined;
    multi?: undefined;
    useClass?: undefined;
} | {
    provide: typeof MatchMedia;
    useClass: typeof ServerMatchMedia;
    useFactory?: undefined;
    deps?: undefined;
    multi?: undefined;
    useValue?: undefined;
})[];
export declare type StyleSheet = Map<HTMLElement, Map<string, string | number>>;
export declare type ClassMap = Map<HTMLElement, string>;
