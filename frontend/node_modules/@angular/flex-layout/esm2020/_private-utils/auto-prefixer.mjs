/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Applies CSS prefixes to appropriate style keys.
 *
 * Note: `-ms-`, `-moz` and `-webkit-box` are no longer supported. e.g.
 *    {
 *      display: -webkit-flex;     NEW - Safari 6.1+. iOS 7.1+, BB10
 *      display: flex;             NEW, Spec - Firefox, Chrome, Opera
 *      // display: -webkit-box;   OLD - iOS 6-, Safari 3.1-6, BB7
 *      // display: -ms-flexbox;   TWEENER - IE 10
 *      // display: -moz-flexbox;  OLD - Firefox
 *    }
 */
export function applyCssPrefixes(target) {
    for (let key in target) {
        let value = target[key] ?? '';
        switch (key) {
            case 'display':
                if (value === 'flex') {
                    target['display'] = [
                        '-webkit-flex',
                        'flex'
                    ];
                }
                else if (value === 'inline-flex') {
                    target['display'] = [
                        '-webkit-inline-flex',
                        'inline-flex'
                    ];
                }
                else {
                    target['display'] = value;
                }
                break;
            case 'align-items':
            case 'align-self':
            case 'align-content':
            case 'flex':
            case 'flex-basis':
            case 'flex-flow':
            case 'flex-grow':
            case 'flex-shrink':
            case 'flex-wrap':
            case 'justify-content':
                target['-webkit-' + key] = value;
                break;
            case 'flex-direction':
                target['-webkit-flex-direction'] = value;
                target['flex-direction'] = value;
                break;
            case 'order':
                target['order'] = target['-webkit-' + key] = isNaN(+value) ? '0' : value;
                break;
        }
    }
    return target;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYXV0by1wcmVmaXhlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2xpYnMvZmxleC1sYXlvdXQvX3ByaXZhdGUtdXRpbHMvYXV0by1wcmVmaXhlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFDSDs7Ozs7Ozs7Ozs7R0FXRztBQUNILE1BQU0sVUFBVSxnQkFBZ0IsQ0FBQyxNQUFtQztJQUNsRSxLQUFLLElBQUksR0FBRyxJQUFJLE1BQU0sRUFBRTtRQUN0QixJQUFJLEtBQUssR0FBRyxNQUFNLENBQUMsR0FBRyxDQUFDLElBQUksRUFBRSxDQUFDO1FBRTlCLFFBQVEsR0FBRyxFQUFFO1lBQ1gsS0FBSyxTQUFTO2dCQUNaLElBQUksS0FBSyxLQUFLLE1BQU0sRUFBRTtvQkFDcEIsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHO3dCQUNsQixjQUFjO3dCQUNkLE1BQU07cUJBQ1AsQ0FBQztpQkFDSDtxQkFBTSxJQUFJLEtBQUssS0FBSyxhQUFhLEVBQUU7b0JBQ2xDLE1BQU0sQ0FBQyxTQUFTLENBQUMsR0FBRzt3QkFDbEIscUJBQXFCO3dCQUNyQixhQUFhO3FCQUNkLENBQUM7aUJBQ0g7cUJBQU07b0JBQ0wsTUFBTSxDQUFDLFNBQVMsQ0FBQyxHQUFHLEtBQUssQ0FBQztpQkFDM0I7Z0JBQ0QsTUFBTTtZQUVSLEtBQUssYUFBYSxDQUFDO1lBQ25CLEtBQUssWUFBWSxDQUFDO1lBQ2xCLEtBQUssZUFBZSxDQUFDO1lBQ3JCLEtBQUssTUFBTSxDQUFDO1lBQ1osS0FBSyxZQUFZLENBQUM7WUFDbEIsS0FBSyxXQUFXLENBQUM7WUFDakIsS0FBSyxXQUFXLENBQUM7WUFDakIsS0FBSyxhQUFhLENBQUM7WUFDbkIsS0FBSyxXQUFXLENBQUM7WUFDakIsS0FBSyxpQkFBaUI7Z0JBQ3BCLE1BQU0sQ0FBQyxVQUFVLEdBQUcsR0FBRyxDQUFDLEdBQUcsS0FBSyxDQUFDO2dCQUNqQyxNQUFNO1lBRVIsS0FBSyxnQkFBZ0I7Z0JBQ25CLE1BQU0sQ0FBQyx3QkFBd0IsQ0FBQyxHQUFHLEtBQUssQ0FBQztnQkFDekMsTUFBTSxDQUFDLGdCQUFnQixDQUFDLEdBQUcsS0FBSyxDQUFDO2dCQUNqQyxNQUFNO1lBRVIsS0FBSyxPQUFPO2dCQUNWLE1BQU0sQ0FBQyxPQUFPLENBQUMsR0FBRyxNQUFNLENBQUMsVUFBVSxHQUFHLEdBQUcsQ0FBQyxHQUFHLEtBQUssQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQztnQkFDekUsTUFBTTtTQUNUO0tBQ0Y7SUFDRCxPQUFPLE1BQU0sQ0FBQztBQUNoQixDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG4vKipcbiAqIEFwcGxpZXMgQ1NTIHByZWZpeGVzIHRvIGFwcHJvcHJpYXRlIHN0eWxlIGtleXMuXG4gKlxuICogTm90ZTogYC1tcy1gLCBgLW1vemAgYW5kIGAtd2Via2l0LWJveGAgYXJlIG5vIGxvbmdlciBzdXBwb3J0ZWQuIGUuZy5cbiAqICAgIHtcbiAqICAgICAgZGlzcGxheTogLXdlYmtpdC1mbGV4OyAgICAgTkVXIC0gU2FmYXJpIDYuMSsuIGlPUyA3LjErLCBCQjEwXG4gKiAgICAgIGRpc3BsYXk6IGZsZXg7ICAgICAgICAgICAgIE5FVywgU3BlYyAtIEZpcmVmb3gsIENocm9tZSwgT3BlcmFcbiAqICAgICAgLy8gZGlzcGxheTogLXdlYmtpdC1ib3g7ICAgT0xEIC0gaU9TIDYtLCBTYWZhcmkgMy4xLTYsIEJCN1xuICogICAgICAvLyBkaXNwbGF5OiAtbXMtZmxleGJveDsgICBUV0VFTkVSIC0gSUUgMTBcbiAqICAgICAgLy8gZGlzcGxheTogLW1vei1mbGV4Ym94OyAgT0xEIC0gRmlyZWZveFxuICogICAgfVxuICovXG5leHBvcnQgZnVuY3Rpb24gYXBwbHlDc3NQcmVmaXhlcyh0YXJnZXQ6IHtba2V5OiBzdHJpbmddOiBhbnkgfCBudWxsfSkge1xuICBmb3IgKGxldCBrZXkgaW4gdGFyZ2V0KSB7XG4gICAgbGV0IHZhbHVlID0gdGFyZ2V0W2tleV0gPz8gJyc7XG5cbiAgICBzd2l0Y2ggKGtleSkge1xuICAgICAgY2FzZSAnZGlzcGxheSc6XG4gICAgICAgIGlmICh2YWx1ZSA9PT0gJ2ZsZXgnKSB7XG4gICAgICAgICAgdGFyZ2V0WydkaXNwbGF5J10gPSBbXG4gICAgICAgICAgICAnLXdlYmtpdC1mbGV4JyxcbiAgICAgICAgICAgICdmbGV4J1xuICAgICAgICAgIF07XG4gICAgICAgIH0gZWxzZSBpZiAodmFsdWUgPT09ICdpbmxpbmUtZmxleCcpIHtcbiAgICAgICAgICB0YXJnZXRbJ2Rpc3BsYXknXSA9IFtcbiAgICAgICAgICAgICctd2Via2l0LWlubGluZS1mbGV4JyxcbiAgICAgICAgICAgICdpbmxpbmUtZmxleCdcbiAgICAgICAgICBdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHRhcmdldFsnZGlzcGxheSddID0gdmFsdWU7XG4gICAgICAgIH1cbiAgICAgICAgYnJlYWs7XG5cbiAgICAgIGNhc2UgJ2FsaWduLWl0ZW1zJzpcbiAgICAgIGNhc2UgJ2FsaWduLXNlbGYnOlxuICAgICAgY2FzZSAnYWxpZ24tY29udGVudCc6XG4gICAgICBjYXNlICdmbGV4JzpcbiAgICAgIGNhc2UgJ2ZsZXgtYmFzaXMnOlxuICAgICAgY2FzZSAnZmxleC1mbG93JzpcbiAgICAgIGNhc2UgJ2ZsZXgtZ3Jvdyc6XG4gICAgICBjYXNlICdmbGV4LXNocmluayc6XG4gICAgICBjYXNlICdmbGV4LXdyYXAnOlxuICAgICAgY2FzZSAnanVzdGlmeS1jb250ZW50JzpcbiAgICAgICAgdGFyZ2V0Wyctd2Via2l0LScgKyBrZXldID0gdmFsdWU7XG4gICAgICAgIGJyZWFrO1xuXG4gICAgICBjYXNlICdmbGV4LWRpcmVjdGlvbic6XG4gICAgICAgIHRhcmdldFsnLXdlYmtpdC1mbGV4LWRpcmVjdGlvbiddID0gdmFsdWU7XG4gICAgICAgIHRhcmdldFsnZmxleC1kaXJlY3Rpb24nXSA9IHZhbHVlO1xuICAgICAgICBicmVhaztcblxuICAgICAgY2FzZSAnb3JkZXInOlxuICAgICAgICB0YXJnZXRbJ29yZGVyJ10gPSB0YXJnZXRbJy13ZWJraXQtJyArIGtleV0gPSBpc05hTigrdmFsdWUpID8gJzAnIDogdmFsdWU7XG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdGFyZ2V0O1xufVxuIl19