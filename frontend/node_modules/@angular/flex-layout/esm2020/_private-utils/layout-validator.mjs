/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
export const INLINE = 'inline';
export const LAYOUT_VALUES = ['row', 'column', 'row-reverse', 'column-reverse'];
/**
 * Validate the direction|'direction wrap' value and then update the host's inline flexbox styles
 */
export function buildLayoutCSS(value) {
    let [direction, wrap, isInline] = validateValue(value);
    return buildCSS(direction, wrap, isInline);
}
/**
  * Validate the value to be one of the acceptable value options
  * Use default fallback of 'row'
  */
export function validateValue(value) {
    value = value?.toLowerCase() ?? '';
    let [direction, wrap, inline] = value.split(' ');
    // First value must be the `flex-direction`
    if (!LAYOUT_VALUES.find(x => x === direction)) {
        direction = LAYOUT_VALUES[0];
    }
    if (wrap === INLINE) {
        wrap = (inline !== INLINE) ? inline : '';
        inline = INLINE;
    }
    return [direction, validateWrapValue(wrap), !!inline];
}
/**
 * Determine if the validated, flex-direction value specifies
 * a horizontal/row flow.
 */
export function isFlowHorizontal(value) {
    let [flow,] = validateValue(value);
    return flow.indexOf('row') > -1;
}
/**
 * Convert layout-wrap='<value>' to expected flex-wrap style
 */
export function validateWrapValue(value) {
    if (!!value) {
        switch (value.toLowerCase()) {
            case 'reverse':
            case 'wrap-reverse':
            case 'reverse-wrap':
                value = 'wrap-reverse';
                break;
            case 'no':
            case 'none':
            case 'nowrap':
                value = 'nowrap';
                break;
            // All other values fallback to 'wrap'
            default:
                value = 'wrap';
                break;
        }
    }
    return value;
}
/**
 * Build the CSS that should be assigned to the element instance
 * BUG:
 *   1) min-height on a column flex container won’t apply to its flex item children in IE 10-11.
 *      Use height instead if possible; height : <xxx>vh;
 *
 *  This way any padding or border specified on the child elements are
 *  laid out and drawn inside that element's specified width and height.
 */
function buildCSS(direction, wrap = null, inline = false) {
    return {
        display: inline ? 'inline-flex' : 'flex',
        'box-sizing': 'border-box',
        'flex-direction': direction,
        'flex-wrap': wrap || null,
    };
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibGF5b3V0LXZhbGlkYXRvci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2xpYnMvZmxleC1sYXlvdXQvX3ByaXZhdGUtdXRpbHMvbGF5b3V0LXZhbGlkYXRvci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFDSCxNQUFNLENBQUMsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDO0FBQy9CLE1BQU0sQ0FBQyxNQUFNLGFBQWEsR0FBRyxDQUFDLEtBQUssRUFBRSxRQUFRLEVBQUUsYUFBYSxFQUFFLGdCQUFnQixDQUFDLENBQUM7QUFFaEY7O0dBRUc7QUFDSCxNQUFNLFVBQVUsY0FBYyxDQUFDLEtBQWE7SUFDMUMsSUFBSSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLEdBQUcsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3ZELE9BQU8sUUFBUSxDQUFDLFNBQVMsRUFBRSxJQUFJLEVBQUUsUUFBUSxDQUFDLENBQUM7QUFDN0MsQ0FBQztBQUVEOzs7SUFHSTtBQUNKLE1BQU0sVUFBVSxhQUFhLENBQUMsS0FBYTtJQUN6QyxLQUFLLEdBQUcsS0FBSyxFQUFFLFdBQVcsRUFBRSxJQUFJLEVBQUUsQ0FBQztJQUNuQyxJQUFJLENBQUMsU0FBUyxFQUFFLElBQUksRUFBRSxNQUFNLENBQUMsR0FBRyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBRWpELDJDQUEyQztJQUMzQyxJQUFJLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsS0FBSyxTQUFTLENBQUMsRUFBRTtRQUM3QyxTQUFTLEdBQUcsYUFBYSxDQUFDLENBQUMsQ0FBQyxDQUFDO0tBQzlCO0lBRUQsSUFBSSxJQUFJLEtBQUssTUFBTSxFQUFFO1FBQ25CLElBQUksR0FBRyxDQUFDLE1BQU0sS0FBSyxNQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLENBQUMsQ0FBQyxFQUFFLENBQUM7UUFDekMsTUFBTSxHQUFHLE1BQU0sQ0FBQztLQUNqQjtJQUVELE9BQU8sQ0FBQyxTQUFTLEVBQUUsaUJBQWlCLENBQUMsSUFBSSxDQUFDLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDO0FBQ3hELENBQUM7QUFFRDs7O0dBR0c7QUFDSCxNQUFNLFVBQVUsZ0JBQWdCLENBQUMsS0FBYTtJQUM1QyxJQUFJLENBQUMsSUFBSSxFQUFHLEdBQUcsYUFBYSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3BDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUNsQyxDQUFDO0FBRUQ7O0dBRUc7QUFDSCxNQUFNLFVBQVUsaUJBQWlCLENBQUMsS0FBYTtJQUM3QyxJQUFJLENBQUMsQ0FBQyxLQUFLLEVBQUU7UUFDWCxRQUFRLEtBQUssQ0FBQyxXQUFXLEVBQUUsRUFBRTtZQUMzQixLQUFLLFNBQVMsQ0FBQztZQUNmLEtBQUssY0FBYyxDQUFDO1lBQ3BCLEtBQUssY0FBYztnQkFDakIsS0FBSyxHQUFHLGNBQWMsQ0FBQztnQkFDdkIsTUFBTTtZQUVSLEtBQUssSUFBSSxDQUFDO1lBQ1YsS0FBSyxNQUFNLENBQUM7WUFDWixLQUFLLFFBQVE7Z0JBQ1gsS0FBSyxHQUFHLFFBQVEsQ0FBQztnQkFDakIsTUFBTTtZQUVSLHNDQUFzQztZQUN0QztnQkFDRSxLQUFLLEdBQUcsTUFBTSxDQUFDO2dCQUNmLE1BQU07U0FDVDtLQUNGO0lBQ0QsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDO0FBRUQ7Ozs7Ozs7O0dBUUc7QUFDSCxTQUFTLFFBQVEsQ0FBQyxTQUFpQixFQUFFLE9BQXNCLElBQUksRUFBRSxNQUFNLEdBQUcsS0FBSztJQUM3RSxPQUFPO1FBQ0wsT0FBTyxFQUFFLE1BQU0sQ0FBQyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxNQUFNO1FBQ3hDLFlBQVksRUFBRSxZQUFZO1FBQzFCLGdCQUFnQixFQUFFLFNBQVM7UUFDM0IsV0FBVyxFQUFFLElBQUksSUFBSSxJQUFJO0tBQzFCLENBQUM7QUFDSixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5leHBvcnQgY29uc3QgSU5MSU5FID0gJ2lubGluZSc7XG5leHBvcnQgY29uc3QgTEFZT1VUX1ZBTFVFUyA9IFsncm93JywgJ2NvbHVtbicsICdyb3ctcmV2ZXJzZScsICdjb2x1bW4tcmV2ZXJzZSddO1xuXG4vKipcbiAqIFZhbGlkYXRlIHRoZSBkaXJlY3Rpb258J2RpcmVjdGlvbiB3cmFwJyB2YWx1ZSBhbmQgdGhlbiB1cGRhdGUgdGhlIGhvc3QncyBpbmxpbmUgZmxleGJveCBzdHlsZXNcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkTGF5b3V0Q1NTKHZhbHVlOiBzdHJpbmcpIHtcbiAgbGV0IFtkaXJlY3Rpb24sIHdyYXAsIGlzSW5saW5lXSA9IHZhbGlkYXRlVmFsdWUodmFsdWUpO1xuICByZXR1cm4gYnVpbGRDU1MoZGlyZWN0aW9uLCB3cmFwLCBpc0lubGluZSk7XG59XG5cbi8qKlxuICAqIFZhbGlkYXRlIHRoZSB2YWx1ZSB0byBiZSBvbmUgb2YgdGhlIGFjY2VwdGFibGUgdmFsdWUgb3B0aW9uc1xuICAqIFVzZSBkZWZhdWx0IGZhbGxiYWNrIG9mICdyb3cnXG4gICovXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVWYWx1ZSh2YWx1ZTogc3RyaW5nKTogW3N0cmluZywgc3RyaW5nLCBib29sZWFuXSB7XG4gIHZhbHVlID0gdmFsdWU/LnRvTG93ZXJDYXNlKCkgPz8gJyc7XG4gIGxldCBbZGlyZWN0aW9uLCB3cmFwLCBpbmxpbmVdID0gdmFsdWUuc3BsaXQoJyAnKTtcblxuICAvLyBGaXJzdCB2YWx1ZSBtdXN0IGJlIHRoZSBgZmxleC1kaXJlY3Rpb25gXG4gIGlmICghTEFZT1VUX1ZBTFVFUy5maW5kKHggPT4geCA9PT0gZGlyZWN0aW9uKSkge1xuICAgIGRpcmVjdGlvbiA9IExBWU9VVF9WQUxVRVNbMF07XG4gIH1cblxuICBpZiAod3JhcCA9PT0gSU5MSU5FKSB7XG4gICAgd3JhcCA9IChpbmxpbmUgIT09IElOTElORSkgPyBpbmxpbmUgOiAnJztcbiAgICBpbmxpbmUgPSBJTkxJTkU7XG4gIH1cblxuICByZXR1cm4gW2RpcmVjdGlvbiwgdmFsaWRhdGVXcmFwVmFsdWUod3JhcCksICEhaW5saW5lXTtcbn1cblxuLyoqXG4gKiBEZXRlcm1pbmUgaWYgdGhlIHZhbGlkYXRlZCwgZmxleC1kaXJlY3Rpb24gdmFsdWUgc3BlY2lmaWVzXG4gKiBhIGhvcml6b250YWwvcm93IGZsb3cuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBpc0Zsb3dIb3Jpem9udGFsKHZhbHVlOiBzdHJpbmcpOiBib29sZWFuIHtcbiAgbGV0IFtmbG93LCBdID0gdmFsaWRhdGVWYWx1ZSh2YWx1ZSk7XG4gIHJldHVybiBmbG93LmluZGV4T2YoJ3JvdycpID4gLTE7XG59XG5cbi8qKlxuICogQ29udmVydCBsYXlvdXQtd3JhcD0nPHZhbHVlPicgdG8gZXhwZWN0ZWQgZmxleC13cmFwIHN0eWxlXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiB2YWxpZGF0ZVdyYXBWYWx1ZSh2YWx1ZTogc3RyaW5nKSB7XG4gIGlmICghIXZhbHVlKSB7XG4gICAgc3dpdGNoICh2YWx1ZS50b0xvd2VyQ2FzZSgpKSB7XG4gICAgICBjYXNlICdyZXZlcnNlJzpcbiAgICAgIGNhc2UgJ3dyYXAtcmV2ZXJzZSc6XG4gICAgICBjYXNlICdyZXZlcnNlLXdyYXAnOlxuICAgICAgICB2YWx1ZSA9ICd3cmFwLXJldmVyc2UnO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnbm8nOlxuICAgICAgY2FzZSAnbm9uZSc6XG4gICAgICBjYXNlICdub3dyYXAnOlxuICAgICAgICB2YWx1ZSA9ICdub3dyYXAnO1xuICAgICAgICBicmVhaztcblxuICAgICAgLy8gQWxsIG90aGVyIHZhbHVlcyBmYWxsYmFjayB0byAnd3JhcCdcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIHZhbHVlID0gJ3dyYXAnO1xuICAgICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHZhbHVlO1xufVxuXG4vKipcbiAqIEJ1aWxkIHRoZSBDU1MgdGhhdCBzaG91bGQgYmUgYXNzaWduZWQgdG8gdGhlIGVsZW1lbnQgaW5zdGFuY2VcbiAqIEJVRzpcbiAqICAgMSkgbWluLWhlaWdodCBvbiBhIGNvbHVtbiBmbGV4IGNvbnRhaW5lciB3b27igJl0IGFwcGx5IHRvIGl0cyBmbGV4IGl0ZW0gY2hpbGRyZW4gaW4gSUUgMTAtMTEuXG4gKiAgICAgIFVzZSBoZWlnaHQgaW5zdGVhZCBpZiBwb3NzaWJsZTsgaGVpZ2h0IDogPHh4eD52aDtcbiAqXG4gKiAgVGhpcyB3YXkgYW55IHBhZGRpbmcgb3IgYm9yZGVyIHNwZWNpZmllZCBvbiB0aGUgY2hpbGQgZWxlbWVudHMgYXJlXG4gKiAgbGFpZCBvdXQgYW5kIGRyYXduIGluc2lkZSB0aGF0IGVsZW1lbnQncyBzcGVjaWZpZWQgd2lkdGggYW5kIGhlaWdodC5cbiAqL1xuZnVuY3Rpb24gYnVpbGRDU1MoZGlyZWN0aW9uOiBzdHJpbmcsIHdyYXA6IHN0cmluZyB8IG51bGwgPSBudWxsLCBpbmxpbmUgPSBmYWxzZSkge1xuICByZXR1cm4ge1xuICAgIGRpc3BsYXk6IGlubGluZSA/ICdpbmxpbmUtZmxleCcgOiAnZmxleCcsXG4gICAgJ2JveC1zaXppbmcnOiAnYm9yZGVyLWJveCcsXG4gICAgJ2ZsZXgtZGlyZWN0aW9uJzogZGlyZWN0aW9uLFxuICAgICdmbGV4LXdyYXAnOiB3cmFwIHx8IG51bGwsXG4gIH07XG59XG4iXX0=