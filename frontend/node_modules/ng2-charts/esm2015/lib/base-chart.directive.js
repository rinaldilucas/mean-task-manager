/**
 * @fileoverview added by tsickle
 * Generated from: lib/base-chart.directive.ts
 * @suppress {checkTypes,constantProperty,extraRequire,missingOverride,missingRequire,missingReturn,unusedPrivateMembers,uselessCode} checked by tsc
 */
import { Directive, ElementRef, EventEmitter, Input, Output, } from '@angular/core';
import { getColors } from './get-colors';
import { ThemeService } from './theme.service';
import { cloneDeep } from 'lodash-es';
import { Chart, pluginService } from 'chart.js';
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
const UpdateType = {
    Default: 0,
    Update: 1,
    Refresh: 2,
};
UpdateType[UpdateType.Default] = 'Default';
UpdateType[UpdateType.Update] = 'Update';
UpdateType[UpdateType.Refresh] = 'Refresh';
export class BaseChartDirective {
    /**
     * @param {?} element
     * @param {?} themeService
     */
    constructor(element, themeService) {
        this.element = element;
        this.themeService = themeService;
        this.options = {};
        this.chartClick = new EventEmitter();
        this.chartHover = new EventEmitter();
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
    static registerPlugin(plugin) {
        pluginService.register(plugin);
    }
    /**
     * @param {?} plugin
     * @return {?}
     */
    static unregisterPlugin(plugin) {
        pluginService.unregister(plugin);
    }
    /**
     * @return {?}
     */
    ngOnInit() {
        this.ctx = this.element.nativeElement.getContext('2d');
        this.refresh();
        this.subs.push(this.themeService.colorschemesOptions.subscribe((/**
         * @param {?} r
         * @return {?}
         */
        r => this.themeChanged(r))));
    }
    /**
     * @private
     * @param {?} options
     * @return {?}
     */
    themeChanged(options) {
        this.refresh();
    }
    /**
     * @return {?}
     */
    ngDoCheck() {
        if (!this.chart) {
            return;
        }
        /** @type {?} */
        let updateRequired = UpdateType.Default;
        /** @type {?} */
        const wantUpdate = (/**
         * @param {?} x
         * @return {?}
         */
        (x) => {
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
        if (this.datasets && this.datasets.filter((/**
         * @param {?} x
         * @param {?} i
         * @return {?}
         */
        (x, i) => x.data !== this.old.datasetsDataObjects[i])).length) {
            this.old.datasetsDataObjects = this.datasets.map((/**
             * @param {?} x
             * @return {?}
             */
            x => x.data));
            wantUpdate(UpdateType.Update);
        }
        if (this.datasets && this.datasets.filter((/**
         * @param {?} x
         * @param {?} i
         * @return {?}
         */
        (x, i) => x.data.length !== this.old.datasetsDataLengths[i])).length) {
            this.old.datasetsDataLengths = this.datasets.map((/**
             * @param {?} x
             * @return {?}
             */
            x => x.data.length));
            wantUpdate(UpdateType.Update);
        }
        if (!!this.colors !== this.old.colorsExists) {
            this.old.colorsExists = !!this.colors;
            this.updateColors();
            wantUpdate(UpdateType.Update);
        }
        // This smells of inefficiency, might need to revisit this
        if (this.colors && this.colors.filter((/**
         * @param {?} x
         * @param {?} i
         * @return {?}
         */
        (x, i) => !this.colorsEqual(x, this.old.colors[i]))).length) {
            this.old.colors = this.colors.map((/**
             * @param {?} x
             * @return {?}
             */
            x => this.copyColor(x)));
            this.updateColors();
            wantUpdate(UpdateType.Update);
        }
        if (!!this.labels !== this.old.labelsExist) {
            this.old.labelsExist = !!this.labels;
            wantUpdate(UpdateType.Update);
        }
        if (this.labels && this.labels.filter((/**
         * @param {?} x
         * @param {?} i
         * @return {?}
         */
        (x, i) => !this.labelsEqual(x, this.old.labels[i]))).length) {
            this.old.labels = this.labels.map((/**
             * @param {?} x
             * @return {?}
             */
            x => this.copyLabel(x)));
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
        switch ((/** @type {?} */ (updateRequired))) {
            case UpdateType.Default:
                break;
            case UpdateType.Update:
                this.update();
                break;
            case UpdateType.Refresh:
                this.refresh();
                break;
        }
    }
    /**
     * @param {?} a
     * @return {?}
     */
    copyLabel(a) {
        if (Array.isArray(a)) {
            return [...a];
        }
        return a;
    }
    /**
     * @param {?} a
     * @param {?} b
     * @return {?}
     */
    labelsEqual(a, b) {
        return Array.isArray(a) === Array.isArray(b)
            && (Array.isArray(a) || a === b)
            && (!Array.isArray(a) || a.length === b.length)
            && (!Array.isArray(a) || a.filter((/**
             * @param {?} x
             * @param {?} i
             * @return {?}
             */
            (x, i) => x !== b[i])).length === 0);
    }
    /**
     * @param {?} a
     * @return {?}
     */
    copyColor(a) {
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
    }
    /**
     * @param {?} a
     * @param {?} b
     * @return {?}
     */
    colorsEqual(a, b) {
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
    }
    /**
     * @return {?}
     */
    updateColors() {
        this.datasets.forEach((/**
         * @param {?} elm
         * @param {?} index
         * @return {?}
         */
        (elm, index) => {
            if (this.colors && this.colors[index]) {
                Object.assign(elm, this.colors[index]);
            }
            else {
                Object.assign(elm, getColors(this.chartType, index, elm.data.length), Object.assign({}, elm));
            }
        }));
    }
    /**
     * @param {?} changes
     * @return {?}
     */
    ngOnChanges(changes) {
        /** @type {?} */
        let updateRequired = UpdateType.Default;
        /** @type {?} */
        const wantUpdate = (/**
         * @param {?} x
         * @return {?}
         */
        (x) => {
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
        switch ((/** @type {?} */ (updateRequired))) {
            case UpdateType.Update:
                this.update();
                break;
            case UpdateType.Refresh:
            case UpdateType.Default:
                this.refresh();
                break;
        }
    }
    /**
     * @return {?}
     */
    ngOnDestroy() {
        if (this.chart) {
            this.chart.destroy();
            this.chart = void 0;
        }
        this.subs.forEach((/**
         * @param {?} x
         * @return {?}
         */
        x => x.unsubscribe()));
    }
    /**
     * @param {?=} duration
     * @return {?}
     */
    update(duration) {
        if (this.chart) {
            return this.chart.update(duration);
        }
    }
    /**
     * @param {?} index
     * @param {?} hidden
     * @return {?}
     */
    hideDataset(index, hidden) {
        this.chart.getDatasetMeta(index).hidden = hidden;
        this.chart.update();
    }
    /**
     * @param {?} index
     * @return {?}
     */
    isDatasetHidden(index) {
        return this.chart.getDatasetMeta(index).hidden;
    }
    /**
     * @return {?}
     */
    toBase64Image() {
        return this.chart.toBase64Image();
    }
    /**
     * @return {?}
     */
    getChartConfiguration() {
        /** @type {?} */
        const datasets = this.getDatasets();
        /** @type {?} */
        const options = Object.assign({}, this.options);
        if (this.legend === false) {
            options.legend = { display: false };
        }
        // hook for onHover and onClick events
        options.hover = options.hover || {};
        if (!options.hover.onHover) {
            options.hover.onHover = (/**
             * @param {?} event
             * @param {?} active
             * @return {?}
             */
            (event, active) => {
                if (active && !active.length) {
                    return;
                }
                this.chartHover.emit({ event, active });
            });
        }
        if (!options.onClick) {
            options.onClick = (/**
             * @param {?=} event
             * @param {?=} active
             * @return {?}
             */
            (event, active) => {
                this.chartClick.emit({ event, active });
            });
        }
        /** @type {?} */
        const mergedOptions = this.smartMerge(options, this.themeService.getColorschemesOptions());
        return {
            type: this.chartType,
            data: {
                labels: this.labels || [],
                datasets
            },
            plugins: this.plugins,
            options: mergedOptions,
        };
    }
    /**
     * @param {?} ctx
     * @return {?}
     */
    getChartBuilder(ctx /*, data:any[], options:any*/) {
        /** @type {?} */
        const chartConfig = this.getChartConfiguration();
        return new Chart(ctx, chartConfig);
    }
    /**
     * @param {?} options
     * @param {?} overrides
     * @param {?=} level
     * @return {?}
     */
    smartMerge(options, overrides, level = 0) {
        if (level === 0) {
            options = cloneDeep(options);
        }
        /** @type {?} */
        const keysToUpdate = Object.keys(overrides);
        keysToUpdate.forEach((/**
         * @param {?} key
         * @return {?}
         */
        key => {
            if (Array.isArray(overrides[key])) {
                /** @type {?} */
                const arrayElements = options[key];
                if (arrayElements) {
                    arrayElements.forEach((/**
                     * @param {?} r
                     * @return {?}
                     */
                    r => {
                        this.smartMerge(r, overrides[key][0], level + 1);
                    }));
                }
            }
            else if (typeof (overrides[key]) === 'object') {
                if (!(key in options)) {
                    options[key] = {};
                }
                this.smartMerge(options[key], overrides[key], level + 1);
            }
            else {
                options[key] = overrides[key];
            }
        }));
        if (level === 0) {
            return options;
        }
    }
    /**
     * @private
     * @param {?} label
     * @return {?}
     */
    isMultiLineLabel(label) {
        return Array.isArray(label);
    }
    /**
     * @private
     * @param {?} label
     * @return {?}
     */
    joinLabel(label) {
        if (!label) {
            return null;
        }
        if (this.isMultiLineLabel(label)) {
            return label.join(' ');
        }
        else {
            return label;
        }
    }
    /**
     * @private
     * @param {?} datasets
     * @return {?}
     */
    propagateDatasetsToData(datasets) {
        this.data = this.datasets.map((/**
         * @param {?} r
         * @return {?}
         */
        r => r.data));
        if (this.chart) {
            this.chart.data.datasets = datasets;
        }
        this.updateColors();
    }
    /**
     * @private
     * @param {?} newDataValues
     * @return {?}
     */
    propagateDataToDatasets(newDataValues) {
        if (this.isMultiDataSet(newDataValues)) {
            if (this.datasets && newDataValues.length === this.datasets.length) {
                this.datasets.forEach((/**
                 * @param {?} dataset
                 * @param {?} i
                 * @return {?}
                 */
                (dataset, i) => {
                    dataset.data = newDataValues[i];
                }));
            }
            else {
                this.datasets = newDataValues.map((/**
                 * @param {?} data
                 * @param {?} index
                 * @return {?}
                 */
                (data, index) => {
                    return { data, label: this.joinLabel(this.labels[index]) || `Label ${index}` };
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
    }
    /**
     * @private
     * @param {?} data
     * @return {?}
     */
    isMultiDataSet(data) {
        return Array.isArray(data[0]);
    }
    /**
     * @private
     * @return {?}
     */
    getDatasets() {
        if (!this.datasets && !this.data) {
            throw new Error(`ng-charts configuration error, data or datasets field are required to render chart ${this.chartType}`);
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
    }
    /**
     * @private
     * @return {?}
     */
    refresh() {
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
    }
}
BaseChartDirective.decorators = [
    { type: Directive, args: [{
                // tslint:disable-next-line:directive-selector
                selector: 'canvas[baseChart]',
                exportAs: 'base-chart'
            },] }
];
/** @nocollapse */
BaseChartDirective.ctorParameters = () => [
    { type: ElementRef },
    { type: ThemeService }
];
BaseChartDirective.propDecorators = {
    data: [{ type: Input }],
    datasets: [{ type: Input }],
    labels: [{ type: Input }],
    options: [{ type: Input }],
    chartType: [{ type: Input }],
    colors: [{ type: Input }],
    legend: [{ type: Input }],
    plugins: [{ type: Input }],
    chartClick: [{ type: Output }],
    chartHover: [{ type: Output }]
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZS1jaGFydC5kaXJlY3RpdmUuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZzItY2hhcnRzL3NyYy9saWIvYmFzZS1jaGFydC5kaXJlY3RpdmUudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxPQUFPLEVBRUwsU0FBUyxFQUVULFVBQVUsRUFDVixZQUFZLEVBQ1osS0FBSyxFQUlMLE1BQU0sR0FFUCxNQUFNLGVBQWUsQ0FBQztBQUN2QixPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sY0FBYyxDQUFDO0FBRXpDLE9BQU8sRUFBRSxZQUFZLEVBQUUsTUFBTSxpQkFBaUIsQ0FBQztBQUUvQyxPQUFPLEVBQUUsU0FBUyxFQUFFLE1BQU0sV0FBVyxDQUFDO0FBQ3RDLE9BQU8sRUFDTCxLQUFLLEVBT0wsYUFBYSxFQUNkLE1BQU0sVUFBVSxDQUFDOzs7O0FBYWxCLHVCQWVDOzs7SUFkQyw4QkFBb0I7O0lBQ3BCLDhCQUFtQjs7SUFDbkIsa0NBQXdCOztJQUN4QixrQ0FBdUI7O0lBQ3ZCLHVDQUEyQjs7SUFDM0IsdUNBQThCOztJQUM5QixnQ0FBc0I7O0lBQ3RCLDBCQUFnQjs7SUFDaEIsK0JBQXFCOztJQUNyQiwwQkFBZ0I7O0lBQ2hCLGdDQUFzQjs7SUFDdEIsMEJBRUU7OztBQUdKLE1BQUssVUFBVTtJQUNiLE9BQU8sR0FBQTtJQUNQLE1BQU0sR0FBQTtJQUNOLE9BQU8sR0FBQTtFQUNSOzs7O0FBT0QsTUFBTSxPQUFPLGtCQUFrQjs7Ozs7SUE0QzdCLFlBQ1UsT0FBbUIsRUFDbkIsWUFBMEI7UUFEMUIsWUFBTyxHQUFQLE9BQU8sQ0FBWTtRQUNuQixpQkFBWSxHQUFaLFlBQVksQ0FBYztRQTFDcEIsWUFBTyxHQUFpQixFQUFFLENBQUM7UUFNMUIsZUFBVSxHQUF3RCxJQUFJLFlBQVksRUFBRSxDQUFDO1FBQ3JGLGVBQVUsR0FBc0QsSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUs1RixRQUFHLEdB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RSxJQUFJLENBQUMsR0FBRyxDQUFDLGNBQWMsR0FBRyxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTSxJQUFJLENBQUMsQ0FBQztZQUVyRSxVQUFVLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQy9CO1FBRUQsSUFBSSxJQUFJLENBQUMsUUFBUSxJQUFJLElBQUksQ0FBQyxRQUFRLENBQUMsTUFBTTs7Ozs7UUFBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLE1BQU0sRUFBRTtZQUN0RyxJQUFJLENBQUMsR0FBRyxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRzs7OztZQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksRUFBQyxDQUFDO1lBRTlELFVBQVUsQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLENBQUM7U0FDL0I7UUFFRCxJQUFJLElBQUksQ0FBQyxRQUFRLElBQUksSUFBSSxDQUFDLFFBQVEsQ0FBQyxNQUFNOzs7OztRQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDLE1BQU0sRUFBRTtZQUM3RyxJQUFJLENBQUMsR0FBRyxDQUFDLG1CQUFtQixHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsR0FBRzs7OztZQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxNQUFNLEVBQUMsQ0FBQztZQUVyRSxVQUFVLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQy9CO1FBRUQsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRTtZQUMzQyxJQUFJLENBQUMsR0FBRyxDQUFDLFlBQVksR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztZQUV0QyxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7WUFFcEIsVUFBVSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztTQUMvQjtRQUVELDBEQUEwRDtRQUMxRCxJQUFJLElBQUksQ0FBQyxNQUFNLElBQUksSUFBSSxDQUFDLE1BQU0sQ0FBQyxNQUFNOzs7OztRQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFDLENBQUMsTUFBTSxFQUFFO1lBQ2hHLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLElBQUksQ0FBQyxNQUFNLENBQUMsR0FBRzs7OztZQUFDLENBQUMsQ0FBQyxFQUFFLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBQyxDQUFDO1lBRTFELElBQUksQ0FBQyxZQUFZLEVBQUUsQ0FBQztZQUVwQixVQUFVLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQy9CO1FBRUQsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sS0FBSyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRTtZQUMxQyxJQUFJLENBQUMsR0FBRyxDQUFDLFdBQVcsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQztZQUVyQyxVQUFVLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxDQUFDO1NBQy9CO1FBRUQsSUFBSSxJQUFJLENBQUMsTUFBTSxJQUFJLElBQUksQ0FBQyxNQUFNLENBQUMsTUFBTTs7Ozs7UUFBQyxDQUFDLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsSUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLEVBQUUsSUFB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QUFxQzs7SUFDckMsb0NBQWdDOztJQUNoQyxvQ0FBZ0M7O0lBQ2hDLHFDQUFxRTs7SUFFckUsd0NBQXNHOztJQUN0Ryx3Q0FBb0c7O0lBRXBHLGlDQUFtQjs7SUFDbkIsbUNBQW9COzs7OztJQUVwQixpQ0FhRTs7Ozs7SUFFRixrQ0FBa0M7Ozs7O0lBY2hDLHFDQUEyQjs7Ozs7SUFDM0IsMENBQWtDIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtcbiAgQWZ0ZXJWaWV3SW5pdCxcbiAgRGlyZWN0aXZlLFxuICBEb0NoZWNrLFxuICBFbGVtZW50UmVmLFxuICBFdmVudEVtaXR0ZXIsXG4gIElucHV0LFxuICBPbkNoYW5nZXMsXG4gIE9uRGVzdHJveSxcbiAgT25Jbml0LFxuICBPdXRwdXQsXG4gIFNpbXBsZUNoYW5nZXMsXG59IGZyb20gJ0Bhbmd1bGFyL2NvcmUnO1xuaW1wb3J0IHsgZ2V0Q29sb3JzIH0gZnJvbSAnLi9nZXQtY29sb3JzJztcbmltcG9ydCB7IENvbG9yIH0gZnJvbSAnLi9jb2xvcic7XG5pbXBvcnQgeyBUaGVtZVNlcnZpY2UgfSBmcm9tICcuL3RoZW1lLnNlcnZpY2UnO1xuaW1wb3J0IHsgU3Vic2NyaXB0aW9uIH0gZnJvbSAncnhqcyc7XG5pbXBvcnQgeyBjbG9uZURlZXAgfSBmcm9tICdsb2Rhc2gtZXMnO1xuaW1wb3J0IHtcbiAgQ2hhcnQsXG4gIENoYXJ0Q29uZmlndXJhdGlvbixcbiAgQ2hhcnREYXRhU2V0cyxcbiAgQ2hhcnRPcHRpb25zLFxuICBDaGFydFBvaW50LCBDaGFydFR5cGUsXG4gIFBsdWdpblNlcnZpY2VHbG9iYWxSZWdpc3RyYXRpb24sXG4gIFBsdWdpblNlcnZpY2VSZWdpc3RyYXRpb25PcHRpb25zLFxuICBwbHVnaW5TZXJ2aWNlXG59IGZyb20gJ2NoYXJ0LmpzJztcblxuZXhwb3J0IHR5cGUgU2luZ2xlRGF0YVNldCA9IEFycmF5PG51bWJlciB8IG51bGwgfCB1bmRlZmluZWQgfCBudW1iZXJbXT4gfCBDaGFydFBvaW50W107XG5leHBvcnQgdHlwZSBNdWx0aURhdGFTZXQgPSBTaW5nbGVEYXRhU2V0W107XG5leHBvcnQgdHlwZSBTaW5nbGVPck11bHRpRGF0YVNldCA9IFNpbmdsZURhdGFTZXQgfCBNdWx0aURhdGFTZXQ7XG5cbmV4cG9ydCB0eXBlIFBsdWdpblNlcnZpY2VHbG9iYWxSZWdpc3RyYXRpb25BbmRPcHRpb25zID1cbiAgUGx1Z2luU2VydmljZUdsb2JhbFJlZ2lzdHJhdGlvblxuICAmIFBsdWdpblNlcnZpY2VSZWdpc3RyYXRpb25PcHRpb25zO1xuZXhwb3J0IHR5cGUgU2luZ2xlTGluZUxhYmVsID0gc3RyaW5nO1xuZXhwb3J0IHR5cGUgTXVsdGlMaW5lTGFiZWwgPSBzdHJpbmdbXTtcbmV4cG9ydCB0eXBlIExhYmVsID0gU2luZ2xlTGluZUxhYmVsIHwgTXVsdGlMaW5lTGFiZWw7XG5cbmludGVyZmFjZSBPbGRTdGF0ZSB7XG4gIGRhdGFFeGlzdHM6IGJvb2xlYW47XG4gIGRhdGFMZW5ndGg6IG51bWJlcjtcbiAgZGF0YXNldHNFeGlzdHM6IGJvb2xlYW47XG4gIGRhdGFzZXRzTGVuZ3RoOiBudW1iZXI7XG4gIGRhdGFzZXRzRGF0YU9iamVjdHM6IGFueVtdO1xuICBkYXRhc2V0c0RhdGFMZW5ndGhzOiBudW1iZXJbXTtcbiAgY29sb3JzRXhpc3RzOiBib29sZWFuO1xuICBjb2xvcnM6IENvbG9yW107XG4gIGxhYmVsc0V4aXN0OiBib29sZWFuO1xuICBsYWJlbHM6IExhYmVsW107XG4gIGxlZ2VuZEV4aXN0czogYm9vbGVhbjtcbiAgbGVnZW5kOiB7XG4gICAgcG9zaXRpb24/OiBzdHJpbmc7XG4gIH07XG59XG5cbmVudW0gVXBkYXRlVHlwZSB7XG4gIERlZmF1bHQsXG4gIFVwZGF0ZSxcbiAgUmVmcmVzaFxufVxuXG5ARGlyZWN0aXZlKHtcbiAgLy8gdHNsaW50OmRpc2FibGUtbmV4dC1saW5lOmRpcmVjdGl2ZS1zZWxlY3RvclxuICBzZWxlY3RvcjogJ2NhbnZhc1tiYXNlQ2hhcnRdJyxcbiAgZXhwb3J0QXM6ICdiYXNlLWNoYXJ0J1xufSlcbmV4cG9ydCBjbGFzcyBCYXNlQ2hhcnREaXJlY3RpdmUgaW1wbGVtZW50cyBPbkNoYW5nZXMsIE9uSW5pdCwgT25EZXN0cm95LCBEb0NoZWNrIHtcbiAgQElucHV0KCkgcHVibGljIGRhdGE6IFNpbmdsZU9yTXVsdGlEYXRhU2V0O1xuICBASW5wdXQoKSBwdWJsaWMgZGF0YXNldHM6IENoYXJ0RGF0YVNldHNbXTtcbiAgQElucHV0KCkgcHVibGljIGxhYmVsczogTGFiZWxbXTtcbiAgQElucHV0KCkgcHVibGljIG9wdGlvbnM6IENoYXJ0T3B0aW9ucyA9IHt9O1xuICBASW5wdXQoKSBwdWJsaWMgY2hhcnRUeXBlOiBDaGFydFR5cGU7XG4gIEBJbnB1dCgpIHB1YmxpYyBjb2xvcnM6IENvbG9yW107XG4gIEBJbnB1dCgpIHB1YmxpYyBsZWdlbmQ6IGJvb2xlYW47XG4gIEBJbnB1dCgpIHB1YmxpYyBwbHVnaW5zOiBQbHVnaW5TZXJ2aWNlR2xvYmFsUmVnaXN0cmF0aW9uQW5kT3B0aW9uc1tdO1xuXG4gIEBPdXRwdXQoKSBwdWJsaWMgY2hhcnRDbGljazogRXZlbnRFbWl0dGVyPHsgZXZlbnQ/OiBNb3VzZUV2ZW50LCBhY3RpdmU/OiB7fVtdIH0+ID0gbmV3IEV2ZW50RW1pdHRlcigpO1xuICBAT3V0cHV0KCkgcHVibGljIGNoYXJ0SG92ZXI6IEV2ZW50RW1pdHRlcjx7IGV2ZW50OiBNb3VzZUV2ZW50LCBhY3RpdmU6IHt9W10gfT4gPSBuZXcgRXZlbnRFbWl0dGVyKCk7XG5cbiAgcHVibGljIGN0eDogc3RyaW5nO1xuICBwdWJsaWMgY2hhcnQ6IENoYXJ0O1xuXG4gIHByaXZhdGUgb2xkOiBPbGRTdGF0ZSA9IHtcbiAgICBkYXRhRXhpc3RzOiBmYWxzZSxcbiAgICBkYXRhTGVuZ3RoOiAwLFxuICAgIGRhdGFzZXRzRXhpc3RzOiBmYWxzZSxcbiAgICBkYXRhc2V0c0xlbmd0aDogMCxcbiAgICBkYXRhc2V0c0RhdGFPYmplY3RzOiBbXSxcbiAgICBkYXRhc2V0c0RhdGFMZW5ndGhzOiBbXSxcbiAgICBjb2xvcnNFeGlzdHM6IGZhbHNlLFxuICAgIGNvbG9yczogW10sXG4gICAgbGFiZWxzRXhpc3Q6IGZhbHNlLFxuICAgIGxhYmVsczogW10sXG4gICAgbGVnZW5kRXhpc3RzOiBmYWxzZSxcbiAgICBsZWdlbmQ6IHt9LFxuICB9O1xuXG4gIHByaXZhdGUgc3ViczogU3Vic2NyaXB0aW9uW10gPSBbXTtcblxuICAvKipcbiAgICogUmVnaXN0ZXIgYSBwbHVnaW4uXG4gICAqL1xuICBwdWJsaWMgc3RhdGljIHJlZ2lzdGVyUGx1Z2luKHBsdWdpbjogUGx1Z2luU2VydmljZUdsb2JhbFJlZ2lzdHJhdGlvbkFuZE9wdGlvbnMpOiB2b2lkIHtcbiAgICBwbHVnaW5TZXJ2aWNlLnJlZ2lzdGVyKHBsdWdpbik7XG4gIH1cblxuICBwdWJsaWMgc3RhdGljIHVucmVnaXN0ZXJQbHVnaW4ocGx1Z2luOiBQbHVnaW5TZXJ2aWNlR2xvYmFsUmVnaXN0cmF0aW9uQW5kT3B0aW9ucyk6IHZvaWQge1xuICAgIHBsdWdpblNlcnZpY2UudW5yZWdpc3RlcihwbHVnaW4pO1xuICB9XG5cbiAgcHVibGljIGNvbnN0cnVjdG9yKFxuICAgIHByaXZhdGUgZWxlbWVudDogRWxlbWVudFJlZixcbiAgICBwcml2YXRlIHRoZW1lU2VydmljZTogVGhlbWVTZXJ2aWNlLFxuICApIHsgfVxuXG4gIHB1YmxpYyBuZ09uSW5pdCgpOiB2b2lkIHtcbiAgICB0aGlzLmN0eCA9IHRoaXMuZWxlbWVudC5uYXRpdmVFbGVtZW50LmdldENvbnRleHQoJzJkJyk7XG4gICAgdGhpcy5yZWZyZXNoKCk7XG4gICAgdGhpcy5zdWJzLnB1c2godGhpcy50aGVtZVNlcnZpY2UuY29sb3JzY2hlbWVzT3B0aW9ucy5zdWJzY3JpYmUociA9PiB0aGlzLnRoZW1lQ2hhbmdlZChyKSkpO1xuICB9XG5cbiAgcHJpdmF0ZSB0aGVtZUNoYW5nZWQob3B0aW9uczoge30pOiB2b2lkIHtcbiAgICB0aGlzLnJlZnJlc2goKTtcbiAgfVxuXG4gIG5nRG9DaGVjaygpOiB2b2lkIHtcbiAgICBpZiAoIXRoaXMuY2hhcnQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgbGV0IHVwZGF0ZVJlcXVpcmVkID0gVXBkYXRlVHlwZS5EZWZhdWx0O1xuICAgIGNvbnN0IHdhbnRVcGRhdGUgPSAoeDogVXBkYXRlVHlwZSkgPT4ge1xuICAgICAgdXBkYXRlUmVxdWlyZWQgPSB4ID4gdXBkYXRlUmVxdWlyZWQgPyB4IDogdXBkYXRlUmVxdWlyZWQ7XG4gICAgfTtcblxuICAgIGlmICghIXRoaXMuZGF0YSAhPT0gdGhpcy5vbGQuZGF0YUV4aXN0cykge1xuICAgICAgdGhpcy5wcm9wYWdhdGVEYXRhVG9EYXRhc2V0cyh0aGlzLmRhdGEpO1xuXG4gICAgICB0aGlzLm9sZC5kYXRhRXhpc3RzID0gISF0aGlzLmRhdGE7XG5cbiAgICAgIHdhbnRVcGRhdGUoVXBkYXRlVHlwZS5VcGRhdGUpO1xuICAgIH1cblxuICAgIGlmICh0aGlzLmRhdGEgJiYgdGhpcy5kYXRhLmxlbmd0aCAhPT0gdGhpcy5vbGQuZGF0YUxlbmd0aCkge1xuICAgICAgdGhpcy5vbGQuZGF0YUxlbmd0aCA9IHRoaXMuZGF0YSAmJiB0aGlzLmRhdGEubGVuZ3RoIHx8IDA7XG5cbiAgICAgIHdhbnRVcGRhdGUoVXBkYXRlVHlwZS5VcGRhdGUpO1xuICAgIH1cblxuICAgIGlmICghIXRoaXMuZGF0YXNldHMgIT09IHRoaXMub2xkLmRhdGFzZXRzRXhpc3RzKSB7XG4gICAgICB0aGlzLm9sZC5kYXRhc2V0c0V4aXN0cyA9ICEhdGhpcy5kYXRhc2V0cztcblxuICAgICAgd2FudFVwZGF0ZShVcGRhdGVUeXBlLlVwZGF0ZSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZGF0YXNldHMgJiYgdGhpcy5kYXRhc2V0cy5sZW5ndGggIT09IHRoaXMub2xkLmRhdGFzZXRzTGVuZ3RoKSB7XG4gICAgICB0aGlzLm9sZC5kYXRhc2V0c0xlbmd0aCA9IHRoaXMuZGF0YXNldHMgJiYgdGhpcy5kYXRhc2V0cy5sZW5ndGggfHwgMDtcblxuICAgICAgd2FudFVwZGF0ZShVcGRhdGVUeXBlLlVwZGF0ZSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZGF0YXNldHMgJiYgdGhpcy5kYXRhc2V0cy5maWx0ZXIoKHgsIGkpID0+IHguZGF0YSAhPT0gdGhpcy5vbGQuZGF0YXNldHNEYXRhT2JqZWN0c1tpXSkubGVuZ3RoKSB7XG4gICAgICB0aGlzLm9sZC5kYXRhc2V0c0RhdGFPYmplY3RzID0gdGhpcy5kYXRhc2V0cy5tYXAoeCA9PiB4LmRhdGEpO1xuXG4gICAgICB3YW50VXBkYXRlKFVwZGF0ZVR5cGUuVXBkYXRlKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5kYXRhc2V0cyAmJiB0aGlzLmRhdGFzZXRzLmZpbHRlcigoeCwgaSkgPT4geC5kYXRhLmxlbmd0aCAhPT0gdGhpcy5vbGQuZGF0YXNldHNEYXRhTGVuZ3Roc1tpXSkubGVuZ3RoKSB7XG4gICAgICB0aGlzLm9sZC5kYXRhc2V0c0RhdGFMZW5ndGhzID0gdGhpcy5kYXRhc2V0cy5tYXAoeCA9PiB4LmRhdGEubGVuZ3RoKTtcblxuICAgICAgd2FudFVwZGF0ZShVcGRhdGVUeXBlLlVwZGF0ZSk7XG4gICAgfVxuXG4gICAgaWYgKCEhdGhpcy5jb2xvcnMgIT09IHRoaXMub2xkLmNvbG9yc0V4aXN0cykge1xuICAgICAgdGhpcy5vbGQuY29sb3JzRXhpc3RzID0gISF0aGlzLmNvbG9ycztcblxuICAgICAgdGhpcy51cGRhdGVDb2xvcnMoKTtcblxuICAgICAgd2FudFVwZGF0ZShVcGRhdGVUeXBlLlVwZGF0ZSk7XG4gICAgfVxuXG4gICAgLy8gVGhpcyBzbWVsbHMgb2YgaW5lZmZpY2llbmN5LCBtaWdodCBuZWVkIHRvIHJldmlzaXQgdGhpc1xuICAgIGlmICh0aGlzLmNvbG9ycyAmJiB0aGlzLmNvbG9ycy5maWx0ZXIoKHgsIGkpID0+ICF0aGlzLmNvbG9yc0VxdWFsKHgsIHRoaXMub2xkLmNvbG9yc1tpXSkpLmxlbmd0aCkge1xuICAgICAgdGhpcy5vbGQuY29sb3JzID0gdGhpcy5jb2xvcnMubWFwKHggPT4gdGhpcy5jb3B5Q29sb3IoeCkpO1xuXG4gICAgICB0aGlzLnVwZGF0ZUNvbG9ycygpO1xuXG4gICAgICB3YW50VXBkYXRlKFVwZGF0ZVR5cGUuVXBkYXRlKTtcbiAgICB9XG5cbiAgICBpZiAoISF0aGlzLmxhYmVscyAhPT0gdGhpcy5vbGQubGFiZWxzRXhpc3QpIHtcbiAgICAgIHRoaXMub2xkLmxhYmVsc0V4aXN0ID0gISF0aGlzLmxhYmVscztcblxuICAgICAgd2FudFVwZGF0ZShVcGRhdGVUeXBlLlVwZGF0ZSk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMubGFiZWxzICYmIHRoaXMubGFiZWxzLmZpbHRlcigoeCwgaSkgPT4gIXRoaXMubGFiZWxzRXF1YWwoeCwgdGhpcy5vbGQubGFiZWxzW2ldKSkubGVuZ3RoKSB7XG4gICAgICB0aGlzLm9sZC5sYWJlbHMgPSB0aGlzLmxhYmVscy5tYXAoeCA9PiB0aGlzLmNvcHlMYWJlbCh4KSk7XG5cbiAgICAgIHdhbnRVcGRhdGUoVXBkYXRlVHlwZS5VcGRhdGUpO1xuICAgIH1cblxuICAgIGlmICghIXRoaXMub3B0aW9ucy5sZWdlbmQgIT09IHRoaXMub2xkLmxlZ2VuZEV4aXN0cykge1xuICAgICAgdGhpcy5vbGQubGVnZW5kRXhpc3RzID0gISF0aGlzLm9wdGlvbnMubGVnZW5kO1xuXG4gICAgICB3YW50VXBkYXRlKFVwZGF0ZVR5cGUuUmVmcmVzaCk7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMub3B0aW9ucy5sZWdlbmQgJiYgdGhpcy5vcHRpb25zLmxlZ2VuZC5wb3NpdGlvbiAhPT0gdGhpcy5vbGQubGVnZW5kLnBvc2l0aW9uKSB7XG4gICAgICB0aGlzLm9sZC5sZWdlbmQucG9zaXRpb24gPSB0aGlzLm9wdGlvbnMubGVnZW5kLnBvc2l0aW9uO1xuXG4gICAgICB3YW50VXBkYXRlKFVwZGF0ZVR5cGUuUmVmcmVzaCk7XG4gICAgfVxuXG4gICAgc3dpdGNoICh1cGRhdGVSZXF1aXJlZCBhcyBVcGRhdGVUeXBlKSB7XG4gICAgICBjYXNlIFVwZGF0ZVR5cGUuRGVmYXVsdDpcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFVwZGF0ZVR5cGUuVXBkYXRlOlxuICAgICAgICB0aGlzLnVwZGF0ZSgpO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgVXBkYXRlVHlwZS5SZWZyZXNoOlxuICAgICAgICB0aGlzLnJlZnJlc2goKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgY29weUxhYmVsKGE6IExhYmVsKTogTGFiZWwge1xuICAgIGlmIChBcnJheS5pc0FycmF5KGEpKSB7XG4gICAgICByZXR1cm4gWy4uLmFdO1xuICAgIH1cbiAgICByZXR1cm4gYTtcbiAgfVxuXG4gIGxhYmVsc0VxdWFsKGE6IExhYmVsLCBiOiBMYWJlbCk6IGJvb2xlYW4ge1xuICAgIHJldHVybiBBcnJheS5pc0FycmF5KGEpID09PSBBcnJheS5pc0FycmF5KGIpXG4gICAgICAmJiAoQXJyYXkuaXNBcnJheShhKSB8fCBhID09PSBiKVxuICAgICAgJiYgKCFBcnJheS5pc0FycmF5KGEpIHx8IGEubGVuZ3RoID09PSBiLmxlbmd0aClcbiAgICAgICYmICghQXJyYXkuaXNBcnJheShhKSB8fCBhLmZpbHRlcigoeCwgaSkgPT4geCAhPT0gYltpXSkubGVuZ3RoID09PSAwKVxuICAgICAgO1xuICB9XG5cbiAgY29weUNvbG9yKGE6IENvbG9yKTogQ29sb3Ige1xuICAgIHJldHVybiB7XG4gICAgICBiYWNrZ3JvdW5kQ29sb3I6IGEuYmFja2dyb3VuZENvbG9yLFxuICAgICAgYm9yZGVyV2lkdGg6IGEuYm9yZGVyV2lkdGgsXG4gICAgICBib3JkZXJDb2xvcjogYS5ib3JkZXJDb2xvcixcbiAgICAgIGJvcmRlckNhcFN0eWxlOiBhLmJvcmRlckNhcFN0eWxlLFxuICAgICAgYm9yZGVyRGFzaDogYS5ib3JkZXJEYXNoLFxuICAgICAgYm9yZGVyRGFzaE9mZnNldDogYS5ib3JkZXJEYXNoT2Zmc2V0LFxuICAgICAgYm9yZGVySm9pblN0eWxlOiBhLmJvcmRlckpvaW5TdHlsZSxcbiAgICAgIHBvaW50Qm9yZGVyQ29sb3I6IGEucG9pbnRCb3JkZXJDb2xvcixcbiAgICAgIHBvaW50QmFja2dyb3VuZENvbG9yOiBhLnBvaW50QmFja2dyb3VuZENvbG9yLFxuICAgICAgcG9pbnRCb3JkZXJXaWR0aDogYS5wb2ludEJvcmRlcldpZHRoLFxuICAgICAgcG9pbnRSYWRpdXM6IGEucG9pbnRSYWRpdXMsXG4gICAgICBwb2ludEhvdmVyUmFkaXVzOiBhLnBvaW50SG92ZXJSYWRpdXMsXG4gICAgICBwb2ludEhpdFJhZGl1czogYS5wb2ludEhpdFJhZGl1cyxcbiAgICAgIHBvaW50SG92ZXJCYWNrZ3JvdW5kQ29sb3I6IGEucG9pbnRIb3ZlckJhY2tncm91bmRDb2xvcixcbiAgICAgIHBvaW50SG92ZXJCb3JkZXJDb2xvcjogYS5wb2ludEhvdmVyQm9yZGVyQ29sb3IsXG4gICAgICBwb2ludEhvdmVyQm9yZGVyV2lkdGg6IGEucG9pbnRIb3ZlckJvcmRlcldpZHRoLFxuICAgICAgcG9pbnRTdHlsZTogYS5wb2ludFN0eWxlLFxuICAgICAgaG92ZXJCYWNrZ3JvdW5kQ29sb3I6IGEuaG92ZXJCYWNrZ3JvdW5kQ29sb3IsXG4gICAgICBob3ZlckJvcmRlckNvbG9yOiBhLmhvdmVyQm9yZGVyQ29sb3IsXG4gICAgICBob3ZlckJvcmRlcldpZHRoOiBhLmhvdmVyQm9yZGVyV2lkdGgsXG4gICAgfTtcbiAgfVxuXG4gIGNvbG9yc0VxdWFsKGE6IENvbG9yLCBiOiBDb2xvcik6IGJvb2xlYW4ge1xuICAgIGlmICghYSAhPT0gIWIpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG4gICAgcmV0dXJuICFhIHx8XG4gICAgICAoYS5iYWNrZ3JvdW5kQ29sb3IgPT09IGIuYmFja2dyb3VuZENvbG9yKVxuICAgICAgJiYgKGEuYm9yZGVyV2lkdGggPT09IGIuYm9yZGVyV2lkdGgpXG4gICAgICAmJiAoYS5ib3JkZXJDb2xvciA9PT0gYi5ib3JkZXJDb2xvcilcbiAgICAgICYmIChhLmJvcmRlckNhcFN0eWxlID09PSBiLmJvcmRlckNhcFN0eWxlKVxuICAgICAgJiYgKGEuYm9yZGVyRGFzaCA9PT0gYi5ib3JkZXJEYXNoKVxuICAgICAgJiYgKGEuYm9yZGVyRGFzaE9mZnNldCA9PT0gYi5ib3JkZXJEYXNoT2Zmc2V0KVxuICAgICAgJiYgKGEuYm9yZGVySm9pblN0eWxlID09PSBiLmJvcmRlckpvaW5TdHlsZSlcbiAgICAgICYmIChhLnBvaW50Qm9yZGVyQ29sb3IgPT09IGIucG9pbnRCb3JkZXJDb2xvcilcbiAgICAgICYmIChhLnBvaW50QmFja2dyb3VuZENvbG9yID09PSBiLnBvaW50QmFja2dyb3VuZENvbG9yKVxuICAgICAgJiYgKGEucG9pbnRCb3JkZXJXaWR0aCA9PT0gYi5wb2ludEJvcmRlcldpZHRoKVxuICAgICAgJiYgKGEucG9pbnRSYWRpdXMgPT09IGIucG9pbnRSYWRpdXMpXG4gICAgICAmJiAoYS5wb2ludEhvdmVyUmFkaXVzID09PSBiLnBvaW50SG92ZXJSYWRpdXMpXG4gICAgICAmJiAoYS5wb2ludEhpdFJhZGl1cyA9PT0gYi5wb2ludEhpdFJhZGl1cylcbiAgICAgICYmIChhLnBvaW50SG92ZXJCYWNrZ3JvdW5kQ29sb3IgPT09IGIucG9pbnRIb3ZlckJhY2tncm91bmRDb2xvcilcbiAgICAgICYmIChhLnBvaW50SG92ZXJCb3JkZXJDb2xvciA9PT0gYi5wb2ludEhvdmVyQm9yZGVyQ29sb3IpXG4gICAgICAmJiAoYS5wb2ludEhvdmVyQm9yZGVyV2lkdGggPT09IGIucG9pbnRIb3ZlckJvcmRlcldpZHRoKVxuICAgICAgJiYgKGEucG9pbnRTdHlsZSA9PT0gYi5wb2ludFN0eWxlKVxuICAgICAgJiYgKGEuaG92ZXJCYWNrZ3JvdW5kQ29sb3IgPT09IGIuaG92ZXJCYWNrZ3JvdW5kQ29sb3IpXG4gICAgICAmJiAoYS5ob3ZlckJvcmRlckNvbG9yID09PSBiLmhvdmVyQm9yZGVyQ29sb3IpXG4gICAgICAmJiAoYS5ob3ZlckJvcmRlcldpZHRoID09PSBiLmhvdmVyQm9yZGVyV2lkdGgpO1xuICB9XG5cbiAgdXBkYXRlQ29sb3JzKCk6IHZvaWQge1xuICAgIHRoaXMuZGF0YXNldHMuZm9yRWFjaCgoZWxtLCBpbmRleCkgPT4ge1xuICAgICAgaWYgKHRoaXMuY29sb3JzICYmIHRoaXMuY29sb3JzW2luZGV4XSkge1xuICAgICAgICBPYmplY3QuYXNzaWduKGVsbSwgdGhpcy5jb2xvcnNbaW5kZXhdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIE9iamVjdC5hc3NpZ24oZWxtLCBnZXRDb2xvcnModGhpcy5jaGFydFR5cGUsIGluZGV4LCBlbG0uZGF0YS5sZW5ndGgpLCB7IC4uLmVsbSB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfVxuXG4gIHB1YmxpYyBuZ09uQ2hhbmdlcyhjaGFuZ2VzOiBTaW1wbGVDaGFuZ2VzKTogdm9pZCB7XG4gICAgbGV0IHVwZGF0ZVJlcXVpcmVkID0gVXBkYXRlVHlwZS5EZWZhdWx0O1xuICAgIGNvbnN0IHdhbnRVcGRhdGUgPSAoeDogVXBkYXRlVHlwZSkgPT4ge1xuICAgICAgdXBkYXRlUmVxdWlyZWQgPSB4ID4gdXBkYXRlUmVxdWlyZWQgPyB4IDogdXBkYXRlUmVxdWlyZWQ7XG4gICAgfTtcblxuICAgIC8vIENoZWNrIGlmIHRoZSBjaGFuZ2VzIGFyZSBpbiB0aGUgZGF0YSBvciBkYXRhc2V0cyBvciBsYWJlbHMgb3IgbGVnZW5kXG5cbiAgICBpZiAoY2hhbmdlcy5oYXNPd25Qcm9wZXJ0eSgnZGF0YScpICYmIGNoYW5nZXMuZGF0YS5jdXJyZW50VmFsdWUpIHtcbiAgICAgIHRoaXMucHJvcGFnYXRlRGF0YVRvRGF0YXNldHMoY2hhbmdlcy5kYXRhLmN1cnJlbnRWYWx1ZSk7XG5cbiAgICAgIHdhbnRVcGRhdGUoVXBkYXRlVHlwZS5VcGRhdGUpO1xuICAgIH1cblxuICAgIGlmIChjaGFuZ2VzLmhhc093blByb3BlcnR5KCdkYXRhc2V0cycpICYmIGNoYW5nZXMuZGF0YXNldHMuY3VycmVudFZhbHVlKSB7XG4gICAgICB0aGlzLnByb3BhZ2F0ZURhdGFzZXRzVG9EYXRhKGNoYW5nZXMuZGF0YXNldHMuY3VycmVudFZhbHVlKTtcblxuICAgICAgd2FudFVwZGF0ZShVcGRhdGVUeXBlLlVwZGF0ZSk7XG4gICAgfVxuXG4gICAgaWYgKGNoYW5nZXMuaGFzT3duUHJvcGVydHkoJ2xhYmVscycpKSB7XG4gICAgICBpZiAodGhpcy5jaGFydCkge1xuICAgICAgICB0aGlzLmNoYXJ0LmRhdGEubGFiZWxzID0gY2hhbmdlcy5sYWJlbHMuY3VycmVudFZhbHVlO1xuICAgICAgfVxuXG4gICAgICB3YW50VXBkYXRlKFVwZGF0ZVR5cGUuVXBkYXRlKTtcbiAgICB9XG5cbiAgICBpZiAoY2hhbmdlcy5oYXNPd25Qcm9wZXJ0eSgnbGVnZW5kJykpIHtcbiAgICAgIGlmICh0aGlzLmNoYXJ0KSB7XG4gICAgICAgIHRoaXMuY2hhcnQuY29uZmlnLm9wdGlvbnMubGVnZW5kLmRpc3BsYXkgPSBjaGFuZ2VzLmxlZ2VuZC5jdXJyZW50VmFsdWU7XG4gICAgICAgIHRoaXMuY2hhcnQuZ2VuZXJhdGVMZWdlbmQoKTtcbiAgICAgIH1cblxuICAgICAgd2FudFVwZGF0ZShVcGRhdGVUeXBlLlVwZGF0ZSk7XG4gICAgfVxuXG4gICAgaWYgKGNoYW5nZXMuaGFzT3duUHJvcGVydHkoJ29wdGlvbnMnKSkge1xuICAgICAgd2FudFVwZGF0ZShVcGRhdGVUeXBlLlJlZnJlc2gpO1xuICAgIH1cblxuICAgIHN3aXRjaCAodXBkYXRlUmVxdWlyZWQgYXMgVXBkYXRlVHlwZSkge1xuICAgICAgY2FzZSBVcGRhdGVUeXBlLlVwZGF0ZTpcbiAgICAgICAgdGhpcy51cGRhdGUoKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIFVwZGF0ZVR5cGUuUmVmcmVzaDpcbiAgICAgIGNhc2UgVXBkYXRlVHlwZS5EZWZhdWx0OlxuICAgICAgICB0aGlzLnJlZnJlc2goKTtcbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmNoYXJ0KSB7XG4gICAgICB0aGlzLmNoYXJ0LmRlc3Ryb3koKTtcbiAgICAgIHRoaXMuY2hhcnQgPSB2b2lkIDA7XG4gICAgfVxuICAgIHRoaXMuc3Vicy5mb3JFYWNoKHggPT4geC51bnN1YnNjcmliZSgpKTtcbiAgfVxuXG4gIHB1YmxpYyB1cGRhdGUoZHVyYXRpb24/OiBhbnkpOiB7fSB7XG4gICAgaWYgKHRoaXMuY2hhcnQpIHtcbiAgICAgIHJldHVybiB0aGlzLmNoYXJ0LnVwZGF0ZShkdXJhdGlvbik7XG4gICAgfVxuICB9XG5cbiAgcHVibGljIGhpZGVEYXRhc2V0KGluZGV4OiBudW1iZXIsIGhpZGRlbjogYm9vbGVhbik6IHZvaWQge1xuICAgIHRoaXMuY2hhcnQuZ2V0RGF0YXNldE1ldGEoaW5kZXgpLmhpZGRlbiA9IGhpZGRlbjtcbiAgICB0aGlzLmNoYXJ0LnVwZGF0ZSgpO1xuICB9XG5cbiAgcHVibGljIGlzRGF0YXNldEhpZGRlbihpbmRleDogbnVtYmVyKTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuY2hhcnQuZ2V0RGF0YXNldE1ldGEoaW5kZXgpLmhpZGRlbjtcbiAgfVxuXG4gIHB1YmxpYyB0b0Jhc2U2NEltYWdlKCk6IHN0cmluZyB7XG4gICAgcmV0dXJuIHRoaXMuY2hhcnQudG9CYXNlNjRJbWFnZSgpO1xuICB9XG5cbiAgcHVibGljIGdldENoYXJ0Q29uZmlndXJhdGlvbigpOiBDaGFydENvbmZpZ3VyYXRpb24ge1xuICAgIGNvbnN0IGRhdGFzZXRzID0gdGhpcy5nZXREYXRhc2V0cygpO1xuXG4gICAgY29uc3Qgb3B0aW9ucyA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMub3B0aW9ucyk7XG4gICAgaWYgKHRoaXMubGVnZW5kID09PSBmYWxzZSkge1xuICAgICAgb3B0aW9ucy5sZWdlbmQgPSB7IGRpc3BsYXk6IGZhbHNlIH07XG4gICAgfVxuICAgIC8vIGhvb2sgZm9yIG9uSG92ZXIgYW5kIG9uQ2xpY2sgZXZlbnRzXG4gICAgb3B0aW9ucy5ob3ZlciA9IG9wdGlvbnMuaG92ZXIgfHwge307XG4gICAgaWYgKCFvcHRpb25zLmhvdmVyLm9uSG92ZXIpIHtcbiAgICAgIG9wdGlvbnMuaG92ZXIub25Ib3ZlciA9IChldmVudDogTW91c2VFdmVudCwgYWN0aXZlOiB7fVtdKSA9PiB7XG4gICAgICAgIGlmIChhY3RpdmUgJiYgIWFjdGl2ZS5sZW5ndGgpIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5jaGFydEhvdmVyLmVtaXQoeyBldmVudCwgYWN0aXZlIH0pO1xuICAgICAgfTtcbiAgICB9XG5cbiAgICBpZiAoIW9wdGlvbnMub25DbGljaykge1xuICAgICAgb3B0aW9ucy5vbkNsaWNrID0gKGV2ZW50PzogTW91c2VFdmVudCwgYWN0aXZlPzoge31bXSkgPT4ge1xuICAgICAgICB0aGlzLmNoYXJ0Q2xpY2suZW1pdCh7IGV2ZW50LCBhY3RpdmUgfSk7XG4gICAgICB9O1xuICAgIH1cblxuICAgIGNvbnN0IG1lcmdlZE9wdGlvbnMgPSB0aGlzLnNtYXJ0TWVyZ2Uob3B0aW9ucywgdGhpcy50aGVtZVNlcnZpY2UuZ2V0Q29sb3JzY2hlbWVzT3B0aW9ucygpKTtcblxuICAgIHJldHVybiB7XG4gICAgICB0eXBlOiB0aGlzLmNoYXJ0VHlwZSxcbiAgICAgIGRhdGE6IHtcbiAgICAgICAgbGFiZWxzOiB0aGlzLmxhYmVscyB8fCBbXSxcbiAgICAgICAgZGF0YXNldHNcbiAgICAgIH0sXG4gICAgICBwbHVnaW5zOiB0aGlzLnBsdWdpbnMsXG4gICAgICBvcHRpb25zOiBtZXJnZWRPcHRpb25zLFxuICAgIH07XG4gIH1cblxuICBwdWJsaWMgZ2V0Q2hhcnRCdWlsZGVyKGN0eDogc3RyaW5nLyosIGRhdGE6YW55W10sIG9wdGlvbnM6YW55Ki8pOiBDaGFydCB7XG4gICAgY29uc3QgY2hhcnRDb25maWcgPSB0aGlzLmdldENoYXJ0Q29uZmlndXJhdGlvbigpO1xuICAgIHJldHVybiBuZXcgQ2hhcnQoY3R4LCBjaGFydENvbmZpZyk7XG4gIH1cblxuICBzbWFydE1lcmdlKG9wdGlvbnM6IGFueSwgb3ZlcnJpZGVzOiBhbnksIGxldmVsOiBudW1iZXIgPSAwKTogYW55IHtcbiAgICBpZiAobGV2ZWwgPT09IDApIHtcbiAgICAgIG9wdGlvbnMgPSBjbG9uZURlZXAob3B0aW9ucyk7XG4gICAgfVxuICAgIGNvbnN0IGtleXNUb1VwZGF0ZSA9IE9iamVjdC5rZXlzKG92ZXJyaWRlcyk7XG4gICAga2V5c1RvVXBkYXRlLmZvckVhY2goa2V5ID0+IHtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KG92ZXJyaWRlc1trZXldKSkge1xuICAgICAgICBjb25zdCBhcnJheUVsZW1lbnRzID0gb3B0aW9uc1trZXldO1xuICAgICAgICBpZiAoYXJyYXlFbGVtZW50cykge1xuICAgICAgICAgIGFycmF5RWxlbWVudHMuZm9yRWFjaChyID0+IHtcbiAgICAgICAgICAgIHRoaXMuc21hcnRNZXJnZShyLCBvdmVycmlkZXNba2V5XVswXSwgbGV2ZWwgKyAxKTtcbiAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgICAgfSBlbHNlIGlmICh0eXBlb2YgKG92ZXJyaWRlc1trZXldKSA9PT0gJ29iamVjdCcpIHtcbiAgICAgICAgaWYgKCEoa2V5IGluIG9wdGlvbnMpKSB7XG4gICAgICAgICAgb3B0aW9uc1trZXldID0ge307XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5zbWFydE1lcmdlKG9wdGlvbnNba2V5XSwgb3ZlcnJpZGVzW2tleV0sIGxldmVsICsgMSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvcHRpb25zW2tleV0gPSBvdmVycmlkZXNba2V5XTtcbiAgICAgIH1cbiAgICB9KTtcbiAgICBpZiAobGV2ZWwgPT09IDApIHtcbiAgICAgIHJldHVybiBvcHRpb25zO1xuICAgIH1cbiAgfVxuXG4gIHByaXZhdGUgaXNNdWx0aUxpbmVMYWJlbChsYWJlbDogTGFiZWwpOiBsYWJlbCBpcyBNdWx0aUxpbmVMYWJlbCB7XG4gICAgcmV0dXJuIEFycmF5LmlzQXJyYXkobGFiZWwpO1xuICB9XG5cbiAgcHJpdmF0ZSBqb2luTGFiZWwobGFiZWw6IExhYmVsKTogc3RyaW5nIHtcbiAgICBpZiAoIWxhYmVsKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgaWYgKHRoaXMuaXNNdWx0aUxpbmVMYWJlbChsYWJlbCkpIHtcbiAgICAgIHJldHVybiBsYWJlbC5qb2luKCcgJyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBsYWJlbDtcbiAgICB9XG4gIH1cblxuICBwcml2YXRlIHByb3BhZ2F0ZURhdGFzZXRzVG9EYXRhKGRhdGFzZXRzOiBDaGFydERhdGFTZXRzW10pOiB2b2lkIHtcbiAgICB0aGlzLmRhdGEgPSB0aGlzLmRhdGFzZXRzLm1hcChyID0+IHIuZGF0YSk7XG4gICAgaWYgKHRoaXMuY2hhcnQpIHtcbiAgICAgIHRoaXMuY2hhcnQuZGF0YS5kYXRhc2V0cyA9IGRhdGFzZXRzO1xuICAgIH1cbiAgICB0aGlzLnVwZGF0ZUNvbG9ycygpO1xuICB9XG5cbiAgcHJpdmF0ZSBwcm9wYWdhdGVEYXRhVG9EYXRhc2V0cyhuZXdEYXRhVmFsdWVzOiBTaW5nbGVPck11bHRpRGF0YVNldCk6IHZvaWQge1xuICAgIGlmICh0aGlzLmlzTXVsdGlEYXRhU2V0KG5ld0RhdGFWYWx1ZXMpKSB7XG4gICAgICBpZiAodGhpcy5kYXRhc2V0cyAmJiBuZXdEYXRhVmFsdWVzLmxlbmd0aCA9PT0gdGhpcy5kYXRhc2V0cy5sZW5ndGgpIHtcbiAgICAgICAgdGhpcy5kYXRhc2V0cy5mb3JFYWNoKChkYXRhc2V0LCBpOiBudW1iZXIpID0+IHtcbiAgICAgICAgICBkYXRhc2V0LmRhdGEgPSBuZXdEYXRhVmFsdWVzW2ldO1xuICAgICAgICB9KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRoaXMuZGF0YXNldHMgPSBuZXdEYXRhVmFsdWVzLm1hcCgoZGF0YTogbnVtYmVyW10sIGluZGV4OiBudW1iZXIpID0+IHtcbiAgICAgICAgICByZXR1cm4geyBkYXRhLCBsYWJlbDogdGhpcy5qb2luTGFiZWwodGhpcy5sYWJlbHNbaW5kZXhdKSB8fCBgTGFiZWwgJHtpbmRleH1gIH07XG4gICAgICAgIH0pO1xuICAgICAgICBpZiAodGhpcy5jaGFydCkge1xuICAgICAgICAgIHRoaXMuY2hhcnQuZGF0YS5kYXRhc2V0cyA9IHRoaXMuZGF0YXNldHM7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgaWYgKCF0aGlzLmRhdGFzZXRzKSB7XG4gICAgICAgIHRoaXMuZGF0YXNldHMgPSBbeyBkYXRhOiBuZXdEYXRhVmFsdWVzIH1dO1xuICAgICAgICBpZiAodGhpcy5jaGFydCkge1xuICAgICAgICAgIHRoaXMuY2hhcnQuZGF0YS5kYXRhc2V0cyA9IHRoaXMuZGF0YXNldHM7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmICghdGhpcy5kYXRhc2V0c1swXSkge1xuICAgICAgICAgIHRoaXMuZGF0YXNldHNbMF0gPSB7fTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuZGF0YXNldHNbMF0uZGF0YSA9IG5ld0RhdGFWYWx1ZXM7XG4gICAgICAgIHRoaXMuZGF0YXNldHMuc3BsaWNlKDEpOyAvLyBSZW1vdmUgYWxsIGVsZW1lbnRzIGJ1dCB0aGUgZmlyc3RcbiAgICAgIH1cbiAgICB9XG4gICAgdGhpcy51cGRhdGVDb2xvcnMoKTtcbiAgfVxuXG4gIHByaXZhdGUgaXNNdWx0aURhdGFTZXQoZGF0YTogU2luZ2xlT3JNdWx0aURhdGFTZXQpOiBkYXRhIGlzIE11bHRpRGF0YVNldCB7XG4gICAgcmV0dXJuIEFycmF5LmlzQXJyYXkoZGF0YVswXSk7XG4gIH1cblxuICBwcml2YXRlIGdldERhdGFzZXRzKCk6IENoYXJ0LkNoYXJ0RGF0YVNldHNbXSB7XG4gICAgaWYgKCF0aGlzLmRhdGFzZXRzICYmICF0aGlzLmRhdGEpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihgbmctY2hhcnRzIGNvbmZpZ3VyYXRpb24gZXJyb3IsIGRhdGEgb3IgZGF0YXNldHMgZmllbGQgYXJlIHJlcXVpcmVkIHRvIHJlbmRlciBjaGFydCAkeyB0aGlzLmNoYXJ0VHlwZSB9YCk7XG4gICAgfVxuXG4gICAgLy8gSWYgYGRhdGFzZXRzYCBpcyBkZWZpbmVkLCB1c2UgaXQgb3ZlciB0aGUgYGRhdGFgIHByb3BlcnR5LlxuICAgIGlmICh0aGlzLmRhdGFzZXRzKSB7XG4gICAgICB0aGlzLnByb3BhZ2F0ZURhdGFzZXRzVG9EYXRhKHRoaXMuZGF0YXNldHMpO1xuICAgICAgcmV0dXJuIHRoaXMuZGF0YXNldHM7XG4gICAgfVxuXG4gICAgaWYgKHRoaXMuZGF0YSkge1xuICAgICAgdGhpcy5wcm9wYWdhdGVEYXRhVG9EYXRhc2V0cyh0aGlzLmRhdGEpO1xuICAgICAgcmV0dXJuIHRoaXMuZGF0YXNldHM7XG4gICAgfVxuICB9XG5cbiAgcHJpdmF0ZSByZWZyZXNoKCk6IHZvaWQge1xuICAgIC8vIGlmICh0aGlzLm9wdGlvbnMgJiYgdGhpcy5vcHRpb25zLnJlc3BvbnNpdmUpIHtcbiAgICAvLyAgIHNldFRpbWVvdXQoKCkgPT4gdGhpcy5yZWZyZXNoKCksIDUwKTtcbiAgICAvLyB9XG5cbiAgICAvLyB0b2RvOiByZW1vdmUgdGhpcyBsaW5lLCBpdCBpcyBwcm9kdWNpbmcgZmxpY2tlcmluZ1xuICAgIGlmICh0aGlzLmNoYXJ0KSB7XG4gICAgICB0aGlzLmNoYXJ0LmRlc3Ryb3koKTtcbiAgICAgIHRoaXMuY2hhcnQgPSB2b2lkIDA7XG4gICAgfVxuICAgIGlmICh0aGlzLmN0eCkge1xuICAgICAgdGhpcy5jaGFydCA9IHRoaXMuZ2V0Q2hhcnRCdWlsZGVyKHRoaXMuY3R4LyosIGRhdGEsIHRoaXMub3B0aW9ucyovKTtcbiAgICB9XG4gIH1cbn1cbiJdfQ==