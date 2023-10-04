/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
* The flex API permits 3 or 1 parts of the value:
*    - `flex-grow flex-shrink flex-basis`, or
*    - `flex-basis`
*/
export function validateBasis(basis, grow = '1', shrink = '1') {
    let parts = [grow, shrink, basis];
    let j = basis.indexOf('calc');
    if (j > 0) {
        parts[2] = _validateCalcValue(basis.substring(j).trim());
        let matches = basis.substr(0, j).trim().split(' ');
        if (matches.length == 2) {
            parts[0] = matches[0];
            parts[1] = matches[1];
        }
    }
    else if (j == 0) {
        parts[2] = _validateCalcValue(basis.trim());
    }
    else {
        let matches = basis.split(' ');
        parts = (matches.length === 3) ? matches : [
            grow, shrink, basis
        ];
    }
    return parts;
}
/**
 * Calc expressions require whitespace before & after any expression operators
 * This is a simple, crude whitespace padding solution.
 *   - '3 3 calc(15em + 20px)'
 *   - calc(100% / 7 * 2)
 *   - 'calc(15em + 20px)'
 *   - 'calc(15em+20px)'
 *   - '37px'
 *   = '43%'
 */
function _validateCalcValue(calc) {
    return calc.replace(/[\s]/g, '').replace(/[\/\*\+\-]/g, ' $& ');
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzaXMtdmFsaWRhdG9yLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbGlicy9mbGV4LWxheW91dC9jb3JlL2Jhc2lzLXZhbGlkYXRvci9iYXNpcy12YWxpZGF0b3IudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUY7Ozs7RUFJRTtBQUNILE1BQU0sVUFBVSxhQUFhLENBQUMsS0FBYSxFQUFFLElBQUksR0FBRyxHQUFHLEVBQUUsTUFBTSxHQUFHLEdBQUc7SUFDbkUsSUFBSSxLQUFLLEdBQUcsQ0FBQyxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUssQ0FBQyxDQUFDO0lBRWxDLElBQUksQ0FBQyxHQUFHLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLENBQUM7SUFDOUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFO1FBQ1QsS0FBSyxDQUFDLENBQUMsQ0FBQyxHQUFHLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztRQUN6RCxJQUFJLE9BQU8sR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDbkQsSUFBSSxPQUFPLENBQUMsTUFBTSxJQUFJLENBQUMsRUFBRTtZQUN2QixLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsT0FBTyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3RCLEtBQUssQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQyxDQUFDLENBQUM7U0FDdkI7S0FDRjtTQUFNLElBQUksQ0FBQyxJQUFJLENBQUMsRUFBRTtRQUNqQixLQUFLLENBQUMsQ0FBQyxDQUFDLEdBQUcsa0JBQWtCLENBQUMsS0FBSyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7S0FDN0M7U0FBTTtRQUNMLElBQUksT0FBTyxHQUFHLEtBQUssQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7UUFDL0IsS0FBSyxHQUFHLENBQUMsT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUNyQyxJQUFJLEVBQUUsTUFBTSxFQUFFLEtBQUs7U0FDcEIsQ0FBQztLQUNQO0lBRUQsT0FBTyxLQUFLLENBQUM7QUFDZixDQUFDO0FBR0Q7Ozs7Ozs7OztHQVNHO0FBQ0gsU0FBUyxrQkFBa0IsQ0FBQyxJQUFZO0lBQ3RDLE9BQU8sSUFBSSxDQUFDLE9BQU8sQ0FBQyxPQUFPLEVBQUUsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLGFBQWEsRUFBRSxNQUFNLENBQUMsQ0FBQztBQUNsRSxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbiAvKipcbiAqIFRoZSBmbGV4IEFQSSBwZXJtaXRzIDMgb3IgMSBwYXJ0cyBvZiB0aGUgdmFsdWU6XG4gKiAgICAtIGBmbGV4LWdyb3cgZmxleC1zaHJpbmsgZmxleC1iYXNpc2AsIG9yXG4gKiAgICAtIGBmbGV4LWJhc2lzYFxuICovXG5leHBvcnQgZnVuY3Rpb24gdmFsaWRhdGVCYXNpcyhiYXNpczogc3RyaW5nLCBncm93ID0gJzEnLCBzaHJpbmsgPSAnMScpOiBzdHJpbmdbXSB7XG4gIGxldCBwYXJ0cyA9IFtncm93LCBzaHJpbmssIGJhc2lzXTtcblxuICBsZXQgaiA9IGJhc2lzLmluZGV4T2YoJ2NhbGMnKTtcbiAgaWYgKGogPiAwKSB7XG4gICAgcGFydHNbMl0gPSBfdmFsaWRhdGVDYWxjVmFsdWUoYmFzaXMuc3Vic3RyaW5nKGopLnRyaW0oKSk7XG4gICAgbGV0IG1hdGNoZXMgPSBiYXNpcy5zdWJzdHIoMCwgaikudHJpbSgpLnNwbGl0KCcgJyk7XG4gICAgaWYgKG1hdGNoZXMubGVuZ3RoID09IDIpIHtcbiAgICAgIHBhcnRzWzBdID0gbWF0Y2hlc1swXTtcbiAgICAgIHBhcnRzWzFdID0gbWF0Y2hlc1sxXTtcbiAgICB9XG4gIH0gZWxzZSBpZiAoaiA9PSAwKSB7XG4gICAgcGFydHNbMl0gPSBfdmFsaWRhdGVDYWxjVmFsdWUoYmFzaXMudHJpbSgpKTtcbiAgfSBlbHNlIHtcbiAgICBsZXQgbWF0Y2hlcyA9IGJhc2lzLnNwbGl0KCcgJyk7XG4gICAgcGFydHMgPSAobWF0Y2hlcy5sZW5ndGggPT09IDMpID8gbWF0Y2hlcyA6IFtcbiAgICAgICAgICBncm93LCBzaHJpbmssIGJhc2lzXG4gICAgICAgIF07XG4gIH1cblxuICByZXR1cm4gcGFydHM7XG59XG5cblxuLyoqXG4gKiBDYWxjIGV4cHJlc3Npb25zIHJlcXVpcmUgd2hpdGVzcGFjZSBiZWZvcmUgJiBhZnRlciBhbnkgZXhwcmVzc2lvbiBvcGVyYXRvcnNcbiAqIFRoaXMgaXMgYSBzaW1wbGUsIGNydWRlIHdoaXRlc3BhY2UgcGFkZGluZyBzb2x1dGlvbi5cbiAqICAgLSAnMyAzIGNhbGMoMTVlbSArIDIwcHgpJ1xuICogICAtIGNhbGMoMTAwJSAvIDcgKiAyKVxuICogICAtICdjYWxjKDE1ZW0gKyAyMHB4KSdcbiAqICAgLSAnY2FsYygxNWVtKzIwcHgpJ1xuICogICAtICczN3B4J1xuICogICA9ICc0MyUnXG4gKi9cbmZ1bmN0aW9uIF92YWxpZGF0ZUNhbGNWYWx1ZShjYWxjOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gY2FsYy5yZXBsYWNlKC9bXFxzXS9nLCAnJykucmVwbGFjZSgvW1xcL1xcKlxcK1xcLV0vZywgJyAkJiAnKTtcbn1cbiJdfQ==