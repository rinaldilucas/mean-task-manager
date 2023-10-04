/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Directive } from '@angular/core';
import { Subject } from 'rxjs';
import { buildLayoutCSS } from '@angular/flex-layout/_private-utils';
import * as i0 from "@angular/core";
import * as i1 from "../style-builder/style-builder";
import * as i2 from "../style-utils/style-utils";
import * as i3 from "../media-marshaller/media-marshaller";
export class BaseDirective2 {
    constructor(elementRef, styleBuilder, styler, marshal) {
        this.elementRef = elementRef;
        this.styleBuilder = styleBuilder;
        this.styler = styler;
        this.marshal = marshal;
        this.DIRECTIVE_KEY = '';
        this.inputs = [];
        /** The most recently used styles for the builder */
        this.mru = {};
        this.destroySubject = new Subject();
        /** Cache map for style computation */
        this.styleCache = new Map();
    }
    /** Access to host element's parent DOM node */
    get parentElement() {
        return this.elementRef.nativeElement.parentElement;
    }
    /** Access to the HTMLElement for the directive */
    get nativeElement() {
        return this.elementRef.nativeElement;
    }
    /** Access to the activated value for the directive */
    get activatedValue() {
        return this.marshal.getValue(this.nativeElement, this.DIRECTIVE_KEY);
    }
    set activatedValue(value) {
        this.marshal.setValue(this.nativeElement, this.DIRECTIVE_KEY, value, this.marshal.activatedAlias);
    }
    /** For @Input changes */
    ngOnChanges(changes) {
        Object.keys(changes).forEach(key => {
            if (this.inputs.indexOf(key) !== -1) {
                const bp = key.split('.').slice(1).join('.');
                const val = changes[key].currentValue;
                this.setValue(val, bp);
            }
        });
    }
    ngOnDestroy() {
        this.destroySubject.next();
        this.destroySubject.complete();
        this.marshal.releaseElement(this.nativeElement);
    }
    /** Register with central marshaller service */
    init(extraTriggers = []) {
        this.marshal.init(this.elementRef.nativeElement, this.DIRECTIVE_KEY, this.updateWithValue.bind(this), this.clearStyles.bind(this), extraTriggers);
    }
    /** Add styles to the element using predefined style builder */
    addStyles(input, parent) {
        const builder = this.styleBuilder;
        const useCache = builder.shouldCache;
        let genStyles = this.styleCache.get(input);
        if (!genStyles || !useCache) {
            genStyles = builder.buildStyles(input, parent);
            if (useCache) {
                this.styleCache.set(input, genStyles);
            }
        }
        this.mru = { ...genStyles };
        this.applyStyleToElement(genStyles);
        builder.sideEffect(input, genStyles, parent);
    }
    /** Remove generated styles from an element using predefined style builder */
    clearStyles() {
        Object.keys(this.mru).forEach(k => {
            this.mru[k] = '';
        });
        this.applyStyleToElement(this.mru);
        this.mru = {};
        this.currentValue = undefined;
    }
    /** Force trigger style updates on DOM element */
    triggerUpdate() {
        this.marshal.triggerUpdate(this.nativeElement, this.DIRECTIVE_KEY);
    }
    /**
     * Determine the DOM element's Flexbox flow (flex-direction).
     *
     * Check inline style first then check computed (stylesheet) style.
     * And optionally add the flow value to element's inline style.
     */
    getFlexFlowDirection(target, addIfMissing = false) {
        if (target) {
            const [value, hasInlineValue] = this.styler.getFlowDirection(target);
            if (!hasInlineValue && addIfMissing) {
                const style = buildLayoutCSS(value);
                const elements = [target];
                this.styler.applyStyleToElements(style, elements);
            }
            return value.trim();
        }
        return 'row';
    }
    hasWrap(target) {
        return this.styler.hasWrap(target);
    }
    /** Applies styles given via string pair or object map to the directive element */
    applyStyleToElement(style, value, element = this.nativeElement) {
        this.styler.applyStyleToElement(element, style, value);
    }
    setValue(val, bp) {
        this.marshal.setValue(this.nativeElement, this.DIRECTIVE_KEY, val, bp);
    }
    updateWithValue(input) {
        if (this.currentValue !== input) {
            this.addStyles(input);
            this.currentValue = input;
        }
    }
}
BaseDirective2.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: BaseDirective2, deps: [{ token: i0.ElementRef }, { token: i1.StyleBuilder }, { token: i2.StyleUtils }, { token: i3.MediaMarshaller }], target: i0.ɵɵFactoryTarget.Directive });
BaseDirective2.ɵdir = i0.ɵɵngDeclareDirective({ minVersion: "14.0.0", version: "14.0.1", type: BaseDirective2, usesOnChanges: true, ngImport: i0 });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: BaseDirective2, decorators: [{
            type: Directive
        }], ctorParameters: function () { return [{ type: i0.ElementRef }, { type: i1.StyleBuilder }, { type: i2.StyleUtils }, { type: i3.MediaMarshaller }]; } });
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYmFzZTIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9saWJzL2ZsZXgtbGF5b3V0L2NvcmUvYmFzZS9iYXNlMi50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFDSCxPQUFPLEVBQUMsU0FBUyxFQUFrRCxNQUFNLGVBQWUsQ0FBQztBQUN6RixPQUFPLEVBQWEsT0FBTyxFQUFDLE1BQU0sTUFBTSxDQUFDO0FBS3pDLE9BQU8sRUFBQyxjQUFjLEVBQUMsTUFBTSxxQ0FBcUMsQ0FBQzs7Ozs7QUFHbkUsTUFBTSxPQUFnQixjQUFjO0lBK0JsQyxZQUFnQyxVQUFzQixFQUN0QixZQUEwQixFQUMxQixNQUFrQixFQUNsQixPQUF3QjtRQUh4QixlQUFVLEdBQVYsVUFBVSxDQUFZO1FBQ3RCLGlCQUFZLEdBQVosWUFBWSxDQUFjO1FBQzFCLFdBQU0sR0FBTixNQUFNLENBQVk7UUFDbEIsWUFBTyxHQUFQLE9BQU8sQ0FBaUI7UUFoQzlDLGtCQUFhLEdBQUcsRUFBRSxDQUFDO1FBQ25CLFdBQU0sR0FBYSxFQUFFLENBQUM7UUFDaEMsb0RBQW9EO1FBQzFDLFFBQUcsR0FBb0IsRUFBRSxDQUFDO1FBQzFCLG1CQUFjLEdBQWtCLElBQUksT0FBTyxFQUFFLENBQUM7UUFzQnhELHNDQUFzQztRQUM1QixlQUFVLEdBQWlDLElBQUksR0FBRyxFQUFFLENBQUM7SUFNL0QsQ0FBQztJQTFCRCwrQ0FBK0M7SUFDL0MsSUFBYyxhQUFhO1FBQ3pCLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDO0lBQ3JELENBQUM7SUFFRCxrREFBa0Q7SUFDbEQsSUFBYyxhQUFhO1FBQ3pCLE9BQU8sSUFBSSxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUM7SUFDdkMsQ0FBQztJQUVELHNEQUFzRDtJQUN0RCxJQUFJLGNBQWM7UUFDaEIsT0FBTyxJQUFJLENBQUMsT0FBTyxDQUFDLFFB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QUM7SUFFUyxRQUFRLENBQUMsR0FBUSxFQUFFLEVBQVU7UUFDckMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLGFBQWEsRUFBRSxJQUFJLENBQUMsYUFBYSxFQUFFLEdBQUcsRUFBRSxFQUFFLENBQUMsQ0FBQztJQUN6RSxDQUFDO0lBRVMsZUFBZSxDQUFDLEtBQWE7UUFDckMsSUFBSSxJQUFJLENBQUMsWUFBWSxLQUFLLEtBQUssRUFBRTtZQUMvQixJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1lBQ3RCLElBQUksQ0FBQyxZQUFZLEdBQUcsS0FBSyxDQUFDO1NBQzNCO0lBQ0gsQ0FBQzs7MkdBN0ltQixjQUFjOytGQUFkLGNBQWM7MkZBQWQsY0FBYztrQkFEbkMsU0FBUyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtEaXJlY3RpdmUsIEVsZW1lbnRSZWYsIE9uQ2hhbmdlcywgT25EZXN0cm95LCBTaW1wbGVDaGFuZ2VzfSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7T2JzZXJ2YWJsZSwgU3ViamVjdH0gZnJvbSAncnhqcyc7XG5cbmltcG9ydCB7U3R5bGVEZWZpbml0aW9uLCBTdHlsZVV0aWxzfSBmcm9tICcuLi9zdHlsZS11dGlscy9zdHlsZS11dGlscyc7XG5pbXBvcnQge1N0eWxlQnVpbGRlcn0gZnJvbSAnLi4vc3R5bGUtYnVpbGRlci9zdHlsZS1idWlsZGVyJztcbmltcG9ydCB7TWVkaWFNYXJzaGFsbGVyfSBmcm9tICcuLi9tZWRpYS1tYXJzaGFsbGVyL21lZGlhLW1hcnNoYWxsZXInO1xuaW1wb3J0IHtidWlsZExheW91dENTU30gZnJvbSAnQGFuZ3VsYXIvZmxleC1sYXlvdXQvX3ByaXZhdGUtdXRpbHMnO1xuXG5ARGlyZWN0aXZlKClcbmV4cG9ydCBhYnN0cmFjdCBjbGFzcyBCYXNlRGlyZWN0aXZlMiBpbXBsZW1lbnRzIE9uQ2hhbmdlcywgT25EZXN0cm95IHtcblxuICBwcm90ZWN0ZWQgRElSRUNUSVZFX0tFWSA9ICcnO1xuICBwcm90ZWN0ZWQgaW5wdXRzOiBzdHJpbmdbXSA9IFtdO1xuICAvKiogVGhlIG1vc3QgcmVjZW50bHkgdXNlZCBzdHlsZXMgZm9yIHRoZSBidWlsZGVyICovXG4gIHByb3RlY3RlZCBtcnU6IFN0eWxlRGVmaW5pdGlvbiA9IHt9O1xuICBwcm90ZWN0ZWQgZGVzdHJveVN1YmplY3Q6IFN1YmplY3Q8dm9pZD4gPSBuZXcgU3ViamVjdCgpO1xuICBwcm90ZWN0ZWQgY3VycmVudFZhbHVlOiBhbnk7XG5cbiAgLyoqIEFjY2VzcyB0byBob3N0IGVsZW1lbnQncyBwYXJlbnQgRE9NIG5vZGUgKi9cbiAgcHJvdGVjdGVkIGdldCBwYXJlbnRFbGVtZW50KCk6IEhUTUxFbGVtZW50IHwgbnVsbCB7XG4gICAgcmV0dXJuIHRoaXMuZWxlbWVudFJlZi5uYXRpdmVFbGVtZW50LnBhcmVudEVsZW1lbnQ7XG4gIH1cblxuICAvKiogQWNjZXNzIHRvIHRoZSBIVE1MRWxlbWVudCBmb3IgdGhlIGRpcmVjdGl2ZSAqL1xuICBwcm90ZWN0ZWQgZ2V0IG5hdGl2ZUVsZW1lbnQoKTogSFRNTEVsZW1lbnQge1xuICAgIHJldHVybiB0aGlzLmVsZW1lbnRSZWYubmF0aXZlRWxlbWVudDtcbiAgfVxuXG4gIC8qKiBBY2Nlc3MgdG8gdGhlIGFjdGl2YXRlZCB2YWx1ZSBmb3IgdGhlIGRpcmVjdGl2ZSAqL1xuICBnZXQgYWN0aXZhdGVkVmFsdWUoKTogc3RyaW5nIHtcbiAgICByZXR1cm4gdGhpcy5tYXJzaGFsLmdldFZhbHVlKHRoaXMubmF0aXZlRWxlbWVudCwgdGhpcy5ESVJFQ1RJVkVfS0VZKTtcbiAgfVxuICBzZXQgYWN0aXZhdGVkVmFsdWUodmFsdWU6IHN0cmluZykge1xuICAgIHRoaXMubWFyc2hhbC5zZXRWYWx1ZSh0aGlzLm5hdGl2ZUVsZW1lbnQsIHRoaXMuRElSRUNUSVZFX0tFWSwgdmFsdWUsXG4gICAgICB0aGlzLm1hcnNoYWwuYWN0aXZhdGVkQWxpYXMpO1xuICB9XG5cbiAgLyoqIENhY2hlIG1hcCBmb3Igc3R5bGUgY29tcHV0YXRpb24gKi9cbiAgcHJvdGVjdGVkIHN0eWxlQ2FjaGU6IE1hcDxzdHJpbmcsIFN0eWxlRGVmaW5pdGlvbj4gPSBuZXcgTWFwKCk7XG5cbiAgcHJvdGVjdGVkIGNvbnN0cnVjdG9yKHByb3RlY3RlZCBlbGVtZW50UmVmOiBFbGVtZW50UmVmLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvdGVjdGVkIHN0eWxlQnVpbGRlcjogU3R5bGVCdWlsZGVyLFxuICAgICAgICAgICAgICAgICAgICAgICAgcHJvdGVjdGVkIHN0eWxlcjogU3R5bGVVdGlscyxcbiAgICAgICAgICAgICAgICAgICAgICAgIHByb3RlY3RlZCBtYXJzaGFsOiBNZWRpYU1hcnNoYWxsZXIpIHtcbiAgfVxuXG4gIC8qKiBGb3IgQElucHV0IGNoYW5nZXMgKi9cbiAgbmdPbkNoYW5nZXMoY2hhbmdlczogU2ltcGxlQ2hhbmdlcykge1xuICAgIE9iamVjdC5rZXlzKGNoYW5nZXMpLmZvckVhY2goa2V5ID0+IHtcbiAgICAgIGlmICh0aGlzLmlucHV0cy5pbmRleE9mKGtleSkgIT09IC0xKSB7XG4gICAgICAgIGNvbnN0IGJwID0ga2V5LnNwbGl0KCcuJykuc2xpY2UoMSkuam9pbignLicpO1xuICAgICAgICBjb25zdCB2YWwgPSBjaGFuZ2VzW2tleV0uY3VycmVudFZhbHVlO1xuICAgICAgICB0aGlzLnNldFZhbHVlKHZhbCwgYnApO1xuICAgICAgfVxuICAgIH0pO1xuICB9XG5cbiAgbmdPbkRlc3Ryb3koKTogdm9pZCB7XG4gICAgdGhpcy5kZXN0cm95U3ViamVjdC5uZXh0KCk7XG4gICAgdGhpcy5kZXN0cm95U3ViamVjdC5jb21wbGV0ZSgpO1xuICAgIHRoaXMubWFyc2hhbC5yZWxlYXNlRWxlbWVudCh0aGlzLm5hdGl2ZUVsZW1lbnQpO1xuICB9XG5cbiAgLyoqIFJlZ2lzdGVyIHdpdGggY2VudHJhbCBtYXJzaGFsbGVyIHNlcnZpY2UgKi9cbiAgcHJvdGVjdGVkIGluaXQoZXh0cmFUcmlnZ2VyczogT2JzZXJ2YWJsZTxhbnk+W10gPSBbXSk6IHZvaWQge1xuICAgIHRoaXMubWFyc2hhbC5pbml0KFxuICAgICAgdGhpcy5lbGVtZW50UmVmLm5hdGl2ZUVsZW1lbnQsXG4gICAgICB0aGlzLkRJUkVDVElWRV9LRVksXG4gICAgICB0aGlzLnVwZGF0ZVdpdGhWYWx1ZS5iaW5kKHRoaXMpLFxuICAgICAgdGhpcy5jbGVhclN0eWxlcy5iaW5kKHRoaXMpLFxuICAgICAgZXh0cmFUcmlnZ2Vyc1xuICAgICk7XG4gIH1cblxuICAvKiogQWRkIHN0eWxlcyB0byB0aGUgZWxlbWVudCB1c2luZyBwcmVkZWZpbmVkIHN0eWxlIGJ1aWxkZXIgKi9cbiAgcHJvdGVjdGVkIGFkZFN0eWxlcyhpbnB1dDogc3RyaW5nLCBwYXJlbnQ/OiBPYmplY3QpIHtcbiAgICBjb25zdCBidWlsZGVyID0gdGhpcy5zdHlsZUJ1aWxkZXI7XG4gICAgY29uc3QgdXNlQ2FjaGUgPSBidWlsZGVyLnNob3VsZENhY2hlO1xuXG4gICAgbGV0IGdlblN0eWxlczogU3R5bGVEZWZpbml0aW9uIHwgdW5kZWZpbmVkID0gdGhpcy5zdHlsZUNhY2hlLmdldChpbnB1dCk7XG5cbiAgICBpZiAoIWdlblN0eWxlcyB8fCAhdXNlQ2FjaGUpIHtcbiAgICAgIGdlblN0eWxlcyA9IGJ1aWxkZXIuYnVpbGRTdHlsZXMoaW5wdXQsIHBhcmVudCk7XG4gICAgICBpZiAodXNlQ2FjaGUpIHtcbiAgICAgICAgdGhpcy5zdHlsZUNhY2hlLnNldChpbnB1dCwgZ2VuU3R5bGVzKTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aGlzLm1ydSA9IHsuLi5nZW5TdHlsZXN9O1xuICAgIHRoaXMuYXBwbHlTdHlsZVRvRWxlbWVudChnZW5TdHlsZXMpO1xuICAgIGJ1aWxkZXIuc2lkZUVmZmVjdChpbnB1dCwgZ2VuU3R5bGVzLCBwYXJlbnQpO1xuICB9XG5cbiAgLyoqIFJlbW92ZSBnZW5lcmF0ZWQgc3R5bGVzIGZyb20gYW4gZWxlbWVudCB1c2luZyBwcmVkZWZpbmVkIHN0eWxlIGJ1aWxkZXIgKi9cbiAgcHJvdGVjdGVkIGNsZWFyU3R5bGVzKCkge1xuICAgIE9iamVjdC5rZXlzKHRoaXMubXJ1KS5mb3JFYWNoKGsgPT4ge1xuICAgICAgdGhpcy5tcnVba10gPSAnJztcbiAgICB9KTtcbiAgICB0aGlzLmFwcGx5U3R5bGVUb0VsZW1lbnQodGhpcy5tcnUpO1xuICAgIHRoaXMubXJ1ID0ge307XG4gICAgdGhpcy5jdXJyZW50VmFsdWUgPSB1bmRlZmluZWQ7XG4gIH1cblxuICAvKiogRm9yY2UgdHJpZ2dlciBzdHlsZSB1cGRhdGVzIG9uIERPTSBlbGVtZW50ICovXG4gIHByb3RlY3RlZCB0cmlnZ2VyVXBkYXRlKCkge1xuICAgIHRoaXMubWFyc2hhbC50cmlnZ2VyVXBkYXRlKHRoaXMubmF0aXZlRWxlbWVudCwgdGhpcy5ESVJFQ1RJVkVfS0VZKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZXRlcm1pbmUgdGhlIERPTSBlbGVtZW50J3MgRmxleGJveCBmbG93IChmbGV4LWRpcmVjdGlvbikuXG4gICAqXG4gICAqIENoZWNrIGlubGluZSBzdHlsZSBmaXJzdCB0aGVuIGNoZWNrIGNvbXB1dGVkIChzdHlsZXNoZWV0KSBzdHlsZS5cbiAgICogQW5kIG9wdGlvbmFsbHkgYWRkIHRoZSBmbG93IHZhbHVlIHRvIGVsZW1lbnQncyBpbmxpbmUgc3R5bGUuXG4gICAqL1xuICBwcm90ZWN0ZWQgZ2V0RmxleEZsb3dEaXJlY3Rpb24odGFyZ2V0OiBIVE1MRWxlbWVudCwgYWRkSWZNaXNzaW5nID0gZmFsc2UpOiBzdHJpbmcge1xuICAgIGlmICh0YXJnZXQpIHtcbiAgICAgIGNvbnN0IFt2YWx1ZSwgaGFzSW5saW5lVmFsdWVdID0gdGhpcy5zdHlsZXIuZ2V0Rmxvd0RpcmVjdGlvbih0YXJnZXQpO1xuXG4gICAgICBpZiAoIWhhc0lubGluZVZhbHVlICYmIGFkZElmTWlzc2luZykge1xuICAgICAgICBjb25zdCBzdHlsZSA9IGJ1aWxkTGF5b3V0Q1NTKHZhbHVlKTtcbiAgICAgICAgY29uc3QgZWxlbWVudHMgPSBbdGFyZ2V0XTtcbiAgICAgICAgdGhpcy5zdHlsZXIuYXBwbHlTdHlsZVRvRWxlbWVudHMoc3R5bGUsIGVsZW1lbnRzKTtcbiAgICAgIH1cblxuICAgICAgcmV0dXJuIHZhbHVlLnRyaW0oKTtcbiAgICB9XG5cbiAgICByZXR1cm4gJ3Jvdyc7XG4gIH1cblxuICBwcm90ZWN0ZWQgaGFzV3JhcCh0YXJnZXQ6IEhUTUxFbGVtZW50KTogYm9vbGVhbiB7XG4gICAgcmV0dXJuIHRoaXMuc3R5bGVyLmhhc1dyYXAodGFyZ2V0KTtcbiAgfVxuXG4gIC8qKiBBcHBsaWVzIHN0eWxlcyBnaXZlbiB2aWEgc3RyaW5nIHBhaXIgb3Igb2JqZWN0IG1hcCB0byB0aGUgZGlyZWN0aXZlIGVsZW1lbnQgKi9cbiAgcHJvdGVjdGVkIGFwcGx5U3R5bGVUb0VsZW1lbnQoc3R5bGU6IFN0eWxlRGVmaW5pdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU/OiBzdHJpbmcgfCBudW1iZXIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGVsZW1lbnQ6IEhUTUxFbGVtZW50ID0gdGhpcy5uYXRpdmVFbGVtZW50KSB7XG4gICAgdGhpcy5zdHlsZXIuYXBwbHlTdHlsZVRvRWxlbWVudChlbGVtZW50LCBzdHlsZSwgdmFsdWUpO1xuICB9XG5cbiAgcHJvdGVjdGVkIHNldFZhbHVlKHZhbDogYW55LCBicDogc3RyaW5nKTogdm9pZCB7XG4gICAgdGhpcy5tYXJzaGFsLnNldFZhbHVlKHRoaXMubmF0aXZlRWxlbWVudCwgdGhpcy5ESVJFQ1RJVkVfS0VZLCB2YWwsIGJwKTtcbiAgfVxuXG4gIHByb3RlY3RlZCB1cGRhdGVXaXRoVmFsdWUoaW5wdXQ6IHN0cmluZykge1xuICAgIGlmICh0aGlzLmN1cnJlbnRWYWx1ZSAhPT0gaW5wdXQpIHtcbiAgICAgIHRoaXMuYWRkU3R5bGVzKGlucHV0KTtcbiAgICAgIHRoaXMuY3VycmVudFZhbHVlID0gaW5wdXQ7XG4gICAgfVxuICB9XG59XG4iXX0=