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
export function monkeyPatchChartJsLegend() {
    if (typeof Chart === 'undefined') {
        console.log('Chart not defined (guessing this is a universal build, and I don\'t know why this happens -- Aviad)');
        return;
    }
    /** @type {?} */
    const plugins = Chart.plugins.getAll();
    /** @type {?} */
    const legend = plugins.filter((/**
     * @param {?} p
     * @return {?}
     */
    p => p.id === 'legend'))[0];
    legend._element.prototype.fit = fit;
    legend._element.prototype.draw = draw;
    /** @type {?} */
    const helpers = Chart.helpers;
    /** @type {?} */
    const defaults = Chart.defaults;
    /** @type {?} */
    const valueOrDefault = helpers.valueOrDefault;
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
        var getMaxLineWidth = (/**
         * @param {?} textLines
         * @return {?}
         */
        function (textLines) {
            return textLines.map((/**
             * @param {?} textLine
             * @return {?}
             */
            function (textLine) {
                return ctx.measureText(textLine).width;
            })).reduce((/**
             * @param {?} acc
             * @param {?} v
             * @return {?}
             */
            function (acc, v) {
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
                helpers.each(me.legendItems, (/**
                 * @param {?} legendItem
                 * @param {?} i
                 * @return {?}
                 */
                function (legendItem, i) {
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
                minSize.height += lineHeights.reduce((/**
                 * @param {?} acc
                 * @param {?} v
                 * @return {?}
                 */
                function (acc, v) {
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
                helpers.each(me.legendItems, (/**
                 * @param {?} legendItem
                 * @param {?} i
                 * @return {?}
                 */
                function (legendItem, i) {
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
            var drawLegendBox = (/**
             * @param {?} x
             * @param {?} y
             * @param {?} legendItem
             * @return {?}
             */
            function (x, y, legendItem) {
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
            var drawStrikeThrough = (/**
             * @param {?} x
             * @param {?} y
             * @param {?} w
             * @return {?}
             */
            function (x, y, w) {
                ctx.beginPath();
                ctx.lineWidth = 2;
                ctx.moveTo(x, y);
                ctx.lineTo(x + w, y);
                ctx.stroke();
            });
            /** @type {?} */
            var drawCrossOver = (/**
             * @param {?} x
             * @param {?} y
             * @param {?} w
             * @param {?} h
             * @return {?}
             */
            function (x, y, w, h) {
                ctx.beginPath();
                ctx.lineWidth = 2;
                ctx.moveTo(x, y);
                ctx.lineTo(x + w, y + h);
                ctx.moveTo(x, y + h);
                ctx.lineTo(x + w, y);
                ctx.stroke();
            });
            /** @type {?} */
            var fillText = (/**
             * @param {?} x
             * @param {?} y
             * @param {?} legendItem
             * @param {?} textWidth
             * @return {?}
             */
            function (x, y, legendItem, textWidth) {
                /** @type {?} */
                var halfFontSize = fontSize / 2;
                /** @type {?} */
                var xLeft = boxWidth + halfFontSize + x;
                /** @type {?} */
                var yMiddle = y + halfFontSize;
                if (helpers.isArray(legendItem.text)) {
                    helpers.each(legendItem.text, (/**
                     * @param {?} textLine
                     * @param {?} index
                     * @return {?}
                     */
                    function (textLine, index) {
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
            var alignmentOffset = (/**
             * @param {?} dimension
             * @param {?} blockSize
             * @return {?}
             */
            function (dimension, blockSize) {
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
            helpers.each(me.legendItems, (/**
             * @param {?} legendItem
             * @param {?} i
             * @return {?}
             */
            function (legendItem, i) {
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
                    textWidth = legendItem.text.map((/**
                     * @param {?} textLine
                     * @return {?}
                     */
                    function (textLine) {
                        return ctx.measureText(textLine).width;
                    })).reduce((/**
                     * @param {?} acc
                     * @param {?} v
                     * @return {?}
                     */
                    function (acc, v) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9ua2V5LXBhdGNoLWNoYXJ0LWpzLWxlZ2VuZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uL3Byb2plY3RzL25nMi1jaGFydHMvc3JjL2xpYi9tb25rZXktcGF0Y2gtY2hhcnQtanMtbGVnZW5kLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7OztBQWdCQSxNQUFNLFVBQVUsd0JBQXdCO0lBQ3RDLElBQUksT0FBTyxLQUFLLEtBQUssV0FBVyxFQUFFO1FBQ2hDLE9BQU8sQ0FBQyxHQUFHLENBQUMscUdBQXFHLENBQUMsQ0FBQztRQUNuSCxPQUFPO0tBQ1I7O1VBQ0ssT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFOztVQUNoQyxNQUFNLEdBQUcsT0FBTyxDQUFDLE1BQU07Ozs7SUFBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxFQUFFLEtBQUssUUFBUSxFQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3hELE1BQU0sQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLEdBQUcsR0FBRyxHQUFHLENBQUM7SUFDcEMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQzs7VUFFaEMsT0FBTyxHQUFHLEtBQUssQ0FBQyxPQUFPOztVQUN2QixRQUFRLEdBQUcsS0FBSyxDQUFDLFFBQVE7O1VBQ3pCLGNBQWMsR0FBRyxPQUFPLENBQUMsY0FBYzs7Ozs7O0lBRTdDLFNBQVMsV0FBVyxDQUFDLFNBQVMsRUFBRSxRQUFRO1FBQ3RDLE9BQU8sU0FBUyxDQUFDLGFBQWEsSUFBSSxTQUFTLENBQUMsUUFBUSxHQUFHLFFBQVEsQ0FBQyxDQUFDO1lBQy9ELFFBQVEsQ0FBQyxDQUFDO1lBQ1YsU0FBUyxDQUFDLFFBQVEsQ0FBQztJQUN2QixDQUFDOzs7O0lBRUQsU0FBUyxHQUFHOztZQUNOLEVBQUUsR0FBRyxJQUFJOztZQUNULElBQUksR0FBRyxFQUFFLENBQUMs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TyxDQUFDO2lCQUN4QztZQUNILENBQUMsRUFBQyxDQUFDO1NBQ0o7SUFDSCxDQUFDO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIHRzbGludDpkaXNhYmxlOnZhcmlhYmxlLW5hbWVcbi8vIHRzbGludDpkaXNhYmxlOm5vLXZhci1rZXl3b3JkXG4vLyB0c2xpbnQ6ZGlzYWJsZTpwcmVmZXItY29uc3Rcbi8vIHRzbGludDpkaXNhYmxlOm9ubHktYXJyb3ctZnVuY3Rpb25zXG4vLyB0c2xpbnQ6ZGlzYWJsZTpvbmUtdmFyaWFibGUtcGVyLWRlY2xhcmF0aW9uXG4vLyB0c2xpbnQ6ZGlzYWJsZTpvYmplY3QtbGl0ZXJhbC1zaG9ydGhhbmRcbi8vIHRzbGludDpkaXNhYmxlOnNwYWNlLWJlZm9yZS1mdW5jdGlvbi1wYXJlblxuXG5kZWNsYXJlIGNsYXNzIENoYXJ0IHtcbiAgc3RhdGljIHJlYWRvbmx5IENoYXJ0OiB0eXBlb2YgQ2hhcnQ7XG4gIHN0YXRpYyByZWFkb25seSBUb29sdGlwOiBhbnk7XG4gIHN0YXRpYyByZWFkb25seSBoZWxwZXJzOiBhbnk7XG4gIHN0YXRpYyByZWFkb25seSBkZWZhdWx0czogYW55O1xuICBzdGF0aWMgcmVhZG9ubHkgcGx1Z2luczogYW55O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbW9ua2V5UGF0Y2hDaGFydEpzTGVnZW5kKCkge1xuICBpZiAodHlwZW9mIENoYXJ0ID09PSAndW5kZWZpbmVkJykge1xuICAgIGNvbnNvbGUubG9nKCdDaGFydCBub3QgZGVmaW5lZCAoZ3Vlc3NpbmcgdGhpcyBpcyBhIHVuaXZlcnNhbCBidWlsZCwgYW5kIEkgZG9uXFwndCBrbm93IHdoeSB0aGlzIGhhcHBlbnMgLS0gQXZpYWQpJyk7XG4gICAgcmV0dXJuO1xuICB9XG4gIGNvbnN0IHBsdWdpbnMgPSBDaGFydC5wbHVnaW5zLmdldEFsbCgpO1xuICBjb25zdCBsZWdlbmQgPSBwbHVnaW5zLmZpbHRlcihwID0+IHAuaWQgPT09ICdsZWdlbmQnKVswXTtcbiAgbGVnZW5kLl9lbGVtZW50LnByb3RvdHlwZS5maXQgPSBmaXQ7XG4gIGxlZ2VuZC5fZWxlbWVudC5wcm90b3R5cGUuZHJhdyA9IGRyYXc7XG5cbiAgY29uc3QgaGVscGVycyA9IENoYXJ0LmhlbHBlcnM7XG4gIGNvbnN0IGRlZmF1bHRzID0gQ2hhcnQuZGVmYXVsdHM7XG4gIGNvbnN0IHZhbHVlT3JEZWZhdWx0ID0gaGVscGVycy52YWx1ZU9yRGVmYXVsdDtcblxuICBmdW5jdGlvbiBnZXRCb3hXaWR0aChsYWJlbE9wdHMsIGZvbnRTaXplKSB7XG4gICAgcmV0dXJuIGxhYmVsT3B0cy51c2VQb2ludFN0eWxlICYmIGxhYmVsT3B0cy5ib3hXaWR0aCA+IGZvbnRTaXplID9cbiAgICAgIGZvbnRTaXplIDpcbiAgICAgIGxhYmVsT3B0cy5ib3hXaWR0aDtcbiAgfVxuXG4gIGZ1bmN0aW9uIGZpdCgpIHtcbiAgICB2YXIgbWUgPSB0aGlzO1xuICAgIHZhciBvcHRzID0gbWUub3B0aW9ucztcbiAgICB2YXIgbGFiZWxPcHRzID0gb3B0cy5sYWJlbHM7XG4gICAgdmFyIGRpc3BsYXkgPSBvcHRzLmRpc3BsYXk7XG5cbiAgICB2YXIgY3R4ID0gbWUuY3R4O1xuXG4gICAgdmFyIGxhYmVsRm9udCA9IGhlbHBlcnMub3B0aW9ucy5fcGFyc2VGb250KGxhYmVsT3B0cyk7XG4gICAgdmFyIGZvbnRTaXplID0gbGFiZWxGb250LnNpemU7XG5cbiAgICAvLyBSZXNldCBoaXQgYm94ZXNcbiAgICB2YXIgaGl0Ym94ZXMgPSBtZS5sZWdlbmRIaXRCb3hlcyA9IFtdO1xuXG4gICAgdmFyIG1pblNpemUgPSBtZS5taW5TaXplO1xuICAgIHZhciBpc0hvcml6b250YWwgPSBtZS5pc0hvcml6b250YWwoKTtcblxuICAgIGlmIChpc0hvcml6b250YWwpIHtcbiAgICAgIG1pblNpemUud2lkdGggPSBtZS5tYXhXaWR0aDsgLy8gZmlsbCBhbGwgdGhlIHdpZHRoXG4gICAgICBtaW5TaXplLmhlaWdodCA9IGRpc3BsYXkgPyAxMCA6IDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIG1pblNpemUud2lkdGggPSBkaXNwbGF5ID8gMTAgOiAwO1xuICAgICAgbWluU2l6ZS5oZWlnaHQgPSBtZS5tYXhIZWlnaHQ7IC8vIGZpbGwgYWxsIHRoZSBoZWlnaHRcbiAgICB9XG5cbiAgICB2YXIgZ2V0TWF4TGluZVdpZHRoID0gZnVuY3Rpb24gKHRleHRMaW5lcykge1xuICAgICAgcmV0dXJuIHRleHRMaW5lcy5tYXAoZnVuY3Rpb24gKHRleHRMaW5lKSB7XG4gICAgICAgIHJldHVybiBjdHgubWVhc3VyZVRleHQodGV4dExpbmUpLndpZHRoO1xuICAgICAgfSkucmVkdWNlKGZ1bmN0aW9uIChhY2MsIHYpIHtcbiAgICAgICAgcmV0dXJuIHYgPiBhY2MgPyB2IDogYWNjO1xuICAgICAgfSwgMCk7XG4gICAgfTtcblxuICAgIC8vIEluY3JlYXNlIHNpemVzIGhlcmVcbiAgICBpZiAoZGlzcGxheSkge1xuICAgICAgY3R4LmZvbnQgPSBsYWJlbEZvbnQuc3RyaW5nO1xuXG4gICAgICBpZiAoaXNIb3Jpem9udGFsKSB7XG5cbiAgICAgICAgLy8gTGFiZWxzXG5cbiAgICAgICAgLy8gV2lkdGggb2YgZWFjaCBsaW5lIG9mIGxlZ2VuZCBib3hlcy4gTGFiZWxzIHdyYXAgb250byBtdWx0aXBsZSBsaW5lcyB3aGVuIHRoZXJlIGFyZSB0b28gbWFueSB0byBmaXQgb24gb25lXG4gICAgICAgIHZhciBsaW5lV2lkdGhzID0gbWUubGluZVdpZHRocyA9IFswXTtcbiAgICAgICAgdmFyIGxpbmVIZWlnaHRzID0gbWUubGluZUhlaWdodHMgPSBbXTtcbiAgICAgICAgdmFyIGN1cnJlbnRMaW5lSGVpZ2h0ID0gMDtcbiAgICAgICAgdmFyIGxpbmVJbmRleCA9IDA7XG5cbiAgICAgICAgY3R4LnRleHRBbGlnbiA9ICdsZWZ0JztcbiAgICAgICAgY3R4LnRleHRCYXNlbGluZSA9ICd0b3AnO1xuXG4gICAgICAgIGhlbHBlcnMuZWFjaChtZS5sZWdlbmRJdGVtcywgZnVuY3Rpb24gKGxlZ2VuZEl0ZW0sIGkpIHtcbiAgICAgICAgICB2YXIgd2lkdGgsIGhlaWdodDtcblxuICAgICAgICAgIGlmIChoZWxwZXJzLmlzQXJyYXkobGVnZW5kSXRlbS50ZXh0KSkge1xuICAgICAgICAgICAgd2lkdGggPSBnZXRNYXhMaW5lV2lkdGgobGVnZW5kSXRlbS50ZXh0KTtcbiAgICAgICAgICAgIGhlaWdodCA9IGZvbnRTaXplICogbGVnZW5kSXRlbS50ZXh0Lmxlbmd0aCArIGxhYmVsT3B0cy5wYWRkaW5nO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB3aWR0aCA9IGN0eC5tZWFzdXJlVGV4dChsZWdlbmRJdGVtLnRleHQpLndpZHRoO1xuICAgICAgICAgICAgaGVpZ2h0ID0gZm9udFNpemUgKyBsYWJlbE9wdHMucGFkZGluZztcbiAgICAgICAgICB9XG4gICAgICAgICAgd2lkdGggKz0gZ2V0Qm94V2lkdGgobGFiZWxPcHRzLCBmb250U2l6ZSkgKyAoZm9udFNpemUgLyAyKTtcblxuICAgICAgICAgIGlmIChsaW5lV2lkdGhzW2xpbmVXaWR0aHMubGVuZ3RoIC0gMV0gKyB3aWR0aCArIDIgKiBsYWJlbE9wdHMucGFkZGluZyA+IG1pblNpemUud2lkdGgpIHtcbiAgICAgICAgICAgIGxpbmVIZWlnaHRzLnB1c2goY3VycmVudExpbmVIZWlnaHQpO1xuICAgICAgICAgICAgY3VycmVudExpbmVIZWlnaHQgPSAwO1xuICAgICAgICAgICAgbGluZVdpZHRoc1tsaW5lV2lkdGhzLmxlbmd0aCAtIChpID4gMCA/IDAgOiAxKV0gPSAwO1xuICAgICAgICAgICAgbGluZUluZGV4Kys7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbGVnZW5kSXRlbS5saW5lT3JDb2x1bW5JbmRleCA9IGxpbmVJbmRleDtcblxuICAgICAgICAgIGlmIChoZWlnaHQgPiBjdXJyZW50TGluZUhlaWdodCkge1xuICAgICAgICAgICAgY3VycmVudExpbmVIZWlnaHQgPSBoZWlnaHQ7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgLy8gU3RvcmUgdGhlIGhpdGJveCB3aWR0aCBhbmQgaGVpZ2h0IGhlcmUuIEZpbmFsIHBvc2l0aW9uIHdpbGwgYmUgdXBkYXRlZCBpbiBgZHJhd2BcbiAgICAgICAgICBoaXRib3hlc1tpXSA9IHtcbiAgICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICB3aWR0aDogd2lkdGgsXG4gICAgICAgICAgICBoZWlnaHQ6IGhlaWdodCxcbiAgICAgICAgICB9O1xuXG4gICAgICAgICAgbGluZVdpZHRoc1tsaW5lV2lkdGhzLmxlbmd0aCAtIDFdICs9IHdpZHRoICsgbGFiZWxPcHRzLnBhZGRpbmc7XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGxpbmVIZWlnaHRzLnB1c2goY3VycmVudExpbmVIZWlnaHQpO1xuICAgICAgICBtaW5TaXplLmhlaWdodCArPSBsaW5lSGVpZ2h0cy5yZWR1Y2UoZnVuY3Rpb24gKGFjYywgdikge1xuICAgICAgICAgIHJldHVybiBhY2MgKyB2O1xuICAgICAgICB9LCAwKTtcblxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIHZQYWRkaW5nID0gbGFiZWxPcHRzLnBhZGRpbmc7XG4gICAgICAgIHZhciBjb2x1bW5XaWR0aHMgPSBtZS5jb2x1bW5XaWR0aHMgPSBbXTtcbiAgICAgICAgdmFyIGNvbHVtbkhlaWdodHMgPSBtZS5jb2x1bW5IZWlnaHRzID0gW107XG4gICAgICAgIHZhciB0b3RhbFdpZHRoID0gbGFiZWxPcHRzLnBhZGRpbmc7XG4gICAgICAgIHZhciBjdXJyZW50Q29sV2lkdGggPSAwO1xuICAgICAgICB2YXIgY3VycmVudENvbEhlaWdodCA9IDA7XG4gICAgICAgIHZhciBjb2x1bW5JbmRleCA9IDA7XG5cbiAgICAgICAgaGVscGVycy5lYWNoKG1lLmxlZ2VuZEl0ZW1zLCBmdW5jdGlvbiAobGVnZW5kSXRlbSwgaSkge1xuICAgICAgICAgIHZhciBpdGVtV2lkdGg7XG4gICAgICAgICAgdmFyIGhlaWdodDtcblxuICAgICAgICAgIGlmIChoZWxwZXJzLmlzQXJyYXkobGVnZW5kSXRlbS50ZXh0KSkge1xuICAgICAgICAgICAgaXRlbVdpZHRoID0gZ2V0TWF4TGluZVdpZHRoKGxlZ2VuZEl0ZW0udGV4dCk7XG4gICAgICAgICAgICBoZWlnaHQgPSBmb250U2l6ZSAqIGxlZ2VuZEl0ZW0udGV4dC5sZW5ndGg7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGl0ZW1XaWR0aCA9IGN0eC5tZWFzdXJlVGV4dChsZWdlbmRJdGVtLnRleHQpLndpZHRoO1xuICAgICAgICAgICAgaGVpZ2h0ID0gZm9udFNpemU7XG4gICAgICAgICAgfVxuICAgICAgICAgIGl0ZW1XaWR0aCArPSBnZXRCb3hXaWR0aChsYWJlbE9wdHMsIGZvbnRTaXplKSArIChmb250U2l6ZSAvIDIpO1xuXG4gICAgICAgICAgLy8gSWYgdG9vIHRhbGwsIGdvIHRvIG5ldyBjb2x1bW5cbiAgICAgICAgICBpZiAoY3VycmVudENvbEhlaWdodCArIGZvbnRTaXplICsgMiAqIHZQYWRkaW5nID4gbWluU2l6ZS5oZWlnaHQpIHtcbiAgICAgICAgICAgIHRvdGFsV2lkdGggKz0gY3VycmVudENvbFdpZHRoICsgbGFiZWxPcHRzLnBhZGRpbmc7XG4gICAgICAgICAgICBjb2x1bW5XaWR0aHMucHVzaChjdXJyZW50Q29sV2lkdGgpOyAvLyBwcmV2aW91cyBjb2x1bW4gd2lkdGhcbiAgICAgICAgICAgIGNvbHVtbkhlaWdodHMucHVzaChjdXJyZW50Q29sSGVpZ2h0KTtcbiAgICAgICAgICAgIGN1cnJlbnRDb2xXaWR0aCA9IDA7XG4gICAgICAgICAgICBjdXJyZW50Q29sSGVpZ2h0ID0gMDtcbiAgICAgICAgICAgIGNvbHVtbkluZGV4Kys7XG4gICAgICAgICAgfVxuXG4gICAgICAgICAgbGVnZW5kSXRlbS5saW5lT3JDb2x1bW5JbmRleCA9IGNvbHVtbkluZGV4O1xuXG4gICAgICAgICAgLy8gR2V0IG1heCB3aWR0aFxuICAgICAgICAgIGN1cnJlbnRDb2xXaWR0aCA9IE1hdGgubWF4KGN1cnJlbnRDb2xXaWR0aCwgaXRlbVdpZHRoKTtcbiAgICAgICAgICBjdXJyZW50Q29sSGVpZ2h0ICs9IGhlaWdodCArIHZQYWRkaW5nO1xuXG4gICAgICAgICAgLy8gU3RvcmUgdGhlIGhpdGJveCB3aWR0aCBhbmQgaGVpZ2h0IGhlcmUuIEZpbmFsIHBvc2l0aW9uIHdpbGwgYmUgdXBkYXRlZCBpbiBgZHJhd2BcbiAgICAgICAgICBoaXRib3hlc1tpXSA9IHtcbiAgICAgICAgICAgIGxlZnQ6IDAsXG4gICAgICAgICAgICB0b3A6IDAsXG4gICAgICAgICAgICB3aWR0aDogaXRlbVdpZHRoLFxuICAgICAgICAgICAgaGVpZ2h0OiBoZWlnaHRcbiAgICAgICAgICB9O1xuICAgICAgICB9KTtcblxuICAgICAgICB0b3RhbFdpZHRoICs9IGN1cnJlbnRDb2xXaWR0aDtcbiAgICAgICAgY29sdW1uV2lkdGhzLnB1c2goY3VycmVudENvbFdpZHRoKTtcbiAgICAgICAgY29sdW1uSGVpZ2h0cy5wdXNoKGN1cnJlbnRDb2xIZWlnaHQpO1xuICAgICAgICBtaW5TaXplLndpZHRoICs9IHRvdGFsV2lkdGg7XG4gICAgICB9XG4gICAgfVxuXG4gICAgbWUud2lkdGggPSBtaW5TaXplLndpZHRoO1xuICAgIG1lLmhlaWdodCA9IG1pblNpemUuaGVpZ2h0O1xuICB9XG5cbiAgZnVuY3Rpb24gZHJhdygpIHtcbiAgICB2YXIgbWUgPSB0aGlzO1xuICAgIHZhciBvcHRzID0gbWUub3B0aW9ucztcbiAgICB2YXIgbGFiZWxPcHRzID0gb3B0cy5sYWJlbHM7XG4gICAgdmFyIGdsb2JhbERlZmF1bHRzID0gZGVmYXVsdHMuZ2xvYmFsO1xuICAgIHZhciBkZWZhdWx0Q29sb3IgPSBnbG9iYWxEZWZhdWx0cy5kZWZhdWx0Q29sb3I7XG4gICAgdmFyIGxpbmVEZWZhdWx0ID0gZ2xvYmFsRGVmYXVsdHMuZWxlbWVudHMubGluZTtcbiAgICB2YXIgbGVnZW5kSGVpZ2h0ID0gbWUuaGVpZ2h0O1xuICAgIHZhciBjb2x1bW5IZWlnaHRzID0gbWUuY29sdW1uSGVpZ2h0cztcbiAgICB2YXIgY29sdW1uV2lkdGhzID0gbWUuY29sdW1uV2lkdGhzO1xuICAgIHZhciBsZWdlbmRXaWR0aCA9IG1lLndpZHRoO1xuICAgIHZhciBsaW5lV2lkdGhzID0gbWUubGluZVdpZHRocztcbiAgICB2YXIgbGluZUhlaWdodHMgPSBtZS5saW5lSGVpZ2h0cztcblxuICAgIGlmIChvcHRzLmRpc3BsYXkpIHtcbiAgICAgIHZhciBjdHggPSBtZS5jdHg7XG4gICAgICB2YXIgZm9udENvbG9yID0gdmFsdWVPckRlZmF1bHQobGFiZWxPcHRzLmZvbnRDb2xvciwgZ2xvYmFsRGVmYXVsdHMuZGVmYXVsdEZvbnRDb2xvcik7XG4gICAgICB2YXIgbGFiZWxGb250ID0gaGVscGVycy5vcHRpb25zLl9wYXJzZUZvbnQobGFiZWxPcHRzKTtcbiAgICAgIHZhciBmb250U2l6ZSA9IGxhYmVsRm9udC5zaXplO1xuICAgICAgdmFyIGN1cnNvcjtcblxuICAgICAgLy8gQ2FudmFzIHNldHVwXG4gICAgICBjdHgudGV4dEFsaWduID0gJ2xlZnQnO1xuICAgICAgY3R4LnRleHRCYXNlbGluZSA9ICdtaWRkbGUnO1xuICAgICAgY3R4LmxpbmVXaWR0aCA9IDAuNTtcbiAgICAgIGN0eC5zdHJva2VTdHlsZSA9IGZvbnRDb2xvcjsgLy8gZm9yIHN0cmlrZXRocm91Z2ggZWZmZWN0XG4gICAgICBjdHguZmlsbFN0eWxlID0gZm9udENvbG9yOyAvLyByZW5kZXIgaW4gY29ycmVjdCBjb2xvdXJcbiAgICAgIGN0eC5mb250ID0gbGFiZWxGb250LnN0cmluZztcblxuICAgICAgdmFyIGJveFdpZHRoID0gZ2V0Qm94V2lkdGgobGFiZWxPcHRzLCBmb250U2l6ZSk7XG4gICAgICB2YXIgaGl0Ym94ZXMgPSBtZS5sZWdlbmRIaXRCb3hlcztcblxuICAgICAgLy8gY3VycmVudCBwb3NpdGlvblxuICAgICAgdmFyIGRyYXdMZWdlbmRCb3ggPSBmdW5jdGlvbiAoeCwgeSwgbGVnZW5kSXRlbSkge1xuICAgICAgICBpZiAoaXNOYU4oYm94V2lkdGgpIHx8IGJveFdpZHRoIDw9IDApIHtcbiAgICAgICAgICByZXR1cm47XG4gICAgICAgIH1cblxuICAgICAgICAvLyBTZXQgdGhlIGN0eCBmb3IgdGhlIGJveFxuICAgICAgICBjdHguc2F2ZSgpO1xuXG4gICAgICAgIHZhciBsaW5lV2lkdGggPSB2YWx1ZU9yRGVmYXVsdChsZWdlbmRJdGVtLmxpbmVXaWR0aCwgbGluZURlZmF1bHQuYm9yZGVyV2lkdGgpO1xuICAgICAgICBjdHguZmlsbFN0eWxlID0gdmFsdWVPckRlZmF1bHQobGVnZW5kSXRlbS5maWxsU3R5bGUsIGRlZmF1bHRDb2xvcik7XG4gICAgICAgIGN0eC5saW5lQ2FwID0gdmFsdWVPckRlZmF1bHQobGVnZW5kSXRlbS5saW5lQ2FwLCBsaW5lRGVmYXVsdC5ib3JkZXJDYXBTdHlsZSk7XG4gICAgICAgIGN0eC5saW5lRGFzaE9mZnNldCA9IHZhbHVlT3JEZWZhdWx0KGxlZ2VuZEl0ZW0ubGluZURhc2hPZmZzZXQsIGxpbmVEZWZhdWx0LmJvcmRlckRhc2hPZmZzZXQpO1xuICAgICAgICBjdHgubGluZUpvaW4gPSB2YWx1ZU9yRGVmYXVsdChsZWdlbmRJdGVtLmxpbmVKb2luLCBsaW5lRGVmYXVsdC5ib3JkZXJKb2luU3R5bGUpO1xuICAgICAgICBjdHgubGluZVdpZHRoID0gbGluZVdpZHRoO1xuICAgICAgICBjdHguc3Ryb2tlU3R5bGUgPSB2YWx1ZU9yRGVmYXVsdChsZWdlbmRJdGVtLnN0cm9rZVN0eWxlLCBkZWZhdWx0Q29sb3IpO1xuXG4gICAgICAgIGlmIChjdHguc2V0TGluZURhc2gpIHtcbiAgICAgICAgICAvLyBJRSA5IGFuZCAxMCBkbyBub3Qgc3VwcG9ydCBsaW5lIGRhc2hcbiAgICAgICAgICBjdHguc2V0TGluZURhc2godmFsdWVPckRlZmF1bHQobGVnZW5kSXRlbS5saW5lRGFzaCwgbGluZURlZmF1bHQuYm9yZGVyRGFzaCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKG9wdHMubGFiZWxzICYmIG9wdHMubGFiZWxzLnVzZVBvaW50U3R5bGUpIHtcbiAgICAgICAgICAvLyBSZWNhbGN1bGF0ZSB4IGFuZCB5IGZvciBkcmF3UG9pbnQoKSBiZWNhdXNlIGl0cyBleHBlY3RpbmdcbiAgICAgICAgICAvLyB4IGFuZCB5IHRvIGJlIGNlbnRlciBvZiBmaWd1cmUgKGluc3RlYWQgb2YgdG9wIGxlZnQpXG4gICAgICAgICAgdmFyIHJhZGl1cyA9IGJveFdpZHRoICogTWF0aC5TUVJUMiAvIDI7XG4gICAgICAgICAgdmFyIGNlbnRlclggPSB4ICsgYm94V2lkdGggLyAyO1xuICAgICAgICAgIHZhciBjZW50ZXJZID0geSArIGZvbnRTaXplIC8gMjtcblxuICAgICAgICAgIC8vIERyYXcgcG9pbnRTdHlsZSBhcyBsZWdlbmQgc3ltYm9sXG4gICAgICAgICAgaGVscGVycy5jYW52YXMuZHJhd1BvaW50KGN0eCwgbGVnZW5kSXRlbS5wb2ludFN0eWxlLCByYWRpdXMsIGNlbnRlclgsIGNlbnRlclkpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIERyYXcgYm94IGFzIGxlZ2VuZCBzeW1ib2xcbiAgICAgICAgICBpZiAobGluZVdpZHRoICE9PSAwKSB7XG4gICAgICAgICAgICBjdHguc3Ryb2tlUmVjdCh4LCB5LCBib3hXaWR0aCwgZm9udFNpemUpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjdHguZmlsbFJlY3QoeCwgeSwgYm94V2lkdGgsIGZvbnRTaXplKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGN0eC5yZXN0b3JlKCk7XG4gICAgICB9O1xuXG4gICAgICB2YXIgZHJhd1N0cmlrZVRocm91Z2ggPSBmdW5jdGlvbiAoeCwgeSwgdykge1xuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIGN0eC5saW5lV2lkdGggPSAyO1xuICAgICAgICBjdHgubW92ZVRvKHgsIHkpO1xuICAgICAgICBjdHgubGluZVRvKHggKyB3LCB5KTtcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xuICAgICAgfTtcblxuICAgICAgdmFyIGRyYXdDcm9zc092ZXIgPSBmdW5jdGlvbiAoeCwgeSwgdywgaCkge1xuICAgICAgICBjdHguYmVnaW5QYXRoKCk7XG4gICAgICAgIGN0eC5saW5lV2lkdGggPSAyO1xuICAgICAgICBjdHgubW92ZVRvKHgsIHkpO1xuICAgICAgICBjdHgubGluZVRvKHggKyB3LCB5ICsgaCk7XG4gICAgICAgIGN0eC5tb3ZlVG8oeCwgeSArIGgpO1xuICAgICAgICBjdHgubGluZVRvKHggKyB3LCB5KTtcbiAgICAgICAgY3R4LnN0cm9rZSgpO1xuICAgICAgfTtcblxuICAgICAgdmFyIGZpbGxUZXh0ID0gZnVuY3Rpb24gKHgsIHksIGxlZ2VuZEl0ZW0sIHRleHRXaWR0aCkge1xuICAgICAgICB2YXIgaGFsZkZvbnRTaXplID0gZm9udFNpemUgLyAyO1xuICAgICAgICB2YXIgeExlZnQgPSBib3hXaWR0aCArIGhhbGZGb250U2l6ZSArIHg7XG4gICAgICAgIHZhciB5TWlkZGxlID0geSArIGhhbGZGb250U2l6ZTtcblxuICAgICAgICBpZiAoaGVscGVycy5pc0FycmF5KGxlZ2VuZEl0ZW0udGV4dCkpIHtcbiAgICAgICAgICBoZWxwZXJzLmVhY2gobGVnZW5kSXRlbS50ZXh0LCBmdW5jdGlvbiAodGV4dExpbmUsIGluZGV4KSB7XG4gICAgICAgICAgICB2YXIgbGluZU9mZnNldCA9IGluZGV4ICogZm9udFNpemU7XG4gICAgICAgICAgICBjdHguZmlsbFRleHQodGV4dExpbmUsIHhMZWZ0LCB5TWlkZGxlICsgbGluZU9mZnNldCk7XG4gICAgICAgICAgfSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgY3R4LmZpbGxUZXh0KGxlZ2VuZEl0ZW0udGV4dCwgeExlZnQsIHlNaWRkbGUpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGxlZ2VuZEl0ZW0uaGlkZGVuKSB7XG4gICAgICAgICAgaWYgKGhlbHBlcnMuaXNBcnJheShsZWdlbmRJdGVtLnRleHQpKSB7XG4gICAgICAgICAgICBkcmF3Q3Jvc3NPdmVyKHhMZWZ0LCB5TWlkZGxlLCB0ZXh0V2lkdGgsIChsZWdlbmRJdGVtLnRleHQubGVuZ3RoIC0gMSkgKiAoZm9udFNpemUgLSAxKSk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGRyYXdTdHJpa2VUaHJvdWdoKHhMZWZ0LCB5TWlkZGxlLCB0ZXh0V2lkdGgpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfTtcblxuICAgICAgdmFyIGFsaWdubWVudE9mZnNldCA9IGZ1bmN0aW9uIChkaW1lbnNpb24sIGJsb2NrU2l6ZSkge1xuICAgICAgICBzd2l0Y2ggKG9wdHMuYWxpZ24pIHtcbiAgICAgICAgICBjYXNlICdzdGFydCc6XG4gICAgICAgICAgICByZXR1cm4gbGFiZWxPcHRzLnBhZGRpbmc7XG4gICAgICAgICAgY2FzZSAnZW5kJzpcbiAgICAgICAgICAgIHJldHVybiBkaW1lbnNpb24gLSBibG9ja1NpemU7XG4gICAgICAgICAgZGVmYXVsdDogLy8gY2VudGVyXG4gICAgICAgICAgICByZXR1cm4gKGRpbWVuc2lvbiAtIGJsb2NrU2l6ZSArIGxhYmVsT3B0cy5wYWRkaW5nKSAvIDI7XG4gICAgICAgIH1cbiAgICAgIH07XG5cbiAgICAgIC8vIEhvcml6b250YWxcbiAgICAgIHZhciBpc0hvcml6b250YWwgPSBtZS5pc0hvcml6b250YWwoKTtcbiAgICAgIGlmIChpc0hvcml6b250YWwpIHtcbiAgICAgICAgY3Vyc29yID0ge1xuICAgICAgICAgIHg6IG1lLmxlZnQgKyBhbGlnbm1lbnRPZmZzZXQobGVnZW5kV2lkdGgsIGxpbmVXaWR0aHNbMF0pLFxuICAgICAgICAgIHk6IG1lLnRvcCArIGxhYmVsT3B0cy5wYWRkaW5nLFxuICAgICAgICAgIGxpbmU6IDBcbiAgICAgICAgfTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGN1cnNvciA9IHtcbiAgICAgICAgICB4OiBtZS5sZWZ0ICsgbGFiZWxPcHRzLnBhZGRpbmcsXG4gICAgICAgICAgeTogbWUudG9wICsgYWxpZ25tZW50T2Zmc2V0KGxlZ2VuZEhlaWdodCwgY29sdW1uSGVpZ2h0c1swXSksXG4gICAgICAgICAgbGluZTogMFxuICAgICAgICB9O1xuICAgICAgfVxuXG4gICAgICBoZWxwZXJzLmVhY2gobWUubGVnZW5kSXRlbXMsIGZ1bmN0aW9uIChsZWdlbmRJdGVtLCBpKSB7XG4gICAgICAgIHZhciB0ZXh0V2lkdGgsIGhlaWdodCwgYm94VG9wT2Zmc2V0O1xuXG4gICAgICAgIGlmIChsZWdlbmRJdGVtLmxpbmVPckNvbHVtbkluZGV4ID4gY3Vyc29yLmxpbmUpIHtcbiAgICAgICAgICBpZiAoaXNIb3Jpem9udGFsKSB7XG4gICAgICAgICAgICBjdXJzb3IueSArPSBsaW5lSGVpZ2h0c1tjdXJzb3IubGluZV07XG4gICAgICAgICAgICBjdXJzb3IubGluZSA9IGxlZ2VuZEl0ZW0ubGluZU9yQ29sdW1uSW5kZXg7XG4gICAgICAgICAgICBjdXJzb3IueCA9IG1lLmxlZnQgKyBhbGlnbm1lbnRPZmZzZXQobGVnZW5kV2lkdGgsIGxpbmVXaWR0aHNbY3Vyc29yLmxpbmVdKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY3Vyc29yLnggKz0gY29sdW1uV2lkdGhzW2N1cnNvci5saW5lXSArIGxhYmVsT3B0cy5wYWRkaW5nO1xuICAgICAgICAgICAgY3Vyc29yLmxpbmUgPSBsZWdlbmRJdGVtLmxpbmVPckNvbHVtbkluZGV4O1xuICAgICAgICAgICAgY3Vyc29yLnkgPSBtZS50b3AgKyBhbGlnbm1lbnRPZmZzZXQobGVnZW5kSGVpZ2h0LCBjb2x1bW5IZWlnaHRzW2N1cnNvci5saW5lXSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKGhlbHBlcnMuaXNBcnJheShsZWdlbmRJdGVtLnRleHQpKSB7XG4gICAgICAgICAgdGV4dFdpZHRoID0gbGVnZW5kSXRlbS50ZXh0Lm1hcChmdW5jdGlvbiAodGV4dExpbmUpIHtcbiAgICAgICAgICAgIHJldHVybiBjdHgubWVhc3VyZVRleHQodGV4dExpbmUpLndpZHRoO1xuICAgICAgICAgIH0pLnJlZHVjZShmdW5jdGlvbiAoYWNjLCB2KSB7XG4gICAgICAgICAgICByZXR1cm4gdiA+IGFjYyA/IHYgOiBhY2M7XG4gICAgICAgICAgfSwgMCk7XG4gICAgICAgICAgYm94VG9wT2Zmc2V0ID0gZm9udFNpemUgLyAyICogKGxlZ2VuZEl0ZW0udGV4dC5sZW5ndGggLSAxKTtcbiAgICAgICAgICBoZWlnaHQgPSBmb250U2l6ZSAqIGxlZ2VuZEl0ZW0udGV4dC5sZW5ndGg7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGV4dFdpZHRoID0gY3R4Lm1lYXN1cmVUZXh0KGxlZ2VuZEl0ZW0udGV4dCkud2lkdGg7XG4gICAgICAgICAgYm94VG9wT2Zmc2V0ID0gMDtcbiAgICAgICAgICBoZWlnaHQgPSBmb250U2l6ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciB3aWR0aCA9IGJveFdpZHRoICsgKGZvbnRTaXplIC8gMikgKyB0ZXh0V2lkdGg7XG4gICAgICAgIHZhciB4ID0gY3Vyc29yLng7XG4gICAgICAgIHZhciB5ID0gY3Vyc29yLnk7XG5cbiAgICAgICAgdmFyIHRvcE9mZnNldCA9IGlzSG9yaXpvbnRhbCA/IE1hdGgudHJ1bmMoKGxpbmVIZWlnaHRzW2N1cnNvci5saW5lXSAtIGhpdGJveGVzW2ldLmhlaWdodCkgLyAyKSA6IDA7XG5cbiAgICAgICAgZHJhd0xlZ2VuZEJveCh4LCB5ICsgYm94VG9wT2Zmc2V0ICsgdG9wT2Zmc2V0LCBsZWdlbmRJdGVtKTtcblxuICAgICAgICBoaXRib3hlc1tpXS5sZWZ0ID0geDtcbiAgICAgICAgaGl0Ym94ZXNbaV0udG9wID0geTtcblxuICAgICAgICAvLyBGaWxsIHRoZSBhY3R1YWwgbGFiZWxcbiAgICAgICAgZmlsbFRleHQoeCwgeSArIHRvcE9mZnNldCwgbGVnZW5kSXRlbSwgdGV4dFdpZHRoKTtcblxuICAgICAgICBpZiAoaXNIb3Jpem9udGFsKSB7XG4gICAgICAgICAgY3Vyc29yLnggKz0gd2lkdGggKyBsYWJlbE9wdHMucGFkZGluZztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBjdXJzb3IueSArPSBoZWlnaHQgKyBsYWJlbE9wdHMucGFkZGluZztcbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfVxuICB9XG59XG4iXX0=