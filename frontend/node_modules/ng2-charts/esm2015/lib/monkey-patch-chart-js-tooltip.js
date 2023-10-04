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
export function monkeyPatchChartJsTooltip() {
    if (typeof Chart === 'undefined') {
        console.log('Chart not defined (guessing this is a universal build, and I don\'t know why this happens -- Aviad)');
        return;
    }
    Chart.Tooltip.prototype.drawBody = drawBody;
    /** @type {?} */
    const helpers = Chart.helpers;
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
        var fillLineOfText = (/**
         * @param {?} line
         * @return {?}
         */
        function (line) {
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
        helpers.each(body, (/**
         * @param {?} bodyItem
         * @param {?} i
         * @return {?}
         */
        function (bodyItem, i) {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibW9ua2V5LXBhdGNoLWNoYXJ0LWpzLXRvb2x0aXAuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi9wcm9qZWN0cy9uZzItY2hhcnRzL3NyYy9saWIvbW9ua2V5LXBhdGNoLWNoYXJ0LWpzLXRvb2x0aXAudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7O0FBZ0JBLE1BQU0sVUFBVSx5QkFBeUI7SUFDdkMsSUFBSSxPQUFPLEtBQUssS0FBSyxXQUFXLEVBQUU7UUFDaEMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxxR0FBcUcsQ0FBQyxDQUFDO1FBQ25ILE9BQU87S0FDUjtJQUNELEtBQUssQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLFFBQVEsR0FBRyxRQUFRLENBQUM7O1VBQ3RDLE9BQU8sR0FBRyxLQUFLLENBQUMsT0FBTzs7Ozs7O0lBRTdCLFNBQVMsV0FBVyxDQUFDLEVBQUUsRUFBRSxLQUFLO1FBQzVCLE9BQU8sS0FBSyxLQUFLLFFBQVE7WUFDdkIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEtBQUssR0FBRyxDQUFDO1lBQ3JCLENBQUMsQ0FBQyxLQUFLLEtBQUssT0FBTztnQkFDakIsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUMsUUFBUTtnQkFDL0IsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxDQUFDLEdBQUcsRUFBRSxDQUFDLFFBQVEsQ0FBQztJQUMzQixDQUFDOzs7Ozs7O0lBRUQsU0FBUyxRQUFRLENBQUMsRUFBRSxFQUFFLEVBQUUsRUFBRSxHQUFHOztZQUN2QixZQUFZLEdBQUcsRUFBRSxDQUFDLFlBQVk7O1lBQzlCLFdBQVcsR0FBRyxFQUFFLENBQUMsV0FBVzs7WUFDNUIsU0FBUyxHQUFHLEVBQUUsQ0FBQyxVQUFVOztZQUN6QixJQUFJLEdBQUcsRUFBRSxDQUFDLElBQUk7O1lBQ2QsY0FBYyxHQUFHLEVBQUUs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QyxRQUFRLENBQUMsS0FBSyxFQUFFLGNBQWMsQ0FBQyxDQUFDO1FBQy9DLENBQUMsRUFBQyxDQUFDO1FBRUgsaUNBQWlDO1FBQ2pDLFlBQVksR0FBRyxDQUFDLENBQUM7UUFFakIsbUJBQW1CO1FBQ25CLE9BQU8sQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLFNBQVMsRUFBRSxjQUFjLENBQUMsQ0FBQztRQUMzQyxFQUFFLENBQUMsQ0FBQyxJQUFJLFdBQVcsQ0FBQyxDQUFDLDJCQUEyQjtJQUNsRCxDQUFDO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8vIHRzbGludDpkaXNhYmxlOnZhcmlhYmxlLW5hbWVcbi8vIHRzbGludDpkaXNhYmxlOm5vLXZhci1rZXl3b3JkXG4vLyB0c2xpbnQ6ZGlzYWJsZTpwcmVmZXItY29uc3Rcbi8vIHRzbGludDpkaXNhYmxlOm9ubHktYXJyb3ctZnVuY3Rpb25zXG4vLyB0c2xpbnQ6ZGlzYWJsZTpvbmUtdmFyaWFibGUtcGVyLWRlY2xhcmF0aW9uXG4vLyB0c2xpbnQ6ZGlzYWJsZTpvYmplY3QtbGl0ZXJhbC1zaG9ydGhhbmRcbi8vIHRzbGludDpkaXNhYmxlOnNwYWNlLWJlZm9yZS1mdW5jdGlvbi1wYXJlblxuXG5kZWNsYXJlIGNsYXNzIENoYXJ0IHtcbiAgc3RhdGljIHJlYWRvbmx5IENoYXJ0OiB0eXBlb2YgQ2hhcnQ7XG4gIHN0YXRpYyByZWFkb25seSBUb29sdGlwOiBhbnk7XG4gIHN0YXRpYyByZWFkb25seSBoZWxwZXJzOiBhbnk7XG4gIHN0YXRpYyByZWFkb25seSBkZWZhdWx0czogYW55O1xuICBzdGF0aWMgcmVhZG9ubHkgcGx1Z2luczogYW55O1xufVxuXG5leHBvcnQgZnVuY3Rpb24gbW9ua2V5UGF0Y2hDaGFydEpzVG9vbHRpcCgpIHtcbiAgaWYgKHR5cGVvZiBDaGFydCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICBjb25zb2xlLmxvZygnQ2hhcnQgbm90IGRlZmluZWQgKGd1ZXNzaW5nIHRoaXMgaXMgYSB1bml2ZXJzYWwgYnVpbGQsIGFuZCBJIGRvblxcJ3Qga25vdyB3aHkgdGhpcyBoYXBwZW5zIC0tIEF2aWFkKScpO1xuICAgIHJldHVybjtcbiAgfVxuICBDaGFydC5Ub29sdGlwLnByb3RvdHlwZS5kcmF3Qm9keSA9IGRyYXdCb2R5O1xuICBjb25zdCBoZWxwZXJzID0gQ2hhcnQuaGVscGVycztcblxuICBmdW5jdGlvbiBnZXRBbGlnbmVkWCh2bSwgYWxpZ24pIHtcbiAgICByZXR1cm4gYWxpZ24gPT09ICdjZW50ZXInXG4gICAgICA/IHZtLnggKyB2bS53aWR0aCAvIDJcbiAgICAgIDogYWxpZ24gPT09ICdyaWdodCdcbiAgICAgICAgPyB2bS54ICsgdm0ud2lkdGggLSB2bS54UGFkZGluZ1xuICAgICAgICA6IHZtLnggKyB2bS54UGFkZGluZztcbiAgfVxuXG4gIGZ1bmN0aW9uIGRyYXdCb2R5KHB0LCB2bSwgY3R4KSB7XG4gICAgdmFyIGJvZHlGb250U2l6ZSA9IHZtLmJvZHlGb250U2l6ZTtcbiAgICB2YXIgYm9keVNwYWNpbmcgPSB2bS5ib2R5U3BhY2luZztcbiAgICB2YXIgYm9keUFsaWduID0gdm0uX2JvZHlBbGlnbjtcbiAgICB2YXIgYm9keSA9IHZtLmJvZHk7XG4gICAgdmFyIGRyYXdDb2xvckJveGVzID0gdm0uZGlzcGxheUNvbG9ycztcbiAgICB2YXIgbGFiZWxDb2xvcnMgPSB2bS5sYWJlbENvbG9ycztcbiAgICB2YXIgeExpbmVQYWRkaW5nID0gMDtcbiAgICB2YXIgY29sb3JYID0gZHJhd0NvbG9yQm94ZXMgPyBnZXRBbGlnbmVkWCh2bSwgJ2xlZnQnKSA6IDA7XG4gICAgdmFyIHRleHRDb2xvcjtcblxuICAgIGN0eC50ZXh0QWxpZ24gPSBib2R5QWxpZ247XG4gICAgY3R4LnRleHRCYXNlbGluZSA9ICd0b3AnO1xuICAgIGN0eC5mb250ID0gaGVscGVycy5mb250U3RyaW5nKGJvZHlGb250U2l6ZSwgdm0uX2JvZHlGb250U3R5bGUsIHZtLl9ib2R5Rm9udEZhbWlseSk7XG5cbiAgICBwdC54ID0gZ2V0QWxpZ25lZFgodm0sIGJvZHlBbGlnbik7XG5cbiAgICAvLyBCZWZvcmUgQm9keVxuICAgIHZhciBmaWxsTGluZU9mVGV4dCA9IGZ1bmN0aW9uIChsaW5lKSB7XG4gICAgICBjdHguZmlsbFRleHQobGluZSwgcHQueCArIHhMaW5lUGFkZGluZywgcHQueSk7XG4gICAgICBwdC55ICs9IGJvZHlGb250U2l6ZSArIGJvZHlTcGFjaW5nO1xuICAgIH07XG5cbiAgICAvLyBCZWZvcmUgYm9keSBsaW5lc1xuICAgIGN0eC5maWxsU3R5bGUgPSB2bS5ib2R5Rm9udENvbG9yO1xuICAgIGhlbHBlcnMuZWFjaCh2bS5iZWZvcmVCb2R5LCBmaWxsTGluZU9mVGV4dCk7XG5cbiAgICB4TGluZVBhZGRpbmcgPSBkcmF3Q29sb3JCb3hlcyAmJiBib2R5QWxpZ24gIT09ICdyaWdodCdcbiAgICAgID8gYm9keUFsaWduID09PSAnY2VudGVyJyA/IChib2R5Rm9udFNpemUgLyAyICsgMSkgOiAoYm9keUZvbnRTaXplICsgMilcbiAgICAgIDogMDtcblxuICAgIC8vIERyYXcgYm9keSBsaW5lcyBub3dcbiAgICBoZWxwZXJzLmVhY2goYm9keSwgZnVuY3Rpb24gKGJvZHlJdGVtLCBpKSB7XG4gICAgICB0ZXh0Q29sb3IgPSB2bS5sYWJlbFRleHRDb2xvcnNbaV07XG4gICAgICBjdHguZmlsbFN0eWxlID0gdGV4dENvbG9yO1xuICAgICAgaGVscGVycy5lYWNoKGJvZHlJdGVtLmJlZm9yZSwgZmlsbExpbmVPZlRleHQpO1xuXG4gICAgICAvLyBEcmF3IExlZ2VuZC1saWtlIGJveGVzIGlmIG5lZWRlZFxuICAgICAgaWYgKGRyYXdDb2xvckJveGVzKSB7XG4gICAgICAgIC8vIEZpbGwgYSB3aGl0ZSByZWN0IHNvIHRoYXQgY29sb3VycyBtZXJnZSBuaWNlbHkgaWYgdGhlIG9wYWNpdHkgaXMgPCAxXG4gICAgICAgIGN0eC5maWxsU3R5bGUgPSB2bS5sZWdlbmRDb2xvckJhY2tncm91bmQ7XG4gICAgICAgIGN0eC5maWxsUmVjdChjb2xvclgsIHB0LnksIGJvZHlGb250U2l6ZSwgYm9keUZvbnRTaXplKTtcblxuICAgICAgICAvLyBCb3JkZXJcbiAgICAgICAgY3R4LmxpbmVXaWR0aCA9IDE7XG4gICAgICAgIGN0eC5zdHJva2VTdHlsZSA9IGxhYmVsQ29sb3JzW2ldLmJvcmRlckNvbG9yO1xuICAgICAgICBjdHguc3Ryb2tlUmVjdChjb2xvclgsIHB0LnksIGJvZHlGb250U2l6ZSwgYm9keUZvbnRTaXplKTtcblxuICAgICAgICAvLyBJbm5lciBzcXVhcmVcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IGxhYmVsQ29sb3JzW2ldLmJhY2tncm91bmRDb2xvcjtcbiAgICAgICAgY3R4LmZpbGxSZWN0KGNvbG9yWCArIDEsIHB0LnkgKyAxLCBib2R5Rm9udFNpemUgLSAyLCBib2R5Rm9udFNpemUgLSAyKTtcbiAgICAgICAgY3R4LmZpbGxTdHlsZSA9IHRleHRDb2xvcjtcbiAgICAgIH1cblxuICAgICAgaGVscGVycy5lYWNoKGJvZHlJdGVtLmxpbmVzLCBmaWxsTGluZU9mVGV4dCk7XG5cbiAgICAgIGhlbHBlcnMuZWFjaChib2R5SXRlbS5hZnRlciwgZmlsbExpbmVPZlRleHQpO1xuICAgIH0pO1xuXG4gICAgLy8gUmVzZXQgYmFjayB0byAwIGZvciBhZnRlciBib2R5XG4gICAgeExpbmVQYWRkaW5nID0gMDtcblxuICAgIC8vIEFmdGVyIGJvZHkgbGluZXNcbiAgICBoZWxwZXJzLmVhY2godm0uYWZ0ZXJCb2R5LCBmaWxsTGluZU9mVGV4dCk7XG4gICAgcHQueSAtPSBib2R5U3BhY2luZzsgLy8gUmVtb3ZlIGxhc3QgYm9keSBzcGFjaW5nXG4gIH1cbn1cbiJdfQ==