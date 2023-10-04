(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('@angular/core'), require('rxjs'), require('lodash-es'), require('chart.js')) :
    typeof define === 'function' && define.amd ? define('ng2-charts', ['exports', '@angular/core', 'rxjs', 'lodash-es', 'chart.js'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global['ng2-charts'] = {}, global.ng.core, global.rxjs, global._, global.chart_js));
}(this, (function (exports, i0, rxjs, lodashEs, chart_js) { 'use strict';

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */
    /* global Reflect, Promise */
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b)
                if (Object.prototype.hasOwnProperty.call(b, p))
                    d[p] = b[p]; };
        return extendStatics(d, b);
    };
    function __extends(d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    }
    var __assign = function () {
        __assign = Object.assign || function __assign(t) {
            for (var s, i = 1, n = arguments.length; i < n; i++) {
                s = arguments[i];
                for (var p in s)
                    if (Object.prototype.hasOwnProperty.call(s, p))
                        t[p] = s[p];
            }
            return t;
        };
        return __assign.apply(this, arguments);
    };
    function __rest(s, e) {
        var t = {};
        for (var p in s)
            if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
                t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
    }
    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function")
            r = Reflect.decorate(decorators, target, key, desc);
        else
            for (var i = decorators.length - 1; i >= 0; i--)
                if (d = decorators[i])
                    r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }
    function __param(paramIndex, decorator) {
        return function (target, key) { decorator(target, key, paramIndex); };
    }
    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function")
            return Reflect.metadata(metadataKey, metadataValue);
    }
    function __awaiter(thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try {
                step(generator.next(value));
            }
            catch (e) {
                reject(e);
            } }
            function rejected(value) { try {
                step(generator["throw"](value));
            }
            catch (e) {
                reject(e);
            } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    }
    function __generator(thisArg, body) {
        var _ = { label: 0, sent: function () { if (t[0] & 1)
                throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function () { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f)
                throw new TypeError("Generator is already executing.");
            while (_)
                try {
                    if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done)
                        return t;
                    if (y = 0, t)
                        op = [op[0] & 2, t.value];
                    switch (op[0]) {
                        case 0:
                        case 1:
                            t = op;
                            break;
                        case 4:
                            _.label++;
                            return { value: op[1], done: false };
                        case 5:
                            _.label++;
                            y = op[1];
                            op = [0];
                            continue;
                        case 7:
                            op = _.ops.pop();
                            _.trys.pop();
                            continue;
                        default:
                            if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) {
                                _ = 0;
                                continue;
                            }
                            if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                                _.label = op[1];
                                break;
                            }
                            if (op[0] === 6 && _.label < t[1]) {
                                _.label = t[1];
                                t = op;
                                break;
                            }
                            if (t && _.label < t[2]) {
                                _.label = t[2];
                                _.ops.push(op);
                                break;
                            }
                            if (t[2])
                                _.ops.pop();
                            _.trys.pop();
                            continue;
                    }
                    op = body.call(thisArg, _);
                }
                catch (e) {
                    op = [6, e];
                    y = 0;
                }
                finally {
                    f = t = 0;
                }
            if (op[0] & 5)
                throw op[1];
            return { value: op[0] ? op[1] : void 0, done: true };
        }
    }
    var __createBinding = Object.create ? (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        Object.defineProperty(o, k2, { enumerable: true, get: function () { return m[k]; } });
    }) : (function (o, m, k, k2) {
        if (k2 === undefined)
            k2 = k;
        o[k2] = m[k];
    });
    function __exportStar(m, o) {
        for (var p in m)
            if (p !== "default" && !Object.prototype.hasOwnProperty.call(o, p))
                __createBinding(o, m, p);
    }
    function __values(o) {
        var s = typeof Symbol === "function" && Symbol.iterator, m = s && o[s], i = 0;
        if (m)
            return m.call(o);
        if (o && typeof o.length === "number")
            return {
                next: function () {
                    if (o && i >= o.length)
                        o = void 0;
                    return { value: o && o[i++], done: !o };
                }
            };
        throw new TypeError(s ? "Object is not iterable." : "Symbol.iterator is not defined.");
    }
    function __read(o, n) {
        var m = typeof Symbol === "function" && o[Symbol.iterator];
        if (!m)
            return o;
        var i = m.call(o), r, ar = [], e;
        try {
            while ((n === void 0 || n-- > 0) && !(r = i.next()).done)
                ar.push(r.value);
        }
        catch (error) {
            e = { error: error };
        }
        finally {
            try {
                if (r && !r.done && (m = i["return"]))
                    m.call(i);
            }
            finally {
                if (e)
                    throw e.error;
            }
        }
        return ar;
    }
    function __spread() {
        for (var ar = [], i = 0; i < arguments.length; i++)
            ar = ar.concat(__read(arguments[i]));
        return ar;
    }
    function __spreadArrays() {
        for (var s = 0, i = 0, il = arguments.length; i < il; i++)
            s += arguments[i].length;
        for (var r = Array(s), k = 0, i = 0; i < il; i++)
            for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
                r[k] = a[j];
        return r;
    }
    ;
    function __await(v) {
        return this instanceof __await ? (this.v = v, this) : new __await(v);
    }
    function __asyncGenerator(thisArg, _arguments, generator) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var g = generator.apply(thisArg, _arguments || []), i, q = [];
        return i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i;
        function verb(n) { if (g[n])
            i[n] = function (v) { return new Promise(function (a, b) { q.push([n, v, a, b]) > 1 || resume(n, v); }); }; }
        function resume(n, v) { try {
            step(g[n](v));
        }
        catch (e) {
            settle(q[0][3], e);
        } }
        function step(r) { r.value instanceof __await ? Promise.resolve(r.value.v).then(fulfill, reject) : settle(q[0][2], r); }
        function fulfill(value) { resume("next", value); }
        function reject(value) { resume("throw", value); }
        function settle(f, v) { if (f(v), q.shift(), q.length)
            resume(q[0][0], q[0][1]); }
    }
    function __asyncDelegator(o) {
        var i, p;
        return i = {}, verb("next"), verb("throw", function (e) { throw e; }), verb("return"), i[Symbol.iterator] = function () { return this; }, i;
        function verb(n, f) { i[n] = o[n] ? function (v) { return (p = !p) ? { value: __await(o[n](v)), done: n === "return" } : f ? f(v) : v; } : f; }
    }
    function __asyncValues(o) {
        if (!Symbol.asyncIterator)
            throw new TypeError("Symbol.asyncIterator is not defined.");
        var m = o[Symbol.asyncIterator], i;
        return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () { return this; }, i);
        function verb(n) { i[n] = o[n] && function (v) { return new Promise(function (resolve, reject) { v = o[n](v), settle(resolve, reject, v.done, v.value); }); }; }
        function settle(resolve, reject, d, v) { Promise.resolve(v).then(function (v) { resolve({ value: v, done: d }); }, reject); }
    }
    function __makeTemplateObject(cooked, raw) {
        if (Object.defineProperty) {
            Object.defineProperty(cooked, "raw", { value: raw });
        }
        else {
            cooked.raw = raw;
        }
        return cooked;
    }
    ;
    var __setModuleDefault = Object.create ? (function (o, v) {
        Object.defineProperty(o, "default", { enumerable: true, value: v });
    }) : function (o, v) {
        o["default"] = v;
    };
    function __importStar(mod) {
        if (mod && mod.__esModule)
            return mod;
        var result = {};
        if (mod != null)
            for (var k in mod)
                if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
                    __createBinding(result, mod, k);
        __setModuleDefault(result, mod);
        return result;
    }
    function __importDefault(mod) {
        return (mod && mod.__esModule) ? mod : { default: mod };
    }
    function __classPrivateFieldGet(receiver, privateMap) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to get private field on non-instance");
        }
        return privateMap.get(receiver);
    }
    function __classPrivateFieldSet(receiver, privateMap, value) {
        if (!privateMap.has(receiver)) {
            throw new TypeError("attempted to set private field on non-instance");
        }
        privateMap.set(receiver, value);
        return value;
    }

    /**
     * @fileoverview added by tsickle
     * Generated from: lib/default-colors.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /** @type {?} */
    var defaultColors = [
        [255, 99, 132],
        [54, 162, 235],
        [255, 206, 86],
        [231, 233, 237],
        [75, 192, 192],
        [151, 187, 205],
        [220, 220, 220],
        [247, 70, 74],
        [70, 191, 189],
        [253, 180, 92],
        [148, 159, 177],
        [77, 83, 96]
    ];

    /**
     * @fileoverview added by tsickle
     * Generated from: lib/get-colors.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    /**
     * Generate colors by chart type
     * @param {?} chartType
     * @param {?} index
     * @param {?} count
     * @return {?}
     */
    function getColors(chartType, index, count) {
        if (chartType === 'pie' || chartType === 'doughnut') {
            return formatPieColors(generateColors(count));
        }
        if (chartType === 'polarArea') {
            return formatPolarAreaColors(generateColors(count));
        }
        if (chartType === 'line' || chartType === 'radar') {
            return formatLineColor(generateColor(index));
        }
        if (chartType === 'bar' || chartType === 'horizontalBar') {
            return formatBarColor(generateColor(index));
        }
        if (chartType === 'bubble') {
            return formatPieColors(generateColors(count));
        }
        if (chartType === 'scatter') {
            return formatPieColors(generateColors(count));
        }
        throw new Error('getColors - Unsupported chart type: ' + chartType);
    }
    /**
     * @param {?} colour
     * @param {?} alpha
     * @return {?}
     */
    function rgba(colour, alpha) {
        return 'rgba(' + colour.concat(alpha).join(',') + ')';
    }
    /**
     * @param {?} min
     * @param {?} max
     * @return {?}
     */
    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    /**
     * @param {?} colors
     * @return {?}
     */
    function formatLineColor(colors) {
        return {
            backgroundColor: rgba(colors, 0.4),
            borderColor: rgba(colors, 1),
            pointBackgroundColor: rgba(colors, 1),
            pointBorderColor: '#fff',
            pointHoverBackgroundColor: '#fff',
            pointHoverBorderColor: rgba(colors, 0.8)
        };
    }
    /**
     * @param {?} colors
     * @return {?}
     */
    function formatBarColor(colors) {
        return {
            backgroundColor: rgba(colors, 0.6),
            borderColor: rgba(colors, 1),
            hoverBackgroundColor: rgba(colors, 0.8),
            hoverBorderColor: rgba(colors, 1)
        };
    }
    /**
     * @param {?} colors
     * @return {?}
     */
    function formatPieColors(colors) {
        return {
            backgroundColor: colors.map(( /**
             * @param {?} color
             * @return {?}
             */function (color) { return rgba(color, 0.6); })),
            borderColor: colors.map(( /**
             * @return {?}
             */function () { return '#fff'; })),
            pointBackgroundColor: colors.map(( /**
             * @param {?} color
             * @return {?}
             */function (color) { return rgba(color, 1); })),
            pointBorderColor: colors.map(( /**
             * @return {?}
             */function () { return '#fff'; })),
            pointHoverBackgroundColor: colors.map(( /**
             * @param {?} color
             * @return {?}
             */function (color) { return rgba(color, 1); })),
            pointHoverBorderColor: colors.map(( /**
             * @param {?} color
             * @return {?}
             */function (color) { return rgba(color, 1); }))
        };
    }
    /**
     * @param {?} colors
     * @return {?}
     */
    function formatPolarAreaColors(colors) {
        return {
            backgroundColor: colors.map(( /**
             * @param {?} color
             * @return {?}
             */function (color) { return rgba(color, 0.6); })),
            borderColor: colors.map(( /**
             * @param {?} color
             * @return {?}
             */function (color) { return rgba(color, 1); })),
            hoverBackgroundColor: colors.map(( /**
             * @param {?} color
             * @return {?}
             */function (color) { return rgba(color, 0.8); })),
            hoverBorderColor: colors.map(( /**
             * @param {?} color
             * @return {?}
             */function (color) { return rgba(color, 1); }))
        };
    }
    /**
     * @return {?}
     */
    function getRandomColor() {
        return [getRandomInt(0, 255), getRandomInt(0, 255), getRandomInt(0, 255)];
    }
    /**
     * Generate colors for line|bar charts
     * @param {?} index
     * @return {?}
     */
    function generateColor(index) {
        return defaultColors[index] || getRandomColor();
    }
    /**
     * Generate colors for pie|doughnut charts
     * @param {?} count
     * @return {?}
     */
    function generateColors(count) {
        /** @type {?} */
        var colorsArr = new Array(count);
        for (var i = 0; i < count; i++) {
            colorsArr[i] = defaultColors[i] || getRandomColor();
        }
        return colorsArr;
    }

    /**
     * @fileoverview added by tsickle
     * Generated from: lib/theme.service.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var ThemeService = /** @class */ (function () {
        function ThemeService() {
            this.pColorschemesOptions = {};
            this.colorschemesOptions = new rxjs.BehaviorSubject({});
        }
        /**
         * @param {?} options
         * @return {?}
         */
        ThemeService.prototype.setColorschemesOptions = function (options) {
            this.pColorschemesOptions = options;
            this.colorschemesOptions.next(options);
        };
        /**
         * @return {?}
         */
        ThemeService.prototype.getColorschemesOptions = function () {
            return this.pColorschemesOptions;
        };
        return ThemeService;
    }());
    ThemeService.decorators = [
        { type: i0.Injectable, args: [{
                    providedIn: 'root'
                },] }
    ];
    /** @nocollapse */
    ThemeService.ctorParameters = function () { return []; };
    /** @nocollapse */ ThemeService.ɵprov = i0.ɵɵdefineInjectable({ factory: function ThemeService_Factory() { return new ThemeService(); }, token: ThemeService, providedIn: "root" });
    if (false) {
        /**
         * @type {?}
         * @private
         */
        ThemeService.prototype.pColorschemesOptions;
        /** @type {?} */
        ThemeService.prototype.colorschemesOptions;
    }

    /**
     * @record
     */
    function OldState() { }
    if (false) {
        /** @type {?} */
        OldState.prototype.dataExists;
        /** @type {?} */
        OldState.prototype.dataLength;
        /** @type {?} */
        OldState.prototype.datasetsExists;
        /** @type {?} */
        OldState.prototype.datasetsLength;
        /** @type {?} */
        OldState.prototype.datasetsDataObjects;
        /** @type {?} */
        OldState.prototype.datasetsDataLengths;
        /** @type {?} */
        OldState.prototype.colorsExists;
        /** @type {?} */
        OldState.prototype.colors;
        /** @type {?} */
        OldState.prototype.labelsExist;
        /** @type {?} */
        OldState.prototype.labels;
        /** @type {?} */
        OldState.prototype.legendExists;
        /** @type {?} */
        OldState.prototype.legend;
    }
    /** @enum {number} */
    var UpdateType = {
        Default: 0,
        Update: 1,
        Refresh: 2,
    };
    UpdateType[UpdateType.Default] = 'Default';
    UpdateType[UpdateType.Update] = 'Update';
    UpdateType[UpdateType.Refresh] = 'Refresh';
    var BaseChartDirective = /** @class */ (function () {
        /**
         * @param {?} element
         * @param {?} themeService
         */
        function BaseChartDirective(element, themeService) {
            this.element = element;
            this.themeService = themeService;
            this.options = {};
            this.chartClick = new i0.EventEmitter();
            this.chartHover = new i0.EventEmitter();
            this.old = {
                dataExists: false,
                dataLength: 0,
                datasetsExists: false,
                datasetsLength: 0,
                datasetsDataObjects: [],
                datasetsDataLengths: [],
                colorsExists: false,
                colors: [],
                labelsExist: false,
                labels: [],
                legendExists: false,
                legend: {},
            };
            this.subs = [];
        }
        /**
         * Register a plugin.
         * @param {?} plugin
         * @return {?}
         */
        BaseChartDirective.registerPlugin = function (plugin) {
            chart_js.pluginService.register(plugin);
        };
        /**
         * @param {?} plugin
         * @return {?}
         */
        BaseChartDirective.unregisterPlugin = function (plugin) {
            chart_js.pluginService.unregister(plugin);
        };
        /**
         * @return {?}
         */
        BaseChartDirective.prototype.ngOnInit = function () {
            var _this = this;
            this.ctx = this.element.nativeElement.getContext('2d');
            this.refresh();
            this.subs.push(this.themeService.colorschemesOptions.subscribe(( /**
             * @param {?} r
             * @return {?}
             */function (/**
             * @param {?} r
             * @return {?}
             */ r) { return _this.themeChanged(r); })));
        };
        /**
         * @private
         * @param {?} options
         * @return {?}
         */
        BaseChartDirective.prototype.themeChanged = function (options) {
            this.refresh();
        };
        /**
         * @return {?}
         */
        BaseChartDirective.prototype.ngDoCheck = function () {
            var _this = this;
            if (!this.chart) {
                return;
            }
            /** @type {?} */
            var updateRequired = UpdateType.Default;
            /** @type {?} */
            var wantUpdate = ( /**
             * @param {?} x
             * @return {?}
             */function (x) {
                updateRequired = x > updateRequired ? x : updateRequired;
            });
            if (!!this.data !== this.old.dataExists) {
                this.propagateDataToDatasets(this.data);
                this.old.dataExists = !!this.data;
                wantUpdate(UpdateType.Update);
            }
            if (this.data && this.data.length !== this.old.dataLength) {
                this.old.dataLength = this.data && this.data.length || 0;
                wantUpdate(UpdateType.Update);
            }
            if (!!this.datasets !== this.old.datasetsExists) {
                this.old.datasetsExists = !!this.datasets;
                wantUpdate(UpdateType.Update);
            }
            if (this.datasets && this.datasets.length !== this.old.datasetsLength) {
                this.old.datasetsLength = this.datasets && this.datasets.length || 0;
                wantUpdate(UpdateType.Update);
            }
            if (this.datasets && this.datasets.filter(( /**
             * @param {?} x
             * @param {?} i
             * @return {?}
             */function (x, i) { return x.data !== _this.old.datasetsDataObjects[i]; })).length) {
                this.old.datasetsDataObjects = this.datasets.map(( /**
                 * @param {?} x
                 * @return {?}
                 */function (/**
                 * @param {?} x
                 * @return {?}
                 */ x) { return x.data; }));
                wantUpdate(UpdateType.Update);
            }
            if (this.datasets && this.datasets.filter(( /**
             * @param {?} x
             * @param {?} i
             * @return {?}
             */function (x, i) { return x.data.length !== _this.old.datasetsDataLengths[i]; })).length) {
                this.old.datasetsDataLengths = this.datasets.map(( /**
                 * @param {?} x
                 * @return {?}
                 */function (/**
                 * @param {?} x
                 * @return {?}
                 */ x) { return x.data.length; }));
                wantUpdate(UpdateType.Update);
            }
            if (!!this.colors !== this.old.colorsExists) {
                this.old.colorsExists = !!this.colors;
                this.updateColors();
                wantUpdate(UpdateType.Update);
            }
            // This smells of inefficiency, might need to revisit this
            if (this.colors && this.colors.filter(( /**
             * @param {?} x
             * @param {?} i
             * @return {?}
             */function (x, i) { return !_this.colorsEqual(x, _this.old.colors[i]); })).length) {
                this.old.colors = this.colors.map(( /**
                 * @param {?} x
                 * @return {?}
                 */function (/**
                 * @param {?} x
                 * @return {?}
                 */ x) { return _this.copyColor(x); }));
                this.updateColors();
                wantUpdate(UpdateType.Update);
            }
            if (!!this.labels !== this.old.labelsExist) {
                this.old.labelsExist = !!this.labels;
                wantUpdate(UpdateType.Update);
            }
            if (this.labels && this.labels.filter(( /**
             * @param {?} x
             * @param {?} i
             * @return {?}
             */function (x, i) { return !_this.labelsEqual(x, _this.old.labels[i]); })).length) {
                this.old.labels = this.labels.map(( /**
                 * @param {?} x
                 * @return {?}
                 */function (/**
                 * @param {?} x
                 * @return {?}
                 */ x) { return _this.copyLabel(x); }));
                wantUpdate(UpdateType.Update);
            }
            if (!!this.options.legend !== this.old.legendExists) {
                this.old.legendExists = !!this.options.legend;
                wantUpdate(UpdateType.Refresh);
            }
            if (this.options.legend && this.options.legend.position !== this.old.legend.position) {
                this.old.legend.position = this.options.legend.position;
                wantUpdate(UpdateType.Refresh);
            }
            switch (( /** @type {?} */(updateRequired))) {
                case UpdateType.Default:
                    break;
                case UpdateType.Update:
                    this.update();
                    break;
                case UpdateType.Refresh:
                    this.refresh();
                    break;
            }
        };
        /**
         * @param {?} a
         * @return {?}
         */
        BaseChartDirective.prototype.copyLabel = function (a) {
            if (Array.isArray(a)) {
                return __spread(a);
            }
            return a;
        };
        /**
         * @param {?} a
         * @param {?} b
         * @return {?}
         */
        BaseChartDirective.prototype.labelsEqual = function (a, b) {
            return Array.isArray(a) === Array.isArray(b)
                && (Array.isArray(a) || a === b)
                && (!Array.isArray(a) || a.length === b.length)
                && (!Array.isArray(a) || a.filter(( /**
                 * @param {?} x
                 * @param {?} i
                 * @return {?}
                 */function (x, i) { return x !== b[i]; })).length === 0);
        };
        /**
         * @param {?} a
         * @return {?}
         */
        BaseChartDirective.prototype.copyColor = function (a) {
            return {
                backgroundColor: a.backgroundColor,
                borderWidth: a.borderWidth,
                borderColor: a.borderColor,
                borderCapStyle: a.borderCapStyle,
                borderDash: a.borderDash,
                borderDashOffset: a.borderDashOffset,
                borderJoinStyle: a.borderJoinStyle,
                pointBorderColor: a.pointBorderColor,
                pointBackgroundColor: a.pointBackgroundColor,
                pointBorderWidth: a.pointBorderWidth,
                pointRadius: a.pointRadius,
                pointHoverRadius: a.pointHoverRadius,
                pointHitRadius: a.pointHitRadius,
                pointHoverBackgroundColor: a.pointHoverBackgroundColor,
                pointHoverBorderColor: a.pointHoverBorderColor,
                pointHoverBorderWidth: a.pointHoverBorderWidth,
                pointStyle: a.pointStyle,
                hoverBackgroundColor: a.hoverBackgroundColor,
                hoverBorderColor: a.hoverBorderColor,
                hoverBorderWidth: a.hoverBorderWidth,
            };
        };
        /**
         * @param {?} a
         * @param {?} b
         * @return {?}
         */
        BaseChartDirective.prototype.colorsEqual = function (a, b) {
            if (!a !== !b) {
                return false;
            }
            return !a ||
                (a.backgroundColor === b.backgroundColor)
                    && (a.borderWidth === b.borderWidth)
                    && (a.borderColor === b.borderColor)
                    && (a.borderCapStyle === b.borderCapStyle)
                    && (a.borderDash === b.borderDash)
                    && (a.borderDashOffset === b.borderDashOffset)
                    && (a.borderJoinStyle === b.borderJoinStyle)
                    && (a.pointBorderColor === b.pointBorderColor)
                    && (a.pointBackgroundColor === b.pointBackgroundColor)
                    && (a.pointBorderWidth === b.pointBorderWidth)
                    && (a.pointRadius === b.pointRadius)
                    && (a.pointHoverRadius === b.pointHoverRadius)
                    && (a.pointHitRadius === b.pointHitRadius)
                    && (a.pointHoverBackgroundColor === b.pointHoverBackgroundColor)
                    && (a.pointHoverBorderColor === b.pointHoverBorderColor)
                    && (a.pointHoverBorderWidth === b.pointHoverBorderWidth)
                    && (a.pointStyle === b.pointStyle)
                    && (a.hoverBackgroundColor === b.hoverBackgroundColor)
                    && (a.hoverBorderColor === b.hoverBorderColor)
                    && (a.hoverBorderWidth === b.hoverBorderWidth);
        };
        /**
         * @return {?}
         */
        BaseChartDirective.prototype.updateColors = function () {
            var _this = this;
            this.datasets.forEach(( /**
             * @param {?} elm
             * @param {?} index
             * @return {?}
             */function (elm, index) {
                if (_this.colors && _this.colors[index]) {
                    Object.assign(elm, _this.colors[index]);
                }
                else {
                    Object.assign(elm, getColors(_this.chartType, index, elm.data.length), Object.assign({}, elm));
                }
            }));
        };
        /**
         * @param {?} changes
         * @return {?}
         */
        BaseChartDirective.prototype.ngOnChanges = function (changes) {
            /** @type {?} */
            var updateRequired = UpdateType.Default;
            /** @type {?} */
            var wantUpdate = ( /**
             * @param {?} x
             * @return {?}
             */function (x) {
                updateRequired = x > updateRequired ? x : updateRequired;
            });
            // Check if the changes are in the data or datasets or labels or legend
            if (changes.hasOwnProperty('data') && changes.data.currentValue) {
                this.propagateDataToDatasets(changes.data.currentValue);
                wantUpdate(UpdateType.Update);
            }
            if (changes.hasOwnProperty('datasets') && changes.datasets.currentValue) {
                this.propagateDatasetsToData(changes.datasets.currentValue);
                wantUpdate(UpdateType.Update);
            }
            if (changes.hasOwnProperty('labels')) {
                if (this.chart) {
                    this.chart.data.labels = changes.labels.currentValue;
                }
                wantUpdate(UpdateType.Update);
            }
            if (changes.hasOwnProperty('legend')) {
                if (this.chart) {
                    this.chart.config.options.legend.display = changes.legend.currentValue;
                    this.chart.generateLegend();
                }
                wantUpdate(UpdateType.Update);
            }
            if (changes.hasOwnProperty('options')) {
                wantUpdate(UpdateType.Refresh);
            }
            switch (( /** @type {?} */(updateRequired))) {
                case UpdateType.Update:
                    this.update();
                    break;
                case UpdateType.Refresh:
                case UpdateType.Default:
                    this.refresh();
                    break;
            }
        };
        /**
         * @return {?}
         */
        BaseChartDirective.prototype.ngOnDestroy = function () {
            if (this.chart) {
                this.chart.destroy();
                this.chart = void 0;
            }
            this.subs.forEach(( /**
             * @param {?} x
             * @return {?}
             */function (/**
             * @param {?} x
             * @return {?}
             */ x) { return x.unsubscribe(); }));
        };
        /**
         * @param {?=} duration
         * @return {?}
         */
        BaseChartDirective.prototype.update = function (duration) {
            if (this.chart) {
                return this.chart.update(duration);
            }
        };
        /**
         * @param {?} index
         * @param {?} hidden
         * @return {?}
         */
        BaseChartDirective.prototype.hideDataset = function (index, hidden) {
            this.chart.getDatasetMeta(index).hidden = hidden;
            this.chart.update();
        };
        /**
         * @param {?} index
         * @return {?}
         */
        BaseChartDirective.prototype.isDatasetHidden = function (index) {
            return this.chart.getDatasetMeta(index).hidden;
        };
        /**
         * @return {?}
         */
        BaseChartDirective.prototype.toBase64Image = function () {
            return this.chart.toBase64Image();
        };
        /**
         * @return {?}
         */
        BaseChartDirective.prototype.getChartConfiguration = function () {
            var _this = this;
            /** @type {?} */
            var datasets = this.getDatasets();
            /** @type {?} */
            var options = Object.assign({}, this.options);
            if (this.legend === false) {
                options.legend = { display: false };
            }
            // hook for onHover and onClick events
            options.hover = options.hover || {};
            if (!options.hover.onHover) {
                options.hover.onHover = ( /**
                 * @param {?} event
                 * @param {?} active
                 * @return {?}
                 */function (event, active) {
                    if (active && !active.length) {
                        return;
                    }
                    _this.chartHover.emit({ event: event, active: active });
                });
            }
            if (!options.onClick) {
                options.onClick = ( /**
                 * @param {?=} event
                 * @param {?=} active
                 * @return {?}
                 */function (event, active) {
                    _this.chartClick.emit({ event: event, active: active });
                });
            }
            /** @type {?} */
            var mergedOptions = this.smartMerge(options, this.themeService.getColorschemesOptions());
            return {
                type: this.chartType,
                data: {
                    labels: this.labels || [],
                    datasets: datasets
                },
                plugins: this.plugins,
                options: mergedOptions,
            };
        };
        /**
         * @param {?} ctx
         * @return {?}
         */
        BaseChartDirective.prototype.getChartBuilder = function (ctx /*, data:any[], options:any*/) {
            /** @type {?} */
            var chartConfig = this.getChartConfiguration();
            return new chart_js.Chart(ctx, chartConfig);
        };
        /**
         * @param {?} options
         * @param {?} overrides
         * @param {?=} level
         * @return {?}
         */
        BaseChartDirective.prototype.smartMerge = function (options, overrides, level) {
            var _this = this;
            if (level === void 0) { level = 0; }
            if (level === 0) {
                options = lodashEs.cloneDeep(options);
            }
            /** @type {?} */
            var keysToUpdate = Object.keys(overrides);
            keysToUpdate.forEach(( /**
             * @param {?} key
             * @return {?}
             */function (/**
             * @param {?} key
             * @return {?}
             */ key) {
                if (Array.isArray(overrides[key])) {
                    /** @type {?} */
                    var arrayElements = options[key];
                    if (arrayElements) {
                        arrayElements.forEach(( /**
                         * @param {?} r
                         * @return {?}
                         */function (/**
                         * @param {?} r
                         * @return {?}
                         */ r) {
                            _this.smartMerge(r, overrides[key][0], level + 1);
                        }));
                    }
                }
                else if (typeof (overrides[key]) === 'object') {
                    if (!(key in options)) {
                        options[key] = {};
                    }
                    _this.smartMerge(options[key], overrides[key], level + 1);
                }
                else {
                    options[key] = overrides[key];
                }
            }));
            if (level === 0) {
                return options;
            }
        };
        /**
         * @private
         * @param {?} label
         * @return {?}
         */
        BaseChartDirective.prototype.isMultiLineLabel = function (label) {
            return Array.isArray(label);
        };
        /**
         * @private
         * @param {?} label
         * @return {?}
         */
        BaseChartDirective.prototype.joinLabel = function (label) {
            if (!label) {
                return null;
            }
            if (this.isMultiLineLabel(label)) {
                return label.join(' ');
            }
            else {
                return label;
            }
        };
        /**
         * @private
         * @param {?} datasets
         * @return {?}
         */
        BaseChartDirective.prototype.propagateDatasetsToData = function (datasets) {
            this.data = this.datasets.map(( /**
             * @param {?} r
             * @return {?}
             */function (/**
             * @param {?} r
             * @return {?}
             */ r) { return r.data; }));
            if (this.chart) {
                this.chart.data.datasets = datasets;
            }
            this.updateColors();
        };
        /**
         * @private
         * @param {?} newDataValues
         * @return {?}
         */
        BaseChartDirective.prototype.propagateDataToDatasets = function (newDataValues) {
            var _this = this;
            if (this.isMultiDataSet(newDataValues)) {
                if (this.datasets && newDataValues.length === this.datasets.length) {
                    this.datasets.forEach(( /**
                     * @param {?} dataset
                     * @param {?} i
                     * @return {?}
                     */function (dataset, i) {
                        dataset.data = newDataValues[i];
                    }));
                }
                else {
                    this.datasets = newDataValues.map(( /**
                     * @param {?} data
                     * @param {?} index
                     * @return {?}
                     */function (data, index) {
                        return { data: data, label: _this.joinLabel(_this.labels[index]) || "Label " + index };
                    }));
                    if (this.chart) {
                        this.chart.data.datasets = this.datasets;
                    }
                }
            }
            else {
                if (!this.datasets) {
                    this.datasets = [{ data: newDataValues }];
                    if (this.chart) {
                        this.chart.data.datasets = this.datasets;
                    }
                }
                else {
                    if (!this.datasets[0]) {
                        this.datasets[0] = {};
                    }
                    this.datasets[0].data = newDataValues;
                    this.datasets.splice(1); // Remove all elements but the first
                }
            }
            this.updateColors();
        };
        /**
         * @private
         * @param {?} data
         * @return {?}
         */
        BaseChartDirective.prototype.isMultiDataSet = function (data) {
            return Array.isArray(data[0]);
        };
        /**
         * @private
         * @return {?}
         */
        BaseChartDirective.prototype.getDatasets = function () {
            if (!this.datasets && !this.data) {
                throw new Error("ng-charts configuration error, data or datasets field are required to render chart " + this.chartType);
            }
            // If `datasets` is defined, use it over the `data` property.
            if (this.datasets) {
                this.propagateDatasetsToData(this.datasets);
                return this.datasets;
            }
            if (this.data) {
                this.propagateDataToDatasets(this.data);
                return this.datasets;
            }
        };
        /**
         * @private
         * @return {?}
         */
        BaseChartDirective.prototype.refresh = function () {
            // if (this.options && this.options.responsive) {
            //   setTimeout(() => this.refresh(), 50);
            // }
            // todo: remove this line, it is producing flickering
            if (this.chart) {
                this.chart.destroy();
                this.chart = void 0;
            }
            if (this.ctx) {
                this.chart = this.getChartBuilder(this.ctx /*, data, this.options*/);
            }
        };
        return BaseChartDirective;
    }());
    BaseChartDirective.decorators = [
        { type: i0.Directive, args: [{
                    // tslint:disable-next-line:directive-selector
                    selector: 'canvas[baseChart]',
                    exportAs: 'base-chart'
                },] }
    ];
    /** @nocollapse */
    BaseChartDirective.ctorParameters = function () { return [
        { type: i0.ElementRef },
        { type: ThemeService }
    ]; };
    BaseChartDirective.propDecorators = {
        data: [{ type: i0.Input }],
        datasets: [{ type: i0.Input }],
        labels: [{ type: i0.Input }],
        options: [{ type: i0.Input }],
        chartType: [{ type: i0.Input }],
        colors: [{ type: i0.Input }],
        legend: [{ type: i0.Input }],
        plugins: [{ type: i0.Input }],
        chartClick: [{ type: i0.Output }],
        chartHover: [{ type: i0.Output }]
    };
    if (false) {
        /** @type {?} */
        BaseChartDirective.prototype.data;
        /** @type {?} */
        BaseChartDirective.prototype.datasets;
        /** @type {?} */
        BaseChartDirective.prototype.labels;
        /** @type {?} */
        BaseChartDirective.prototype.options;
        /** @type {?} */
        BaseChartDirective.prototype.chartType;
        /** @type {?} */
        BaseChartDirective.prototype.colors;
        /** @type {?} */
        BaseChartDirective.prototype.legend;
        /** @type {?} */
        BaseChartDirective.prototype.plugins;
        /** @type {?} */
        BaseChartDirective.prototype.chartClick;
        /** @type {?} */
        BaseChartDirective.prototype.chartHover;
        /** @type {?} */
        BaseChartDirective.prototype.ctx;
        /** @type {?} */
        BaseChartDirective.prototype.chart;
        /**
         * @type {?}
         * @private
         */
        BaseChartDirective.prototype.old;
        /**
         * @type {?}
         * @private
         */
        BaseChartDirective.prototype.subs;
        /**
         * @type {?}
         * @private
         */
        BaseChartDirective.prototype.element;
        /**
         * @type {?}
         * @private
         */
        BaseChartDirective.prototype.themeService;
    }

    /**
     * @fileoverview added by tsickle
     * Generated from: lib/charts.module.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    var ChartsModule = /** @class */ (function () {
        function ChartsModule() {
        }
        return ChartsModule;
    }());
    ChartsModule.decorators = [
        { type: i0.NgModule, args: [{
                    declarations: [
                        BaseChartDirective
                    ],
                    imports: [],
                    exports: [
                        BaseChartDirective
                    ]
                },] }
    ];

    /**
     * @fileoverview added by tsickle
     * Generated from: lib/monkey-patch-chart-js-legend.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    // tslint:disable:variable-name
    // tslint:disable:no-var-keyword
    // tslint:disable:prefer-const
    // tslint:disable:only-arrow-functions
    // tslint:disable:one-variable-per-declaration
    // tslint:disable:object-literal-shorthand
    // tslint:disable:space-before-function-paren
    /**
     * @return {?}
     */
    function monkeyPatchChartJsLegend() {
        if (typeof Chart === 'undefined') {
            console.log('Chart not defined (guessing this is a universal build, and I don\'t know why this happens -- Aviad)');
            return;
        }
        /** @type {?} */
        var plugins = Chart.plugins.getAll();
        /** @type {?} */
        var legend = plugins.filter(( /**
         * @param {?} p
         * @return {?}
         */function (/**
         * @param {?} p
         * @return {?}
         */ p) { return p.id === 'legend'; }))[0];
        legend._element.prototype.fit = fit;
        legend._element.prototype.draw = draw;
        /** @type {?} */
        var helpers = Chart.helpers;
        /** @type {?} */
        var defaults = Chart.defaults;
        /** @type {?} */
        var valueOrDefault = helpers.valueOrDefault;
        /**
         * @param {?} labelOpts
         * @param {?} fontSize
         * @return {?}
         */
        function getBoxWidth(labelOpts, fontSize) {
            return labelOpts.usePointStyle && labelOpts.boxWidth > fontSize ?
                fontSize :
                labelOpts.boxWidth;
        }
        /**
         * @return {?}
         */
        function fit() {
            /** @type {?} */
            var me = this;
            /** @type {?} */
            var opts = me.options;
            /** @type {?} */
            var labelOpts = opts.labels;
            /** @type {?} */
            var display = opts.display;
            /** @type {?} */
            var ctx = me.ctx;
            /** @type {?} */
            var labelFont = helpers.options._parseFont(labelOpts);
            /** @type {?} */
            var fontSize = labelFont.size;
            // Reset hit boxes
            /** @type {?} */
            var hitboxes = me.legendHitBoxes = [];
            /** @type {?} */
            var minSize = me.minSize;
            /** @type {?} */
            var isHorizontal = me.isHorizontal();
            if (isHorizontal) {
                minSize.width = me.maxWidth; // fill all the width
                minSize.height = display ? 10 : 0;
            }
            else {
                minSize.width = display ? 10 : 0;
                minSize.height = me.maxHeight; // fill all the height
            }
            /** @type {?} */
            var getMaxLineWidth = ( /**
             * @param {?} textLines
             * @return {?}
             */function (textLines) {
                return textLines.map(( /**
                 * @param {?} textLine
                 * @return {?}
                 */function (textLine) {
                    return ctx.measureText(textLine).width;
                })).reduce(( /**
                 * @param {?} acc
                 * @param {?} v
                 * @return {?}
                 */function (acc, v) {
                    return v > acc ? v : acc;
                }), 0);
            });
            // Increase sizes here
            if (display) {
                ctx.font = labelFont.string;
                if (isHorizontal) {
                    // Labels
                    // Width of each line of legend boxes. Labels wrap onto multiple lines when there are too many to fit on one
                    /** @type {?} */
                    var lineWidths = me.lineWidths = [0];
                    /** @type {?} */
                    var lineHeights = me.lineHeights = [];
                    /** @type {?} */
                    var currentLineHeight = 0;
                    /** @type {?} */
                    var lineIndex = 0;
                    ctx.textAlign = 'left';
                    ctx.textBaseline = 'top';
                    helpers.each(me.legendItems, ( /**
                     * @param {?} legendItem
                     * @param {?} i
                     * @return {?}
                     */function (legendItem, i) {
                        /** @type {?} */
                        var width;
                        /** @type {?} */
                        var height;
                        if (helpers.isArray(legendItem.text)) {
                            width = getMaxLineWidth(legendItem.text);
                            height = fontSize * legendItem.text.length + labelOpts.padding;
                        }
                        else {
                            width = ctx.measureText(legendItem.text).width;
                            height = fontSize + labelOpts.padding;
                        }
                        width += getBoxWidth(labelOpts, fontSize) + (fontSize / 2);
                        if (lineWidths[lineWidths.length - 1] + width + 2 * labelOpts.padding > minSize.width) {
                            lineHeights.push(currentLineHeight);
                            currentLineHeight = 0;
                            lineWidths[lineWidths.length - (i > 0 ? 0 : 1)] = 0;
                            lineIndex++;
                        }
                        legendItem.lineOrColumnIndex = lineIndex;
                        if (height > currentLineHeight) {
                            currentLineHeight = height;
                        }
                        // Store the hitbox width and height here. Final position will be updated in `draw`
                        hitboxes[i] = {
                            left: 0,
                            top: 0,
                            width: width,
                            height: height,
                        };
                        lineWidths[lineWidths.length - 1] += width + labelOpts.padding;
                    }));
                    lineHeights.push(currentLineHeight);
                    minSize.height += lineHeights.reduce(( /**
                     * @param {?} acc
                     * @param {?} v
                     * @return {?}
                     */function (acc, v) {
                        return acc + v;
                    }), 0);
                }
                else {
                    /** @type {?} */
                    var vPadding = labelOpts.padding;
                    /** @type {?} */
                    var columnWidths = me.columnWidths = [];
                    /** @type {?} */
                    var columnHeights = me.columnHeights = [];
                    /** @type {?} */
                    var totalWidth = labelOpts.padding;
                    /** @type {?} */
                    var currentColWidth = 0;
                    /** @type {?} */
                    var currentColHeight = 0;
                    /** @type {?} */
                    var columnIndex = 0;
                    helpers.each(me.legendItems, ( /**
                     * @param {?} legendItem
                     * @param {?} i
                     * @return {?}
                     */function (legendItem, i) {
                        /** @type {?} */
                        var itemWidth;
                        /** @type {?} */
                        var height;
                        if (helpers.isArray(legendItem.text)) {
                            itemWidth = getMaxLineWidth(legendItem.text);
                            height = fontSize * legendItem.text.length;
                        }
                        else {
                            itemWidth = ctx.measureText(legendItem.text).width;
                            height = fontSize;
                        }
                        itemWidth += getBoxWidth(labelOpts, fontSize) + (fontSize / 2);
                        // If too tall, go to new column
                        if (currentColHeight + fontSize + 2 * vPadding > minSize.height) {
                            totalWidth += currentColWidth + labelOpts.padding;
                            columnWidths.push(currentColWidth); // previous column width
                            columnHeights.push(currentColHeight);
                            currentColWidth = 0;
                            currentColHeight = 0;
                            columnIndex++;
                        }
                        legendItem.lineOrColumnIndex = columnIndex;
                        // Get max width
                        currentColWidth = Math.max(currentColWidth, itemWidth);
                        currentColHeight += height + vPadding;
                        // Store the hitbox width and height here. Final position will be updated in `draw`
                        hitboxes[i] = {
                            left: 0,
                            top: 0,
                            width: itemWidth,
                            height: height
                        };
                    }));
                    totalWidth += currentColWidth;
                    columnWidths.push(currentColWidth);
                    columnHeights.push(currentColHeight);
                    minSize.width += totalWidth;
                }
            }
            me.width = minSize.width;
            me.height = minSize.height;
        }
        /**
         * @return {?}
         */
        function draw() {
            /** @type {?} */
            var me = this;
            /** @type {?} */
            var opts = me.options;
            /** @type {?} */
            var labelOpts = opts.labels;
            /** @type {?} */
            var globalDefaults = defaults.global;
            /** @type {?} */
            var defaultColor = globalDefaults.defaultColor;
            /** @type {?} */
            var lineDefault = globalDefaults.elements.line;
            /** @type {?} */
            var legendHeight = me.height;
            /** @type {?} */
            var columnHeights = me.columnHeights;
            /** @type {?} */
            var columnWidths = me.columnWidths;
            /** @type {?} */
            var legendWidth = me.width;
            /** @type {?} */
            var lineWidths = me.lineWidths;
            /** @type {?} */
            var lineHeights = me.lineHeights;
            if (opts.display) {
                /** @type {?} */
                var ctx = me.ctx;
                /** @type {?} */
                var fontColor = valueOrDefault(labelOpts.fontColor, globalDefaults.defaultFontColor);
                /** @type {?} */
                var labelFont = helpers.options._parseFont(labelOpts);
                /** @type {?} */
                var fontSize = labelFont.size;
                /** @type {?} */
                var cursor;
                // Canvas setup
                ctx.textAlign = 'left';
                ctx.textBaseline = 'middle';
                ctx.lineWidth = 0.5;
                ctx.strokeStyle = fontColor; // for strikethrough effect
                ctx.fillStyle = fontColor; // render in correct colour
                ctx.font = labelFont.string;
                /** @type {?} */
                var boxWidth = getBoxWidth(labelOpts, fontSize);
                /** @type {?} */
                var hitboxes = me.legendHitBoxes;
                // current position
                /** @type {?} */
                var drawLegendBox = ( /**
                 * @param {?} x
                 * @param {?} y
                 * @param {?} legendItem
                 * @return {?}
                 */function (x, y, legendItem) {
                    if (isNaN(boxWidth) || boxWidth <= 0) {
                        return;
                    }
                    // Set the ctx for the box
                    ctx.save();
                    /** @type {?} */
                    var lineWidth = valueOrDefault(legendItem.lineWidth, lineDefault.borderWidth);
                    ctx.fillStyle = valueOrDefault(legendItem.fillStyle, defaultColor);
                    ctx.lineCap = valueOrDefault(legendItem.lineCap, lineDefault.borderCapStyle);
                    ctx.lineDashOffset = valueOrDefault(legendItem.lineDashOffset, lineDefault.borderDashOffset);
                    ctx.lineJoin = valueOrDefault(legendItem.lineJoin, lineDefault.borderJoinStyle);
                    ctx.lineWidth = lineWidth;
                    ctx.strokeStyle = valueOrDefault(legendItem.strokeStyle, defaultColor);
                    if (ctx.setLineDash) {
                        // IE 9 and 10 do not support line dash
                        ctx.setLineDash(valueOrDefault(legendItem.lineDash, lineDefault.borderDash));
                    }
                    if (opts.labels && opts.labels.usePointStyle) {
                        // Recalculate x and y for drawPoint() because its expecting
                        // x and y to be center of figure (instead of top left)
                        /** @type {?} */
                        var radius = boxWidth * Math.SQRT2 / 2;
                        /** @type {?} */
                        var centerX = x + boxWidth / 2;
                        /** @type {?} */
                        var centerY = y + fontSize / 2;
                        // Draw pointStyle as legend symbol
                        helpers.canvas.drawPoint(ctx, legendItem.pointStyle, radius, centerX, centerY);
                    }
                    else {
                        // Draw box as legend symbol
                        if (lineWidth !== 0) {
                            ctx.strokeRect(x, y, boxWidth, fontSize);
                        }
                        ctx.fillRect(x, y, boxWidth, fontSize);
                    }
                    ctx.restore();
                });
                /** @type {?} */
                var drawStrikeThrough = ( /**
                 * @param {?} x
                 * @param {?} y
                 * @param {?} w
                 * @return {?}
                 */function (x, y, w) {
                    ctx.beginPath();
                    ctx.lineWidth = 2;
                    ctx.moveTo(x, y);
                    ctx.lineTo(x + w, y);
                    ctx.stroke();
                });
                /** @type {?} */
                var drawCrossOver = ( /**
                 * @param {?} x
                 * @param {?} y
                 * @param {?} w
                 * @param {?} h
                 * @return {?}
                 */function (x, y, w, h) {
                    ctx.beginPath();
                    ctx.lineWidth = 2;
                    ctx.moveTo(x, y);
                    ctx.lineTo(x + w, y + h);
                    ctx.moveTo(x, y + h);
                    ctx.lineTo(x + w, y);
                    ctx.stroke();
                });
                /** @type {?} */
                var fillText = ( /**
                 * @param {?} x
                 * @param {?} y
                 * @param {?} legendItem
                 * @param {?} textWidth
                 * @return {?}
                 */function (x, y, legendItem, textWidth) {
                    /** @type {?} */
                    var halfFontSize = fontSize / 2;
                    /** @type {?} */
                    var xLeft = boxWidth + halfFontSize + x;
                    /** @type {?} */
                    var yMiddle = y + halfFontSize;
                    if (helpers.isArray(legendItem.text)) {
                        helpers.each(legendItem.text, ( /**
                         * @param {?} textLine
                         * @param {?} index
                         * @return {?}
                         */function (textLine, index) {
                            /** @type {?} */
                            var lineOffset = index * fontSize;
                            ctx.fillText(textLine, xLeft, yMiddle + lineOffset);
                        }));
                    }
                    else {
                        ctx.fillText(legendItem.text, xLeft, yMiddle);
                    }
                    if (legendItem.hidden) {
                        if (helpers.isArray(legendItem.text)) {
                            drawCrossOver(xLeft, yMiddle, textWidth, (legendItem.text.length - 1) * (fontSize - 1));
                        }
                        else {
                            drawStrikeThrough(xLeft, yMiddle, textWidth);
                        }
                    }
                });
                /** @type {?} */
                var alignmentOffset = ( /**
                 * @param {?} dimension
                 * @param {?} blockSize
                 * @return {?}
                 */function (dimension, blockSize) {
                    switch (opts.align) {
                        case 'start':
                            return labelOpts.padding;
                        case 'end':
                            return dimension - blockSize;
                        default: // center
                            return (dimension - blockSize + labelOpts.padding) / 2;
                    }
                });
                // Horizontal
                /** @type {?} */
                var isHorizontal = me.isHorizontal();
                if (isHorizontal) {
                    cursor = {
                        x: me.left + alignmentOffset(legendWidth, lineWidths[0]),
                        y: me.top + labelOpts.padding,
                        line: 0
                    };
                }
                else {
                    cursor = {
                        x: me.left + labelOpts.padding,
                        y: me.top + alignmentOffset(legendHeight, columnHeights[0]),
                        line: 0
                    };
                }
                helpers.each(me.legendItems, ( /**
                 * @param {?} legendItem
                 * @param {?} i
                 * @return {?}
                 */function (legendItem, i) {
                    /** @type {?} */
                    var textWidth;
                    /** @type {?} */
                    var height;
                    /** @type {?} */
                    var boxTopOffset;
                    if (legendItem.lineOrColumnIndex > cursor.line) {
                        if (isHorizontal) {
                            cursor.y += lineHeights[cursor.line];
                            cursor.line = legendItem.lineOrColumnIndex;
                            cursor.x = me.left + alignmentOffset(legendWidth, lineWidths[cursor.line]);
                        }
                        else {
                            cursor.x += columnWidths[cursor.line] + labelOpts.padding;
                            cursor.line = legendItem.lineOrColumnIndex;
                            cursor.y = me.top + alignmentOffset(legendHeight, columnHeights[cursor.line]);
                        }
                    }
                    if (helpers.isArray(legendItem.text)) {
                        textWidth = legendItem.text.map(( /**
                         * @param {?} textLine
                         * @return {?}
                         */function (textLine) {
                            return ctx.measureText(textLine).width;
                        })).reduce(( /**
                         * @param {?} acc
                         * @param {?} v
                         * @return {?}
                         */function (acc, v) {
                            return v > acc ? v : acc;
                        }), 0);
                        boxTopOffset = fontSize / 2 * (legendItem.text.length - 1);
                        height = fontSize * legendItem.text.length;
                    }
                    else {
                        textWidth = ctx.measureText(legendItem.text).width;
                        boxTopOffset = 0;
                        height = fontSize;
                    }
                    /** @type {?} */
                    var width = boxWidth + (fontSize / 2) + textWidth;
                    /** @type {?} */
                    var x = cursor.x;
                    /** @type {?} */
                    var y = cursor.y;
                    /** @type {?} */
                    var topOffset = isHorizontal ? Math.trunc((lineHeights[cursor.line] - hitboxes[i].height) / 2) : 0;
                    drawLegendBox(x, y + boxTopOffset + topOffset, legendItem);
                    hitboxes[i].left = x;
                    hitboxes[i].top = y;
                    // Fill the actual label
                    fillText(x, y + topOffset, legendItem, textWidth);
                    if (isHorizontal) {
                        cursor.x += width + labelOpts.padding;
                    }
                    else {
                        cursor.y += height + labelOpts.padding;
                    }
                }));
            }
        }
    }

    /**
     * @fileoverview added by tsickle
     * Generated from: lib/monkey-patch-chart-js-tooltip.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */
    // tslint:disable:variable-name
    // tslint:disable:no-var-keyword
    // tslint:disable:prefer-const
    // tslint:disable:only-arrow-functions
    // tslint:disable:one-variable-per-declaration
    // tslint:disable:object-literal-shorthand
    // tslint:disable:space-before-function-paren
    /**
     * @return {?}
     */
    function monkeyPatchChartJsTooltip() {
        if (typeof Chart === 'undefined') {
            console.log('Chart not defined (guessing this is a universal build, and I don\'t know why this happens -- Aviad)');
            return;
        }
        Chart.Tooltip.prototype.drawBody = drawBody;
        /** @type {?} */
        var helpers = Chart.helpers;
        /**
         * @param {?} vm
         * @param {?} align
         * @return {?}
         */
        function getAlignedX(vm, align) {
            return align === 'center'
                ? vm.x + vm.width / 2
                : align === 'right'
                    ? vm.x + vm.width - vm.xPadding
                    : vm.x + vm.xPadding;
        }
        /**
         * @param {?} pt
         * @param {?} vm
         * @param {?} ctx
         * @return {?}
         */
        function drawBody(pt, vm, ctx) {
            /** @type {?} */
            var bodyFontSize = vm.bodyFontSize;
            /** @type {?} */
            var bodySpacing = vm.bodySpacing;
            /** @type {?} */
            var bodyAlign = vm._bodyAlign;
            /** @type {?} */
            var body = vm.body;
            /** @type {?} */
            var drawColorBoxes = vm.displayColors;
            /** @type {?} */
            var labelColors = vm.labelColors;
            /** @type {?} */
            var xLinePadding = 0;
            /** @type {?} */
            var colorX = drawColorBoxes ? getAlignedX(vm, 'left') : 0;
            /** @type {?} */
            var textColor;
            ctx.textAlign = bodyAlign;
            ctx.textBaseline = 'top';
            ctx.font = helpers.fontString(bodyFontSize, vm._bodyFontStyle, vm._bodyFontFamily);
            pt.x = getAlignedX(vm, bodyAlign);
            // Before Body
            /** @type {?} */
            var fillLineOfText = ( /**
             * @param {?} line
             * @return {?}
             */function (line) {
                ctx.fillText(line, pt.x + xLinePadding, pt.y);
                pt.y += bodyFontSize + bodySpacing;
            });
            // Before body lines
            ctx.fillStyle = vm.bodyFontColor;
            helpers.each(vm.beforeBody, fillLineOfText);
            xLinePadding = drawColorBoxes && bodyAlign !== 'right'
                ? bodyAlign === 'center' ? (bodyFontSize / 2 + 1) : (bodyFontSize + 2)
                : 0;
            // Draw body lines now
            helpers.each(body, ( /**
             * @param {?} bodyItem
             * @param {?} i
             * @return {?}
             */function (bodyItem, i) {
                textColor = vm.labelTextColors[i];
                ctx.fillStyle = textColor;
                helpers.each(bodyItem.before, fillLineOfText);
                // Draw Legend-like boxes if needed
                if (drawColorBoxes) {
                    // Fill a white rect so that colours merge nicely if the opacity is < 1
                    ctx.fillStyle = vm.legendColorBackground;
                    ctx.fillRect(colorX, pt.y, bodyFontSize, bodyFontSize);
                    // Border
                    ctx.lineWidth = 1;
                    ctx.strokeStyle = labelColors[i].borderColor;
                    ctx.strokeRect(colorX, pt.y, bodyFontSize, bodyFontSize);
                    // Inner square
                    ctx.fillStyle = labelColors[i].backgroundColor;
                    ctx.fillRect(colorX + 1, pt.y + 1, bodyFontSize - 2, bodyFontSize - 2);
                    ctx.fillStyle = textColor;
                }
                helpers.each(bodyItem.lines, fillLineOfText);
                helpers.each(bodyItem.after, fillLineOfText);
            }));
            // Reset back to 0 for after body
            xLinePadding = 0;
            // After body lines
            helpers.each(vm.afterBody, fillLineOfText);
            pt.y -= bodySpacing; // Remove last body spacing
        }
    }

    /**
     * @fileoverview added by tsickle
     * Generated from: public_api.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */

    /**
     * @fileoverview added by tsickle
     * Generated from: ng2-charts.ts
     * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
     */

    exports.BaseChartDirective = BaseChartDirective;
    exports.ChartsModule = ChartsModule;
    exports.ThemeService = ThemeService;
    exports.defaultColors = defaultColors;
    exports.monkeyPatchChartJsLegend = monkeyPatchChartJsLegend;
    exports.monkeyPatchChartJsTooltip = monkeyPatchChartJsTooltip;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=ng2-charts.umd.js.map
