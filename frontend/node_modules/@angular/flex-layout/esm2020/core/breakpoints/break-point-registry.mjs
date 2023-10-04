/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Injectable, Inject } from '@angular/core';
import { BREAKPOINTS } from './break-points-token';
import { sortAscendingPriority } from '../utils/sort';
import * as i0 from "@angular/core";
/**
 * Registry of 1..n MediaQuery breakpoint ranges
 * This is published as a provider and may be overridden from custom, application-specific ranges
 *
 */
export class BreakPointRegistry {
    constructor(list) {
        /**
         * Memoized BreakPoint Lookups
         */
        this.findByMap = new Map();
        this.items = [...list].sort(sortAscendingPriority);
    }
    /**
     * Search breakpoints by alias (e.g. gt-xs)
     */
    findByAlias(alias) {
        return !alias ? null : this.findWithPredicate(alias, (bp) => bp.alias === alias);
    }
    findByQuery(query) {
        return this.findWithPredicate(query, (bp) => bp.mediaQuery === query);
    }
    /**
     * Get all the breakpoints whose ranges could overlapping `normal` ranges;
     * e.g. gt-sm overlaps md, lg, and xl
     */
    get overlappings() {
        return this.items.filter(it => it.overlapping);
    }
    /**
     * Get list of all registered (non-empty) breakpoint aliases
     */
    get aliases() {
        return this.items.map(it => it.alias);
    }
    /**
     * Aliases are mapped to properties using suffixes
     * e.g.  'gt-sm' for property 'layout'  uses suffix 'GtSm'
     * for property layoutGtSM.
     */
    get suffixes() {
        return this.items.map(it => it?.suffix ?? '');
    }
    /**
     * Memoized lookup using custom predicate function
     */
    findWithPredicate(key, searchFn) {
        let response = this.findByMap.get(key);
        if (!response) {
            response = this.items.find(searchFn) ?? null;
            this.findByMap.set(key, response);
        }
        return response ?? null;
    }
}
BreakPointRegistry.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: BreakPointRegistry, deps: [{ token: BREAKPOINTS }], target: i0.ɵɵFactoryTarget.Injectable });
BreakPointRegistry.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: BreakPointRegistry, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: BreakPointRegistry, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: undefined, decorators: [{
                    type: Inject,
                    args: [BREAKPOINTS]
                }] }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJlYWstcG9pbnQtcmVnaXN0cnkuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9saWJzL2ZsZXgtbGF5b3V0L2NvcmUvYnJlYWtwb2ludHMvYnJlYWstcG9pbnQtcmVnaXN0cnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFDLFVBQVUsRUFBRSxNQUFNLEVBQUMsTUFBTSxlQUFlLENBQUM7QUFHakQsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ2pELE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLGVBQWUsQ0FBQzs7QUFJcEQ7Ozs7R0FJRztBQUVILE1BQU0sT0FBTyxrQkFBa0I7SUFHN0IsWUFBaUMsSUFBa0I7UUFxRG5EOztXQUVHO1FBQ2MsY0FBUyxHQUFHLElBQUksR0FBRyxFQUE4QixDQUFDO1FBdkRqRSxJQUFJLENBQUMsS0FBSyxHQUFHLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMscUJBQXFCLENBQUMsQ0FBQztJQUNyRCxDQUFDO0lBRUQ7O09BRUc7SUFDSCxXQUFXLENBQUMsS0FBYTtRQUN2QixPQUFPLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxFQUFFLEVBQUUsRUFBRSxDQUFDLEVBQUUsQ0FBQyxLQUFLLEtBQUssS0FBSyxDQUFDLENBQUM7SUFDbkYsQ0FBQztJQUVELFdBQVcsQ0FBQyxLQUFhO1FBQ3ZCLE9BQU8sSUFBSSxDQUFDLGlCQUFpQixDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRSxFQUFFLENBQUMsRUFBRSxDQUFDLFVBQVUsS0FBSyxLQUFLLENBQUMsQ0FBQztJQUN4RSxDQUFDO0lBRUQ7OztPQUdHO0lBQ0gsSUFBSSxZQUFZO1FBQ2QsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsQ0FBQyxXQUFXLENBQUMsQ0FBQztJQUNqRCxDQUFDO0lBRUQ7O09BRUc7SUFDSCxJQUFJLE9BQU87UUFDVCxPQUFPLElBQUksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFFRDs7OztPQUlHO0lBQ0gsSUFBSSxRQUFRO1FBQ1YsT0FBTyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxDQUFDLEVBQUUsRUFBRSxNQUFNLElBQUksRUFBRSxDQUFDLENBQUM7SUFDaEQsQ0FBQztJQUVEOztPQUVHO0lBQ0ssaUJBQWlCLENBQUMsR0FBVyxFQUNqQyxRQUFxQztRQUN2QyxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQztRQUN2QyxJQUFJLENBQUMsUUFBUSxFQUFFO1lBQ2IsUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLFFBQVEsQ0FBQyxJQUFJLElBQUksQ0FBQztZQUM3QyxJQUFJLENBQUMsU0FBUyxDQUFDLEdBQUcsQ0FBQyxHQUFHLEVBQUUsUUFBUSxDQUFDLENBQUM7U0FDbkM7UUFDRCxPQUFPLFFBQVEsSUFBSSxJQUFJLENBQUM7SUFFMUIsQ0FBQzs7K0dBdERVLGtCQUFrQixrQkFHVCxXQUFXO21IQUhwQixrQkFBa0IsY0FETixNQUFNOzJGQUNsQixrQkFBa0I7a0JBRDlCLFVBQVU7bUJBQUMsRUFBQyxVQUFVLEVBQUUsTUFBTSxFQUFDOzswQkFJakIsTUFBTTsyQkFBQyxXQUFXIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge0luamVjdGFibGUsIEluamVjdH0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5cbmltcG9ydCB7QnJlYWtQb2ludH0gZnJvbSAnLi9icmVhay1wb2ludCc7XG5pbXBvcnQge0JSRUFLUE9JTlRTfSBmcm9tICcuL2JyZWFrLXBvaW50cy10b2tlbic7XG5pbXBvcnQge3NvcnRBc2NlbmRpbmdQcmlvcml0eX0gZnJvbSAnLi4vdXRpbHMvc29ydCc7XG5cbmV4cG9ydCB0eXBlIE9wdGlvbmFsQnJlYWtQb2ludCA9IEJyZWFrUG9pbnQgfCBudWxsO1xuXG4vKipcbiAqIFJlZ2lzdHJ5IG9mIDEuLm4gTWVkaWFRdWVyeSBicmVha3BvaW50IHJhbmdlc1xuICogVGhpcyBpcyBwdWJsaXNoZWQgYXMgYSBwcm92aWRlciBhbmQgbWF5IGJlIG92ZXJyaWRkZW4gZnJvbSBjdXN0b20sIGFwcGxpY2F0aW9uLXNwZWNpZmljIHJhbmdlc1xuICpcbiAqL1xuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdyb290J30pXG5leHBvcnQgY2xhc3MgQnJlYWtQb2ludFJlZ2lzdHJ5IHtcbiAgcmVhZG9ubHkgaXRlbXM6IEJyZWFrUG9pbnRbXTtcblxuICBjb25zdHJ1Y3RvcihASW5qZWN0KEJSRUFLUE9JTlRTKSBsaXN0OiBCcmVha1BvaW50W10pIHtcbiAgICB0aGlzLml0ZW1zID0gWy4uLmxpc3RdLnNvcnQoc29ydEFzY2VuZGluZ1ByaW9yaXR5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZWFyY2ggYnJlYWtwb2ludHMgYnkgYWxpYXMgKGUuZy4gZ3QteHMpXG4gICAqL1xuICBmaW5kQnlBbGlhcyhhbGlhczogc3RyaW5nKTogT3B0aW9uYWxCcmVha1BvaW50IHtcbiAgICByZXR1cm4gIWFsaWFzID8gbnVsbCA6IHRoaXMuZmluZFdpdGhQcmVkaWNhdGUoYWxpYXMsIChicCkgPT4gYnAuYWxpYXMgPT09IGFsaWFzKTtcbiAgfVxuXG4gIGZpbmRCeVF1ZXJ5KHF1ZXJ5OiBzdHJpbmcpOiBPcHRpb25hbEJyZWFrUG9pbnQge1xuICAgIHJldHVybiB0aGlzLmZpbmRXaXRoUHJlZGljYXRlKHF1ZXJ5LCAoYnApID0+IGJwLm1lZGlhUXVlcnkgPT09IHF1ZXJ5KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgYWxsIHRoZSBicmVha3BvaW50cyB3aG9zZSByYW5nZXMgY291bGQgb3ZlcmxhcHBpbmcgYG5vcm1hbGAgcmFuZ2VzO1xuICAgKiBlLmcuIGd0LXNtIG92ZXJsYXBzIG1kLCBsZywgYW5kIHhsXG4gICAqL1xuICBnZXQgb3ZlcmxhcHBpbmdzKCk6IEJyZWFrUG9pbnRbXSB7XG4gICAgcmV0dXJuIHRoaXMuaXRlbXMuZmlsdGVyKGl0ID0+IGl0Lm92ZXJsYXBwaW5nKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgbGlzdCBvZiBhbGwgcmVnaXN0ZXJlZCAobm9uLWVtcHR5KSBicmVha3BvaW50IGFsaWFzZXNcbiAgICovXG4gIGdldCBhbGlhc2VzKCk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gdGhpcy5pdGVtcy5tYXAoaXQgPT4gaXQuYWxpYXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIEFsaWFzZXMgYXJlIG1hcHBlZCB0byBwcm9wZXJ0aWVzIHVzaW5nIHN1ZmZpeGVzXG4gICAqIGUuZy4gICdndC1zbScgZm9yIHByb3BlcnR5ICdsYXlvdXQnICB1c2VzIHN1ZmZpeCAnR3RTbSdcbiAgICogZm9yIHByb3BlcnR5IGxheW91dEd0U00uXG4gICAqL1xuICBnZXQgc3VmZml4ZXMoKTogc3RyaW5nW10ge1xuICAgIHJldHVybiB0aGlzLml0ZW1zLm1hcChpdCA9PiBpdD8uc3VmZml4ID8/ICcnKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBNZW1vaXplZCBsb29rdXAgdXNpbmcgY3VzdG9tIHByZWRpY2F0ZSBmdW5jdGlvblxuICAgKi9cbiAgcHJpdmF0ZSBmaW5kV2l0aFByZWRpY2F0ZShrZXk6IHN0cmluZyxcbiAgICAgIHNlYXJjaEZuOiAoYnA6IEJyZWFrUG9pbnQpID0+IGJvb2xlYW4pOiBPcHRpb25hbEJyZWFrUG9pbnQge1xuICAgIGxldCByZXNwb25zZSA9IHRoaXMuZmluZEJ5TWFwLmdldChrZXkpO1xuICAgIGlmICghcmVzcG9uc2UpIHtcbiAgICAgIHJlc3BvbnNlID0gdGhpcy5pdGVtcy5maW5kKHNlYXJjaEZuKSA/PyBudWxsO1xuICAgICAgdGhpcy5maW5kQnlNYXAuc2V0KGtleSwgcmVzcG9uc2UpO1xuICAgIH1cbiAgICByZXR1cm4gcmVzcG9uc2UgPz8gbnVsbDtcblxuICB9XG5cbiAgLyoqXG4gICAqIE1lbW9pemVkIEJyZWFrUG9pbnQgTG9va3Vwc1xuICAgKi9cbiAgcHJpdmF0ZSByZWFkb25seSBmaW5kQnlNYXAgPSBuZXcgTWFwPFN0cmluZywgT3B0aW9uYWxCcmVha1BvaW50PigpO1xufVxuXG4iXX0=