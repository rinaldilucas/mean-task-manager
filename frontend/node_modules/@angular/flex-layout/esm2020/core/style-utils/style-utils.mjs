/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';
import { applyCssPrefixes } from '@angular/flex-layout/_private-utils';
import { SERVER_TOKEN } from '../tokens/server-token';
import { LAYOUT_CONFIG } from '../tokens/library-config';
import * as i0 from "@angular/core";
import * as i1 from "../stylesheet-map/stylesheet-map";
export class StyleUtils {
    constructor(_serverStylesheet, _serverModuleLoaded, _platformId, layoutConfig) {
        this._serverStylesheet = _serverStylesheet;
        this._serverModuleLoaded = _serverModuleLoaded;
        this._platformId = _platformId;
        this.layoutConfig = layoutConfig;
    }
    /**
     * Applies styles given via string pair or object map to the directive element
     */
    applyStyleToElement(element, style, value = null) {
        let styles = {};
        if (typeof style === 'string') {
            styles[style] = value;
            style = styles;
        }
        styles = this.layoutConfig.disableVendorPrefixes ? style : applyCssPrefixes(style);
        this._applyMultiValueStyleToElement(styles, element);
    }
    /**
     * Applies styles given via string pair or object map to the directive's element
     */
    applyStyleToElements(style, elements = []) {
        const styles = this.layoutConfig.disableVendorPrefixes ? style : applyCssPrefixes(style);
        elements.forEach(el => {
            this._applyMultiValueStyleToElement(styles, el);
        });
    }
    /**
     * Determine the DOM element's Flexbox flow (flex-direction)
     *
     * Check inline style first then check computed (stylesheet) style
     */
    getFlowDirection(target) {
        const query = 'flex-direction';
        let value = this.lookupStyle(target, query);
        const hasInlineValue = this.lookupInlineStyle(target, query) ||
            (isPlatformServer(this._platformId) && this._serverModuleLoaded) ? value : '';
        return [value || 'row', hasInlineValue];
    }
    hasWrap(target) {
        const query = 'flex-wrap';
        return this.lookupStyle(target, query) === 'wrap';
    }
    /**
     * Find the DOM element's raw attribute value (if any)
     */
    lookupAttributeValue(element, attribute) {
        return element.getAttribute(attribute) ?? '';
    }
    /**
     * Find the DOM element's inline style value (if any)
     */
    lookupInlineStyle(element, styleName) {
        return isPlatformBrowser(this._platformId) ?
            element.style.getPropertyValue(styleName) : getServerStyle(element, styleName);
    }
    /**
     * Determine the inline or inherited CSS style
     * NOTE: platform-server has no implementation for getComputedStyle
     */
    lookupStyle(element, styleName, inlineOnly = false) {
        let value = '';
        if (element) {
            let immediateValue = value = this.lookupInlineStyle(element, styleName);
            if (!immediateValue) {
                if (isPlatformBrowser(this._platformId)) {
                    if (!inlineOnly) {
                        value = getComputedStyle(element).getPropertyValue(styleName);
                    }
                }
                else {
                    if (this._serverModuleLoaded) {
                        value = this._serverStylesheet.getStyleForElement(element, styleName);
                    }
                }
            }
        }
        // Note: 'inline' is the default of all elements, unless UA stylesheet overrides;
        //       in which case getComputedStyle() should determine a valid value.
        return value ? value.trim() : '';
    }
    /**
     * Applies the styles to the element. The styles object map may contain an array of values
     * Each value will be added as element style
     * Keys are sorted to add prefixed styles (like -webkit-x) first, before the standard ones
     */
    _applyMultiValueStyleToElement(styles, element) {
        Object.keys(styles).sort().forEach(key => {
            const el = styles[key];
            const values = Array.isArray(el) ? el : [el];
            values.sort();
            for (let value of values) {
                value = value ? value + '' : '';
                if (isPlatformBrowser(this._platformId) || !this._serverModuleLoaded) {
                    isPlatformBrowser(this._platformId) ?
                        element.style.setProperty(key, value) : setServerStyle(element, key, value);
                }
                else {
                    this._serverStylesheet.addStyleToElement(element, key, value);
                }
            }
        });
    }
}
StyleUtils.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: StyleUtils, deps: [{ token: i1.StylesheetMap }, { token: SERVER_TOKEN }, { token: PLATFORM_ID }, { token: LAYOUT_CONFIG }], target: i0.ɵɵFactoryTarget.Injectable });
StyleUtils.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: StyleUtils, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: StyleUtils, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i1.StylesheetMap }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [SERVER_TOKEN]
                }] }, { type: Object, decorators: [{
                    type: Inject,
                    args: [PLATFORM_ID]
                }] }, { type: undefined, decorators: [{
                    type: Inject,
                    args: [LAYOUT_CONFIG]
                }] }]; } });
function getServerStyle(element, styleName) {
    const styleMap = readStyleAttribute(element);
    return styleMap[styleName] ?? '';
}
function setServerStyle(element, styleName, styleValue) {
    styleName = styleName.replace(/([a-z])([A-Z])/g, '$1-$2').toLowerCase();
    const styleMap = readStyleAttribute(element);
    styleMap[styleName] = styleValue ?? '';
    writeStyleAttribute(element, styleMap);
}
function writeStyleAttribute(element, styleMap) {
    let styleAttrValue = '';
    for (const key in styleMap) {
        const newValue = styleMap[key];
        if (newValue) {
            styleAttrValue += `${key}:${styleMap[key]};`;
        }
    }
    element.setAttribute('style', styleAttrValue);
}
function readStyleAttribute(element) {
    const styleMap = {};
    const styleAttribute = element.getAttribute('style');
    if (styleAttribute) {
        const styleList = styleAttribute.split(/;+/g);
        for (let i = 0; i < styleList.length; i++) {
            const style = styleList[i].trim();
            if (style.length > 0) {
                const colonIndex = style.indexOf(':');
                if (colonIndex === -1) {
                    throw new Error(`Invalid CSS style: ${style}`);
                }
                const name = style.substr(0, colonIndex).trim();
                styleMap[name] = style.substr(colonIndex + 1).trim();
            }
        }
    }
    return styleMap;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoic3R5bGUtdXRpbHMuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9saWJzL2ZsZXgtbGF5b3V0L2NvcmUvc3R5bGUtdXRpbHMvc3R5bGUtdXRpbHMudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFDLE1BQU0sRUFBRSxVQUFVLEVBQUUsV0FBVyxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQzlELE9BQU8sRUFBQyxpQkFBaUIsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLGlCQUFpQixDQUFDO0FBRXBFLE9BQU8sRUFBQyxnQkFBZ0IsRUFBQyxNQUFNLHFDQUFxQyxDQUFDO0FBRXJFLE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSx3QkFBd0IsQ0FBQztBQUNwRCxPQUFPLEVBQUMsYUFBYSxFQUFzQixNQUFNLDBCQUEwQixDQUFDOzs7QUFHNUUsTUFBTSxPQUFPLFVBQVU7SUFFckIsWUFBb0IsaUJBQWdDLEVBQ1YsbUJBQTRCLEVBQzdCLFdBQW1CLEVBQ2pCLFlBQWlDO1FBSHhELHNCQUFpQixHQUFqQixpQkFBaUIsQ0FBZTtRQUNWLHdCQUFtQixHQUFuQixtQkFBbUIsQ0FBUztRQUM3QixnQkFBVyxHQUFYLFdBQVcsQ0FBUTtRQUNqQixpQkFBWSxHQUFaLFlBQVksQ0FBcUI7SUFBRyxDQUFDO0lBRWhGOztPQUVHO0lBQ0gsbUJBQW1CLENBQUMsT0FBb0IsRUFDcEIsS0FBK0IsRUFDL0IsUUFBZ0MsSUFBSTtRQUN0RCxJQUFJLE1BQU0sR0FBb0IsRUFBRSxDQUFDO1FBQ2pDLElBQUksT0FBTyxLQUFLLEtBQUssUUFBUSxFQUFFO1lBQzdCLE1BQU0sQ0FBQyxLQUFLLENBQUMsR0FBRyxLQUFLLENBQUM7WUFDdEIsS0FBSyxHQUFHLE1BQU0sQ0FBQztTQUNoQjtRQUNELE1BQU0sR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLHFCQUFxQixDQUFDLENBQUMsQ0FBQyxLQUFL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QyxNQUFNLFFBQVEsR0FBNkIsRUFBRSxDQUFDO0lBQzlDLE1BQU0sY0FBYyxHQUFHLE9BQU8sQ0FBQyxZQUFZLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDckQsSUFBSSxjQUFjLEVBQUU7UUFDbEIsTUFBTSxTQUFTLEdBQUcsY0FBYyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUM5QyxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLEVBQUUsRUFBRTtZQUN6QyxNQUFNLEtBQUssR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7WUFDbEMsSUFBSSxLQUFLLENBQUMsTUFBTSxHQUFHLENBQUMsRUFBRTtnQkFDcEIsTUFBTSxVQUFVLEdBQUcsS0FBSyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQztnQkFDdEMsSUFBSSxVQUFVLEtBQUssQ0FBQyxDQUFDLEVBQUU7b0JBQ3JCLE1BQU0sSUFBSSxLQUFLLENBQUMsc0JBQXNCLEtBQUssRUFBRSxDQUFDLENBQUM7aUJBQ2hEO2dCQUNELE1BQU0sSUFBSSxHQUFHLEtBQUssQ0FBQyxNQUFNLENBQUMsQ0FBQyxFQUFFLFVBQVUsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO2dCQUNoRCxRQUFRLENBQUMsSUFBSSxDQUFDLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFVLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUM7YUFDdEQ7U0FDRjtLQUNGO0lBQ0QsT0FBTyxRQUFRLENBQUM7QUFDbEIsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtJbmplY3QsIEluamVjdGFibGUsIFBMQVRGT1JNX0lEfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7aXNQbGF0Zm9ybUJyb3dzZXIsIGlzUGxhdGZvcm1TZXJ2ZXJ9IGZyb20gJ0Bhbmd1bGFyL2NvbW1vbic7XG5cbmltcG9ydCB7YXBwbHlDc3NQcmVmaXhlc30gZnJvbSAnQGFuZ3VsYXIvZmxleC1sYXlvdXQvX3ByaXZhdGUtdXRpbHMnO1xuaW1wb3J0IHtTdHlsZXNoZWV0TWFwfSBmcm9tICcuLi9zdHlsZXNoZWV0LW1hcC9zdHlsZXNoZWV0LW1hcCc7XG5pbXBvcnQge1NFUlZFUl9UT0tFTn0gZnJvbSAnLi4vdG9rZW5zL3NlcnZlci10b2tlbic7XG5pbXBvcnQge0xBWU9VVF9DT05GSUcsIExheW91dENvbmZpZ09wdGlvbnN9IGZyb20gJy4uL3Rva2Vucy9saWJyYXJ5LWNvbmZpZyc7XG5cbkBJbmplY3RhYmxlKHtwcm92aWRlZEluOiAncm9vdCd9KVxuZXhwb3J0IGNsYXNzIFN0eWxlVXRpbHMge1xuXG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgX3NlcnZlclN0eWxlc2hlZXQ6IFN0eWxlc2hlZXRNYXAsXG4gICAgICAgICAgICAgIEBJbmplY3QoU0VSVkVSX1RPS0VOKSBwcml2YXRlIF9zZXJ2ZXJNb2R1bGVMb2FkZWQ6IGJvb2xlYW4sXG4gICAgICAgICAgICAgIEBJbmplY3QoUExBVEZPUk1fSUQpIHByaXZhdGUgX3BsYXRmb3JtSWQ6IE9iamVjdCxcbiAgICAgICAgICAgICAgQEluamVjdChMQVlPVVRfQ09ORklHKSBwcml2YXRlIGxheW91dENvbmZpZzogTGF5b3V0Q29uZmlnT3B0aW9ucykge31cblxuICAvKipcbiAgICogQXBwbGllcyBzdHlsZXMgZ2l2ZW4gdmlhIHN0cmluZyBwYWlyIG9yIG9iamVjdCBtYXAgdG8gdGhlIGRpcmVjdGl2ZSBlbGVtZW50XG4gICAqL1xuICBhcHBseVN0eWxlVG9FbGVtZW50KGVsZW1lbnQ6IEhUTUxFbGVtZW50LFxuICAgICAgICAgICAgICAgICAgICAgIHN0eWxlOiBTdHlsZURlZmluaXRpb24gfCBzdHJpbmcsXG4gICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHN0cmluZyB8IG51bWJlciB8IG51bGwgPSBudWxsKSB7XG4gICAgbGV0IHN0eWxlczogU3R5bGVEZWZpbml0aW9uID0ge307XG4gICAgaWYgKHR5cGVvZiBzdHlsZSA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHN0eWxlc1tzdHlsZV0gPSB2YWx1ZTtcbiAgICAgIHN0eWxlID0gc3R5bGVzO1xuICAgIH1cbiAgICBzdHlsZXMgPSB0aGlzLmxheW91dENvbmZpZy5kaXNhYmxlVmVuZG9yUHJlZml4ZXMgPyBzdHlsZSA6IGFwcGx5Q3NzUHJlZml4ZXMoc3R5bGUpO1xuICAgIHRoaXMuX2FwcGx5TXVsdGlWYWx1ZVN0eWxlVG9FbGVtZW50KHN0eWxlcywgZWxlbWVudCk7XG4gIH1cblxuICAvKipcbiAgICogQXBwbGllcyBzdHlsZXMgZ2l2ZW4gdmlhIHN0cmluZyBwYWlyIG9yIG9iamVjdCBtYXAgdG8gdGhlIGRpcmVjdGl2ZSdzIGVsZW1lbnRcbiAgICovXG4gIGFwcGx5U3R5bGVUb0VsZW1lbnRzKHN0eWxlOiBTdHlsZURlZmluaXRpb24sIGVsZW1lbnRzOiBIVE1MRWxlbWVudFtdID0gW10pIHtcbiAgICBjb25zdCBzdHlsZXMgPSB0aGlzLmxheW91dENvbmZpZy5kaXNhYmxlVmVuZG9yUHJlZml4ZXMgPyBzdHlsZSA6IGFwcGx5Q3NzUHJlZml4ZXMoc3R5bGUpO1xuICAgIGVsZW1lbnRzLmZvckVhY2goZWwgPT4ge1xuICAgICAgdGhpcy5fYXBwbHlNdWx0aVZhbHVlU3R5bGVUb0VsZW1lbnQoc3R5bGVzLCBlbCk7XG4gICAgfSk7XG4gIH1cblxuICAvKipcbiAgICogRGV0ZXJtaW5lIHRoZSBET00gZWxlbWVudCdzIEZsZXhib3ggZmxvdyAoZmxleC1kaXJlY3Rpb24pXG4gICAqXG4gICAqIENoZWNrIGlubGluZSBzdHlsZSBmaXJzdCB0aGVuIGNoZWNrIGNvbXB1dGVkIChzdHlsZXNoZWV0KSBzdHlsZVxuICAgKi9cbiAgZ2V0Rmxvd0RpcmVjdGlvbih0YXJnZXQ6IEhUTUxFbGVtZW50KTogW3N0cmluZywgc3RyaW5nXSB7XG4gICAgY29uc3QgcXVlcnkgPSAnZmxleC1kaXJlY3Rpb24nO1xuICAgIGxldCB2YWx1ZSA9IHRoaXMubG9va3VwU3R5bGUodGFyZ2V0LCBxdWVyeSk7XG4gICAgY29uc3QgaGFzSW5saW5lVmFsdWUgPSB0aGlzLmxvb2t1cElubGluZVN0eWxlKHRhcmdldCwgcXVlcnkpIHx8XG4gICAgKGlzUGxhdGZvcm1TZXJ2ZXIodGhpcy5fcGxhdGZvcm1JZCkgJiYgdGhpcy5fc2VydmVyTW9kdWxlTG9hZGVkKSA/IHZhbHVlIDogJyc7XG5cbiAgICByZXR1cm4gW3ZhbHVlIHx8ICdyb3cnLCBoYXNJbmxpbmVWYWx1ZV07XG4gIH1cblxuICBoYXNXcmFwKHRhcmdldDogSFRNTEVsZW1lbnQpOiBib29sZWFuIHtcbiAgICBjb25zdCBxdWVyeSA9ICdmbGV4LXdyYXAnO1xuICAgIHJldHVybiB0aGlzLmxvb2t1cFN0eWxlKHRhcmdldCwgcXVlcnkpID09PSAnd3JhcCc7XG4gIH1cblxuICAvKipcbiAgICogRmluZCB0aGUgRE9NIGVsZW1lbnQncyByYXcgYXR0cmlidXRlIHZhbHVlIChpZiBhbnkpXG4gICAqL1xuICBsb29rdXBBdHRyaWJ1dGVWYWx1ZShlbGVtZW50OiBIVE1MRWxlbWVudCwgYXR0cmlidXRlOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiBlbGVtZW50LmdldEF0dHJpYnV0ZShhdHRyaWJ1dGUpID8/ICcnO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpbmQgdGhlIERPTSBlbGVtZW50J3MgaW5saW5lIHN0eWxlIHZhbHVlIChpZiBhbnkpXG4gICAqL1xuICBsb29rdXBJbmxpbmVTdHlsZShlbGVtZW50OiBIVE1MRWxlbWVudCwgc3R5bGVOYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiBpc1BsYXRmb3JtQnJvd3Nlcih0aGlzLl9wbGF0Zm9ybUlkKSA/XG4gICAgICBlbGVtZW50LnN0eWxlLmdldFByb3BlcnR5VmFsdWUoc3R5bGVOYW1lKSA6IGdldFNlcnZlclN0eWxlKGVsZW1lbnQsIHN0eWxlTmFtZSk7XG4gIH1cblxuICAvKipcbiAgICogRGV0ZXJtaW5lIHRoZSBpbmxpbmUgb3IgaW5oZXJpdGVkIENTUyBzdHlsZVxuICAgKiBOT1RFOiBwbGF0Zm9ybS1zZXJ2ZXIgaGFzIG5vIGltcGxlbWVudGF0aW9uIGZvciBnZXRDb21wdXRlZFN0eWxlXG4gICAqL1xuICBsb29rdXBTdHlsZShlbGVtZW50OiBIVE1MRWxlbWVudCwgc3R5bGVOYW1lOiBzdHJpbmcsIGlubGluZU9ubHkgPSBmYWxzZSk6IHN0cmluZyB7XG4gICAgbGV0IHZhbHVlID0gJyc7XG4gICAgaWYgKGVsZW1lbnQpIHtcbiAgICAgIGxldCBpbW1lZGlhdGVWYWx1ZSA9IHZhbHVlID0gdGhpcy5sb29rdXBJbmxpbmVTdHlsZShlbGVtZW50LCBzdHlsZU5hbWUpO1xuICAgICAgaWYgKCFpbW1lZGlhdGVWYWx1ZSkge1xuICAgICAgICBpZiAoaXNQbGF0Zm9ybUJyb3dzZXIodGhpcy5fcGxhdGZvcm1JZCkpIHtcbiAgICAgICAgICBpZiAoIWlubGluZU9ubHkpIHtcbiAgICAgICAgICAgIHZhbHVlID0gZ2V0Q29tcHV0ZWRTdHlsZShlbGVtZW50KS5nZXRQcm9wZXJ0eVZhbHVlKHN0eWxlTmFtZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIGlmICh0aGlzLl9zZXJ2ZXJNb2R1bGVMb2FkZWQpIHtcbiAgICAgICAgICAgIHZhbHVlID0gdGhpcy5fc2VydmVyU3R5bGVzaGVldC5nZXRTdHlsZUZvckVsZW1lbnQoZWxlbWVudCwgc3R5bGVOYW1lKTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG5cbiAgICAvLyBOb3RlOiAnaW5saW5lJyBpcyB0aGUgZGVmYXVsdCBvZiBhbGwgZWxlbWVudHMsIHVubGVzcyBVQSBzdHlsZXNoZWV0IG92ZXJyaWRlcztcbiAgICAvLyAgICAgICBpbiB3aGljaCBjYXNlIGdldENvbXB1dGVkU3R5bGUoKSBzaG91bGQgZGV0ZXJtaW5lIGEgdmFsaWQgdmFsdWUuXG4gICAgcmV0dXJuIHZhbHVlID8gdmFsdWUudHJpbSgpIDogJyc7XG4gIH1cblxuICAvKipcbiAgICogQXBwbGllcyB0aGUgc3R5bGVzIHRvIHRoZSBlbGVtZW50LiBUaGUgc3R5bGVzIG9iamVjdCBtYXAgbWF5IGNvbnRhaW4gYW4gYXJyYXkgb2YgdmFsdWVzXG4gICAqIEVhY2ggdmFsdWUgd2lsbCBiZSBhZGRlZCBhcyBlbGVtZW50IHN0eWxlXG4gICAqIEtleXMgYXJlIHNvcnRlZCB0byBhZGQgcHJlZml4ZWQgc3R5bGVzIChsaWtlIC13ZWJraXQteCkgZmlyc3QsIGJlZm9yZSB0aGUgc3RhbmRhcmQgb25lc1xuICAgKi9cbiAgcHJpdmF0ZSBfYXBwbHlNdWx0aVZhbHVlU3R5bGVUb0VsZW1lbnQoc3R5bGVzOiBTdHlsZURlZmluaXRpb24sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQ6IEhUTUxFbGVtZW50KSB7XG4gICAgT2JqZWN0LmtleXMoc3R5bGVzKS5zb3J0KCkuZm9yRWFjaChrZXkgPT4ge1xuICAgICAgY29uc3QgZWwgPSBzdHlsZXNba2V5XTtcbiAgICAgIGNvbnN0IHZhbHVlczogKHN0cmluZyB8IG51bWJlciB8IG51bGwpW10gPSBBcnJheS5pc0FycmF5KGVsKSA/IGVsIDogW2VsXTtcbiAgICAgIHZhbHVlcy5zb3J0KCk7XG4gICAgICBmb3IgKGxldCB2YWx1ZSBvZiB2YWx1ZXMpIHtcbiAgICAgICAgdmFsdWUgPSB2YWx1ZSA/IHZhbHVlICsgJycgOiAnJztcbiAgICAgICAgaWYgKGlzUGxhdGZvcm1Ccm93c2VyKHRoaXMuX3BsYXRmb3JtSWQpIHx8ICF0aGlzLl9zZXJ2ZXJNb2R1bGVMb2FkZWQpIHtcbiAgICAgICAgICBpc1BsYXRmb3JtQnJvd3Nlcih0aGlzLl9wbGF0Zm9ybUlkKSA/XG4gICAgICAgICAgICBlbGVtZW50LnN0eWxlLnNldFByb3BlcnR5KGtleSwgdmFsdWUpIDogc2V0U2VydmVyU3R5bGUoZWxlbWVudCwga2V5LCB2YWx1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgdGhpcy5fc2VydmVyU3R5bGVzaGVldC5hZGRTdHlsZVRvRWxlbWVudChlbGVtZW50LCBrZXksIHZhbHVlKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0pO1xuICB9XG59XG5cbmZ1bmN0aW9uIGdldFNlcnZlclN0eWxlKGVsZW1lbnQ6IGFueSwgc3R5bGVOYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICBjb25zdCBzdHlsZU1hcCA9IHJlYWRTdHlsZUF0dHJpYnV0ZShlbGVtZW50KTtcbiAgcmV0dXJuIHN0eWxlTWFwW3N0eWxlTmFtZV0gPz8gJyc7XG59XG5cbmZ1bmN0aW9uIHNldFNlcnZlclN0eWxlKGVsZW1lbnQ6IGFueSwgc3R5bGVOYW1lOiBzdHJpbmcsIHN0eWxlVmFsdWU/OiBzdHJpbmd8bnVsbCkge1xuICBzdHlsZU5hbWUgPSBzdHlsZU5hbWUucmVwbGFjZSgvKFthLXpdKShbQS1aXSkvZywgJyQxLSQyJykudG9Mb3dlckNhc2UoKTtcbiAgY29uc3Qgc3R5bGVNYXAgPSByZWFkU3R5bGVBdHRyaWJ1dGUoZWxlbWVudCk7XG4gIHN0eWxlTWFwW3N0eWxlTmFtZV0gPSBzdHlsZVZhbHVlID8/ICcnO1xuICB3cml0ZVN0eWxlQXR0cmlidXRlKGVsZW1lbnQsIHN0eWxlTWFwKTtcbn1cblxuZnVuY3Rpb24gd3JpdGVTdHlsZUF0dHJpYnV0ZShlbGVtZW50OiBhbnksIHN0eWxlTWFwOiB7W25hbWU6IHN0cmluZ106IHN0cmluZ30pIHtcbiAgbGV0IHN0eWxlQXR0clZhbHVlID0gJyc7XG4gIGZvciAoY29uc3Qga2V5IGluIHN0eWxlTWFwKSB7XG4gICAgY29uc3QgbmV3VmFsdWUgPSBzdHlsZU1hcFtrZXldO1xuICAgIGlmIChuZXdWYWx1ZSkge1xuICAgICAgc3R5bGVBdHRyVmFsdWUgKz0gYCR7a2V5fToke3N0eWxlTWFwW2tleV19O2A7XG4gICAgfVxuICB9XG4gIGVsZW1lbnQuc2V0QXR0cmlidXRlKCdzdHlsZScsIHN0eWxlQXR0clZhbHVlKTtcbn1cblxuZnVuY3Rpb24gcmVhZFN0eWxlQXR0cmlidXRlKGVsZW1lbnQ6IGFueSk6IHtbbmFtZTogc3RyaW5nXTogc3RyaW5nfSB7XG4gIGNvbnN0IHN0eWxlTWFwOiB7W25hbWU6IHN0cmluZ106IHN0cmluZ30gPSB7fTtcbiAgY29uc3Qgc3R5bGVBdHRyaWJ1dGUgPSBlbGVtZW50LmdldEF0dHJpYnV0ZSgnc3R5bGUnKTtcbiAgaWYgKHN0eWxlQXR0cmlidXRlKSB7XG4gICAgY29uc3Qgc3R5bGVMaXN0ID0gc3R5bGVBdHRyaWJ1dGUuc3BsaXQoLzsrL2cpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgc3R5bGVMaXN0Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBjb25zdCBzdHlsZSA9IHN0eWxlTGlzdFtpXS50cmltKCk7XG4gICAgICBpZiAoc3R5bGUubGVuZ3RoID4gMCkge1xuICAgICAgICBjb25zdCBjb2xvbkluZGV4ID0gc3R5bGUuaW5kZXhPZignOicpO1xuICAgICAgICBpZiAoY29sb25JbmRleCA9PT0gLTEpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgQ1NTIHN0eWxlOiAke3N0eWxlfWApO1xuICAgICAgICB9XG4gICAgICAgIGNvbnN0IG5hbWUgPSBzdHlsZS5zdWJzdHIoMCwgY29sb25JbmRleCkudHJpbSgpO1xuICAgICAgICBzdHlsZU1hcFtuYW1lXSA9IHN0eWxlLnN1YnN0cihjb2xvbkluZGV4ICsgMSkudHJpbSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gc3R5bGVNYXA7XG59XG5cbi8qKlxuICogRGVmaW5pdGlvbiBvZiBhIGNzcyBzdHlsZS4gRWl0aGVyIGEgcHJvcGVydHkgbmFtZSAoZS5nLiBcImZsZXgtYmFzaXNcIikgb3IgYW4gb2JqZWN0XG4gKiBtYXAgb2YgcHJvcGVydHkgbmFtZSBhbmQgdmFsdWUgKGUuZy4ge2Rpc3BsYXk6ICdub25lJywgZmxleC1vcmRlcjogNX0pXG4gKi9cbmV4cG9ydCB0eXBlIFN0eWxlRGVmaW5pdGlvbiA9IHsgW3Byb3BlcnR5OiBzdHJpbmddOiBzdHJpbmcgfCBudW1iZXIgfCBudWxsIH07XG4iXX0=