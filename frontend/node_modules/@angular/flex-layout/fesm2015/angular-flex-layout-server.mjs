import * as i0 from '@angular/core';
import { PLATFORM_ID, Injectable, Inject, NgModule } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { BEFORE_APP_SERIALIZED } from '@angular/platform-server';
import { ɵMatchMedia, BREAKPOINTS, LAYOUT_CONFIG, sortAscendingPriority, CLASS_NAME, StylesheetMap, MediaMarshaller, SERVER_TOKEN } from '@angular/flex-layout/core';

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Special server-only class to simulate a MediaQueryList and
 * - supports manual activation to simulate mediaQuery matching
 * - manages listeners
 */
class ServerMediaQueryList {
    constructor(_mediaQuery, _isActive = false) {
        this._mediaQuery = _mediaQuery;
        this._isActive = _isActive;
        this._listeners = [];
        this.onchange = null;
    }
    get matches() {
        return this._isActive;
    }
    get media() {
        return this._mediaQuery;
    }
    /**
     * Destroy the current list by deactivating the
     * listeners and clearing the internal list
     */
    destroy() {
        this.deactivate();
        this._listeners = [];
    }
    /** Notify all listeners that 'matches === TRUE' */
    activate() {
        if (!this._isActive) {
            this._isActive = true;
            this._listeners.forEach((callback) => {
                const cb = callback;
                cb.call(this, { matches: this.matches, media: this.media });
            });
        }
        return this;
    }
    /** Notify all listeners that 'matches === false' */
    deactivate() {
        if (this._isActive) {
            this._isActive = false;
            this._listeners.forEach((callback) => {
                const cb = callback;
                cb.call(this, { matches: this.matches, media: this.media });
            });
        }
        return this;
    }
    /** Add a listener to our internal list to activate later */
    addListener(listener) {
        if (this._listeners.indexOf(listener) === -1) {
            this._listeners.push(listener);
        }
        if (this._isActive) {
            const cb = listener;
            cb.call(this, { matches: this.matches, media: this.media });
        }
    }
    /** Don't need to remove listeners in the server environment */
    removeListener() {
    }
    addEventListener() {
    }
    removeEventListener() {
    }
    dispatchEvent(_) {
        return false;
    }
}
/**
 * Special server-only implementation of MatchMedia that uses the above
 * ServerMediaQueryList as its internal representation
 *
 * Also contains methods to activate and deactivate breakpoints
 */
class ServerMatchMedia extends ɵMatchMedia {
    constructor(_zone, _platformId, _document, breakpoints, layoutConfig) {
        super(_zone, _platformId, _document);
        this._zone = _zone;
        this._platformId = _platformId;
        this._document = _document;
        this.breakpoints = breakpoints;
        this.layoutConfig = layoutConfig;
        this._activeBreakpoints = [];
        const serverBps = layoutConfig.ssrObserveBreakpoints;
        if (serverBps) {
            this._activeBreakpoints = serverBps
                .reduce((acc, serverBp) => {
                const foundBp = breakpoints.find(bp => serverBp === bp.alias);
                if (!foundBp) {
                    console.warn(`FlexLayoutServerModule: unknown breakpoint alias "${serverBp}"`);
                }
                else {
                    acc.push(foundBp);
                }
                return acc;
            }, []);
        }
    }
    /** Activate the specified breakpoint if we're on the server, no-op otherwise */
    activateBreakpoint(bp) {
        const lookupBreakpoint = this.registry.get(bp.mediaQuery);
        if (lookupBreakpoint) {
            lookupBreakpoint.activate();
        }
    }
    /** Deactivate the specified breakpoint if we're on the server, no-op otherwise */
    deactivateBreakpoint(bp) {
        const lookupBreakpoint = this.registry.get(bp.mediaQuery);
        if (lookupBreakpoint) {
            lookupBreakpoint.deactivate();
        }
    }
    /**
     * Call window.matchMedia() to build a MediaQueryList; which
     * supports 0..n listeners for activation/deactivation
     */
    buildMQL(query) {
        const isActive = this._activeBreakpoints.some(ab => ab.mediaQuery === query);
        return new ServerMediaQueryList(query, isActive);
    }
}
ServerMatchMedia.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: ServerMatchMedia, deps: [{ token: i0.NgZone }, { token: PLATFORM_ID }, { token: DOCUMENT }, { token: BREAKPOINTS }, { token: LAYOUT_CONFIG }], target: i0.ɵɵFactoryTarget.Injectable });
ServerMatchMedia.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: ServerMatchMedia });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: ServerMatchMedia, decorators: [{
            type: Injectable
        }], ctorParameters: function () {
        return [{ type: i0.NgZone }, { type: Object, decorators: [{
                        type: Inject,
                        args: [PLATFORM_ID]
                    }] }, { type: undefined, decorators: [{
                        type: Inject,
                        args: [DOCUMENT]
                    }] }, { type: undefined, decorators: [{
                        type: Inject,
                        args: [BREAKPOINTS]
                    }] }, { type: undefined, decorators: [{
                        type: Inject,
                        args: [LAYOUT_CONFIG]
                    }] }];
    } });

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Activate all the registered breakpoints in sequence, and then
 * retrieve the associated stylings from the virtual stylesheet
 * @param serverSheet the virtual stylesheet that stores styles for each
 *        element
 * @param mediaController the MatchMedia service to activate/deactivate breakpoints
 * @param breakpoints the registered breakpoints to activate/deactivate
 * @param mediaMarshaller the MediaMarshaller service to disable fallback styles dynamically
 */
function generateStaticFlexLayoutStyles(serverSheet, mediaController, breakpoints, mediaMarshaller) {
    // Store the custom classes in the following map, that way only
    // one class gets allocated per HTMLElement, and each class can
    // be referenced in the static media queries
    const classMap = new Map();
    // Get the initial stylings for all the directives,
    // and initialize the fallback block of stylings.
    const defaultStyles = new Map(serverSheet.stylesheet);
    // Reset the class counter, otherwise class numbers will
    // increase with each server render.
    nextId = 0;
    let styleText = generateCss(defaultStyles, 'all', classMap);
    mediaMarshaller.useFallbacks = false;
    [...breakpoints].sort(sortAscendingPriority).forEach((bp) => {
        serverSheet.clearStyles();
        mediaController.activateBreakpoint(bp);
        const stylesheet = new Map(serverSheet.stylesheet);
        if (stylesheet.size > 0) {
            styleText += generateCss(stylesheet, bp.mediaQuery, classMap);
        }
        mediaController.deactivateBreakpoint(bp);
    });
    return styleText;
}
/**
 * Create a style tag populated with the dynamic stylings from Flex
 * components and attach it to the head of the DOM
 */
function FLEX_SSR_SERIALIZER_FACTORY(serverSheet, mediaController, _document, breakpoints, mediaMarshaller) {
    return () => {
        // This is the style tag that gets inserted into the head of the DOM,
        // populated with the manual media queries
        const styleTag = _document.createElement('style');
        const styleText = generateStaticFlexLayoutStyles(serverSheet, mediaController, breakpoints, mediaMarshaller);
        styleTag.classList.add(`${CLASS_NAME}ssr`);
        styleTag.textContent = styleText;
        _document.head.appendChild(styleTag);
    };
}
/**
 *  Provider to set static styles on the server
 */
const SERVER_PROVIDERS = [
    {
        provide: BEFORE_APP_SERIALIZED,
        useFactory: FLEX_SSR_SERIALIZER_FACTORY,
        deps: [
            StylesheetMap,
            ɵMatchMedia,
            DOCUMENT,
            BREAKPOINTS,
            MediaMarshaller,
        ],
        multi: true,
    },
    {
        provide: SERVER_TOKEN,
        useValue: true
    },
    {
        provide: ɵMatchMedia,
        useClass: ServerMatchMedia
    }
];
let nextId = 0;
const IS_DEBUG_MODE = false;
/**
 * create @media queries based on a virtual stylesheet
 * * Adds a unique class to each element and stores it
 *   in a shared classMap for later reuse
 * @param stylesheet the virtual stylesheet that stores styles for each
 *        element
 * @param mediaQuery the given @media CSS selector for the current breakpoint
 * @param classMap the map of HTML elements to class names to avoid duplications
 */
function generateCss(stylesheet, mediaQuery, classMap) {
    let css = '';
    stylesheet.forEach((styles, el) => {
        let keyVals = '';
        let className = getClassName(el, classMap);
        styles.forEach((v, k) => {
            keyVals += v ? format(`${k}:${v};`) : '';
        });
        if (keyVals) {
            // Build list of CSS styles; each with a className
            css += format(`.${className} {`, keyVals, '}');
        }
    });
    // Group 1 or more styles (each with className) in a specific mediaQuery
    return format(`@media ${mediaQuery} {`, css, '}');
}
/**
 * For debugging purposes, prefix css segment with linefeed(s) for easy
  * debugging purposes.
 */
function format(...list) {
    let result = '';
    list.forEach((css, i) => {
        result += IS_DEBUG_MODE ? formatSegment(css, i !== 0) : css;
    });
    return result;
}
function formatSegment(css, asPrefix = true) {
    return asPrefix ? `\n${css}` : `${css}\n`;
}
/**
 * Get className associated with CSS styling
 * If not found, generate global className and set
 * association.
 */
function getClassName(element, classMap) {
    let className = classMap.get(element);
    if (!className) {
        className = `${CLASS_NAME}${nextId++}`;
        classMap.set(element, className);
    }
    element.classList.add(className);
    return className;
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
class FlexLayoutServerModule {
}
FlexLayoutServerModule.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: FlexLayoutServerModule, deps: [], target: i0.ɵɵFactoryTarget.NgModule });
FlexLayoutServerModule.ɵmod = i0.ɵɵngDeclareNgModule({ minVersion: "14.0.0", version: "14.0.1", ngImport: i0, type: FlexLayoutServerModule });
FlexLayoutServerModule.ɵinj = i0.ɵɵngDeclareInjector({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: FlexLayoutServerModule, providers: [SERVER_PROVIDERS] });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: FlexLayoutServerModule, decorators: [{
            type: NgModule,
            args: [{
                    providers: [SERVER_PROVIDERS]
                }]
        }] });

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * Generated bundle index. Do not edit.
 */

export { FLEX_SSR_SERIALIZER_FACTORY, FlexLayoutServerModule, SERVER_PROVIDERS, generateStaticFlexLayoutStyles };
//# sourceMappingURL=angular-flex-layout-server.mjs.map
