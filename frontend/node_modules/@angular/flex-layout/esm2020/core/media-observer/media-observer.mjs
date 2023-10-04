/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { Injectable } from '@angular/core';
import { Subject, asapScheduler, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, filter, map, switchMap, takeUntil, } from 'rxjs/operators';
import { mergeAlias } from '../add-alias';
import { MediaChange } from '../media-change';
import { sortDescendingPriority } from '../utils/sort';
import { coerceArray } from '../utils/array';
import * as i0 from "@angular/core";
import * as i1 from "../breakpoints/break-point-registry";
import * as i2 from "../match-media/match-media";
import * as i3 from "../media-marshaller/print-hook";
/**
 * MediaObserver enables applications to listen for 1..n mediaQuery activations and to determine
 * if a mediaQuery is currently activated.
 *
 * Since a breakpoint change will first deactivate 1...n mediaQueries and then possibly activate
 * 1..n mediaQueries, the MediaObserver will debounce notifications and report ALL *activations*
 * in 1 event notification. The reported activations will be sorted in descending priority order.
 *
 * This class uses the BreakPoint Registry to inject alias information into the raw MediaChange
 * notification. For custom mediaQuery notifications, alias information will not be injected and
 * those fields will be ''.
 *
 * Note: Developers should note that only mediaChange activations (not de-activations)
 *       are announced by the MediaObserver.
 *
 *  @usage
 *
 *  // RxJS
 *  import { filter } from 'rxjs/operators';
 *  import { MediaObserver } from '@angular/flex-layout';
 *
 *  @Component({ ... })
 *  export class AppComponent {
 *    status: string = '';
 *
 *    constructor(mediaObserver: MediaObserver) {
 *      const media$ = mediaObserver.asObservable().pipe(
 *        filter((changes: MediaChange[]) => true)   // silly noop filter
 *      );
 *
 *      media$.subscribe((changes: MediaChange[]) => {
 *        let status = '';
 *        changes.forEach( change => {
 *          status += `'${change.mqAlias}' = (${change.mediaQuery}) <br/>` ;
 *        });
 *        this.status = status;
 *     });
 *
 *    }
 *  }
 */
export class MediaObserver {
    constructor(breakpoints, matchMedia, hook) {
        this.breakpoints = breakpoints;
        this.matchMedia = matchMedia;
        this.hook = hook;
        /** Filter MediaChange notifications for overlapping breakpoints */
        this.filterOverlaps = false;
        this.destroyed$ = new Subject();
        this._media$ = this.watchActivations();
    }
    /**
     * Completes the active subject, signalling to all complete for all
     * MediaObserver subscribers
     */
    ngOnDestroy() {
        this.destroyed$.next();
        this.destroyed$.complete();
    }
    // ************************************************
    // Public Methods
    // ************************************************
    /**
     * Observe changes to current activation 'list'
     */
    asObservable() {
        return this._media$;
    }
    /**
     * Allow programmatic query to determine if one or more media query/alias match
     * the current viewport size.
     * @param value One or more media queries (or aliases) to check.
     * @returns Whether any of the media queries match.
     */
    isActive(value) {
        const aliases = splitQueries(coerceArray(value));
        return aliases.some(alias => {
            const query = toMediaQuery(alias, this.breakpoints);
            return query !== null && this.matchMedia.isActive(query);
        });
    }
    // ************************************************
    // Internal Methods
    // ************************************************
    /**
     * Register all the mediaQueries registered in the BreakPointRegistry
     * This is needed so subscribers can be auto-notified of all standard, registered
     * mediaQuery activations
     */
    watchActivations() {
        const queries = this.breakpoints.items.map(bp => bp.mediaQuery);
        return this.buildObservable(queries);
    }
    /**
     * Only pass/announce activations (not de-activations)
     *
     * Since multiple-mediaQueries can be activation in a cycle,
     * gather all current activations into a single list of changes to observers
     *
     * Inject associated (if any) alias information into the MediaChange event
     * - Exclude mediaQuery activations for overlapping mQs. List bounded mQ ranges only
     * - Exclude print activations that do not have an associated mediaQuery
     *
     * NOTE: the raw MediaChange events [from MatchMedia] do not
     *       contain important alias information; as such this info
     *       must be injected into the MediaChange
     */
    buildObservable(mqList) {
        const hasChanges = (changes) => {
            const isValidQuery = (change) => (change.mediaQuery.length > 0);
            return (changes.filter(isValidQuery).length > 0);
        };
        const excludeOverlaps = (changes) => {
            return !this.filterOverlaps ? changes : changes.filter(change => {
                const bp = this.breakpoints.findByQuery(change.mediaQuery);
                return bp?.overlapping ?? true;
            });
        };
        const ignoreDuplicates = (previous, current) => {
            if (previous.length !== current.length) {
                return false;
            }
            const previousMqs = previous.map(mc => mc.mediaQuery);
            const currentMqs = new Set(current.map(mc => mc.mediaQuery));
            const difference = new Set(previousMqs.filter(mq => !currentMqs.has(mq)));
            return difference.size === 0;
        };
        /**
         */
        return this.matchMedia
            .observe(this.hook.withPrintQuery(mqList))
            .pipe(filter((change) => change.matches), debounceTime(0, asapScheduler), switchMap(_ => of(this.findAllActivations())), map(excludeOverlaps), filter(hasChanges), distinctUntilChanged(ignoreDuplicates), takeUntil(this.destroyed$));
    }
    /**
     * Find all current activations and prepare single list of activations
     * sorted by descending priority.
     */
    findAllActivations() {
        const mergeMQAlias = (change) => {
            const bp = this.breakpoints.findByQuery(change.mediaQuery);
            return mergeAlias(change, bp);
        };
        const replaceWithPrintAlias = (change) => this.hook.isPrintEvent(change) ? this.hook.updateEvent(change) : change;
        return this.matchMedia
            .activations
            .map(query => new MediaChange(true, query))
            .map(replaceWithPrintAlias)
            .map(mergeMQAlias)
            .sort(sortDescendingPriority);
    }
}
MediaObserver.ɵfac = i0.ɵɵngDeclareFactory({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: MediaObserver, deps: [{ token: i1.BreakPointRegistry }, { token: i2.MatchMedia }, { token: i3.PrintHook }], target: i0.ɵɵFactoryTarget.Injectable });
MediaObserver.ɵprov = i0.ɵɵngDeclareInjectable({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: MediaObserver, providedIn: 'root' });
i0.ɵɵngDeclareClassMetadata({ minVersion: "12.0.0", version: "14.0.1", ngImport: i0, type: MediaObserver, decorators: [{
            type: Injectable,
            args: [{ providedIn: 'root' }]
        }], ctorParameters: function () { return [{ type: i1.BreakPointRegistry }, { type: i2.MatchMedia }, { type: i3.PrintHook }]; } });
/**
 * Find associated breakpoint (if any)
 */
function toMediaQuery(query, locator) {
    const bp = locator.findByAlias(query) ?? locator.findByQuery(query);
    return bp?.mediaQuery ?? null;
}
/**
 * Split each query string into separate query strings if two queries are provided as comma
 * separated.
 */
function splitQueries(queries) {
    return queries.flatMap(query => query.split(','))
        .map(query => query.trim());
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVkaWEtb2JzZXJ2ZXIuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi8uLi8uLi8uLi9wcm9qZWN0cy9saWJzL2ZsZXgtbGF5b3V0L2NvcmUvbWVkaWEtb2JzZXJ2ZXIvbWVkaWEtb2JzZXJ2ZXIudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBQ0gsT0FBTyxFQUFDLFVBQVUsRUFBWSxNQUFNLGVBQWUsQ0FBQztBQUNwRCxPQUFPLEVBQUMsT0FBTyxFQUFFLGFBQWEsRUFBYyxFQUFFLEVBQUMsTUFBTSxNQUFNLENBQUM7QUFDNUQsT0FBTyxFQUNMLFlBQVksRUFDWixvQkFBb0IsRUFDcEIsTUFBTSxFQUNOLEdBQUcsRUFDSCxTQUFTLEVBQ1QsU0FBUyxHQUNWLE1BQU0sZ0JBQWdCLENBQUM7QUFFeEIsT0FBTyxFQUFDLFVBQVUsRUFBQyxNQUFNLGNBQWMsQ0FBQztBQUN4QyxPQUFPLEVBQUMsV0FBVyxFQUFDLE1BQU0saUJBQWlCLENBQUM7QUFLNUMsT0FBTyxFQUFDLHNCQUFzQixFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQ3JELE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxnQkFBZ0IsQ0FBQzs7Ozs7QUFHM0M7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7R0F3Q0c7QUFFSCxNQUFNLE9BQU8sYUFBYTtJQUl4QixZQUFzQixXQUErQixFQUMvQixVQUFzQixFQUN0QixJQUFlO1FBRmYsZ0JBQVcsR0FBWCxXQUFXLENBQW9CO1FBQy9CLGVBQVUsR0FBVixVQUFVLENBQVk7UUFDdEIsU0FBSSxHQUFKLElBQUksQ0FBVztRQUxyQyxtRUFBbUU7UUFDbkUsbUJBQWMsR0FBRyxLQUFLLENBQUM7UUFpSU4sZUFBVSxHQUFHLElBQUksT0FBTyxFQUFRLENBQUM7UUE1SGhELElBQUksQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixFQUFFLENBQUM7SUFDekMsQ0FBQztJQUVEOzs7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QUFXLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxDQUFDO2FBQzFDLEdBQUcsQ0FBQyxxQkFBcUIsQ0FBQzthQUMxQixHQUFHLENBQUMsWUFBWSxDQUFDO2FBQ2pCLElBQUksQ0FBQyxzQkFBc0IsQ0FBQyxDQUFDO0lBQ3BDLENBQUM7OzBHQWhJVSxhQUFhOzhHQUFiLGFBQWEsY0FERCxNQUFNOzJGQUNsQixhQUFhO2tCQUR6QixVQUFVO21CQUFDLEVBQUMsVUFBVSxFQUFFLE1BQU0sRUFBQzs7QUF1SWhDOztHQUVHO0FBQ0gsU0FBUyxZQUFZLENBQUMsS0FBYSxFQUFFLE9BQTJCO0lBQzlELE1BQU0sRUFBRSxHQUFHLE9BQU8sQ0FBQyxXQUFXLENBQUMsS0FBSyxDQUFDLElBQUksT0FBTyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNwRSxPQUFPLEVBQUUsRUFBRSxVQUFVLElBQUksSUFBSSxDQUFDO0FBQ2hDLENBQUM7QUFFRDs7O0dBR0c7QUFDSCxTQUFTLFlBQVksQ0FBQyxPQUFpQjtJQUNyQyxPQUFPLE9BQU8sQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEVBQUUsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1NBQzlDLEdBQUcsQ0FBQyxLQUFLLENBQUMsRUFBRSxDQUFDLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQ2hDLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7SW5qZWN0YWJsZSwgT25EZXN0cm95fSBmcm9tICdAYW5ndWxhci9jb3JlJztcbmltcG9ydCB7U3ViamVjdCwgYXNhcFNjaGVkdWxlciwgT2JzZXJ2YWJsZSwgb2Z9IGZyb20gJ3J4anMnO1xuaW1wb3J0IHtcbiAgZGVib3VuY2VUaW1lLFxuICBkaXN0aW5jdFVudGlsQ2hhbmdlZCxcbiAgZmlsdGVyLFxuICBtYXAsXG4gIHN3aXRjaE1hcCxcbiAgdGFrZVVudGlsLFxufSBmcm9tICdyeGpzL29wZXJhdG9ycyc7XG5cbmltcG9ydCB7bWVyZ2VBbGlhc30gZnJvbSAnLi4vYWRkLWFsaWFzJztcbmltcG9ydCB7TWVkaWFDaGFuZ2V9IGZyb20gJy4uL21lZGlhLWNoYW5nZSc7XG5pbXBvcnQge01hdGNoTWVkaWF9IGZyb20gJy4uL21hdGNoLW1lZGlhL21hdGNoLW1lZGlhJztcbmltcG9ydCB7UHJpbnRIb29rfSBmcm9tICcuLi9tZWRpYS1tYXJzaGFsbGVyL3ByaW50LWhvb2snO1xuaW1wb3J0IHtCcmVha1BvaW50UmVnaXN0cnksIE9wdGlvbmFsQnJlYWtQb2ludH0gZnJvbSAnLi4vYnJlYWtwb2ludHMvYnJlYWstcG9pbnQtcmVnaXN0cnknO1xuXG5pbXBvcnQge3NvcnREZXNjZW5kaW5nUHJpb3JpdHl9IGZyb20gJy4uL3V0aWxzL3NvcnQnO1xuaW1wb3J0IHtjb2VyY2VBcnJheX0gZnJvbSAnLi4vdXRpbHMvYXJyYXknO1xuXG5cbi8qKlxuICogTWVkaWFPYnNlcnZlciBlbmFibGVzIGFwcGxpY2F0aW9ucyB0byBsaXN0ZW4gZm9yIDEuLm4gbWVkaWFRdWVyeSBhY3RpdmF0aW9ucyBhbmQgdG8gZGV0ZXJtaW5lXG4gKiBpZiBhIG1lZGlhUXVlcnkgaXMgY3VycmVudGx5IGFjdGl2YXRlZC5cbiAqXG4gKiBTaW5jZSBhIGJyZWFrcG9pbnQgY2hhbmdlIHdpbGwgZmlyc3QgZGVhY3RpdmF0ZSAxLi4ubiBtZWRpYVF1ZXJpZXMgYW5kIHRoZW4gcG9zc2libHkgYWN0aXZhdGVcbiAqIDEuLm4gbWVkaWFRdWVyaWVzLCB0aGUgTWVkaWFPYnNlcnZlciB3aWxsIGRlYm91bmNlIG5vdGlmaWNhdGlvbnMgYW5kIHJlcG9ydCBBTEwgKmFjdGl2YXRpb25zKlxuICogaW4gMSBldmVudCBub3RpZmljYXRpb24uIFRoZSByZXBvcnRlZCBhY3RpdmF0aW9ucyB3aWxsIGJlIHNvcnRlZCBpbiBkZXNjZW5kaW5nIHByaW9yaXR5IG9yZGVyLlxuICpcbiAqIFRoaXMgY2xhc3MgdXNlcyB0aGUgQnJlYWtQb2ludCBSZWdpc3RyeSB0byBpbmplY3QgYWxpYXMgaW5mb3JtYXRpb24gaW50byB0aGUgcmF3IE1lZGlhQ2hhbmdlXG4gKiBub3RpZmljYXRpb24uIEZvciBjdXN0b20gbWVkaWFRdWVyeSBub3RpZmljYXRpb25zLCBhbGlhcyBpbmZvcm1hdGlvbiB3aWxsIG5vdCBiZSBpbmplY3RlZCBhbmRcbiAqIHRob3NlIGZpZWxkcyB3aWxsIGJlICcnLlxuICpcbiAqIE5vdGU6IERldmVsb3BlcnMgc2hvdWxkIG5vdGUgdGhhdCBvbmx5IG1lZGlhQ2hhbmdlIGFjdGl2YXRpb25zIChub3QgZGUtYWN0aXZhdGlvbnMpXG4gKiAgICAgICBhcmUgYW5ub3VuY2VkIGJ5IHRoZSBNZWRpYU9ic2VydmVyLlxuICpcbiAqICBAdXNhZ2VcbiAqXG4gKiAgLy8gUnhKU1xuICogIGltcG9ydCB7IGZpbHRlciB9IGZyb20gJ3J4anMvb3BlcmF0b3JzJztcbiAqICBpbXBvcnQgeyBNZWRpYU9ic2VydmVyIH0gZnJvbSAnQGFuZ3VsYXIvZmxleC1sYXlvdXQnO1xuICpcbiAqICBAQ29tcG9uZW50KHsgLi4uIH0pXG4gKiAgZXhwb3J0IGNsYXNzIEFwcENvbXBvbmVudCB7XG4gKiAgICBzdGF0dXM6IHN0cmluZyA9ICcnO1xuICpcbiAqICAgIGNvbnN0cnVjdG9yKG1lZGlhT2JzZXJ2ZXI6IE1lZGlhT2JzZXJ2ZXIpIHtcbiAqICAgICAgY29uc3QgbWVkaWEkID0gbWVkaWFPYnNlcnZlci5hc09ic2VydmFibGUoKS5waXBlKFxuICogICAgICAgIGZpbHRlcigoY2hhbmdlczogTWVkaWFDaGFuZ2VbXSkgPT4gdHJ1ZSkgICAvLyBzaWxseSBub29wIGZpbHRlclxuICogICAgICApO1xuICpcbiAqICAgICAgbWVkaWEkLnN1YnNjcmliZSgoY2hhbmdlczogTWVkaWFDaGFuZ2VbXSkgPT4ge1xuICogICAgICAgIGxldCBzdGF0dXMgPSAnJztcbiAqICAgICAgICBjaGFuZ2VzLmZvckVhY2goIGNoYW5nZSA9PiB7XG4gKiAgICAgICAgICBzdGF0dXMgKz0gYCcke2NoYW5nZS5tcUFsaWFzfScgPSAoJHtjaGFuZ2UubWVkaWFRdWVyeX0pIDxici8+YCA7XG4gKiAgICAgICAgfSk7XG4gKiAgICAgICAgdGhpcy5zdGF0dXMgPSBzdGF0dXM7XG4gKiAgICAgfSk7XG4gKlxuICogICAgfVxuICogIH1cbiAqL1xuQEluamVjdGFibGUoe3Byb3ZpZGVkSW46ICdyb290J30pXG5leHBvcnQgY2xhc3MgTWVkaWFPYnNlcnZlciBpbXBsZW1lbnRzIE9uRGVzdHJveSB7XG4gIC8qKiBGaWx0ZXIgTWVkaWFDaGFuZ2Ugbm90aWZpY2F0aW9ucyBmb3Igb3ZlcmxhcHBpbmcgYnJlYWtwb2ludHMgKi9cbiAgZmlsdGVyT3ZlcmxhcHMgPSBmYWxzZTtcblxuICBjb25zdHJ1Y3Rvcihwcm90ZWN0ZWQgYnJlYWtwb2ludHM6IEJyZWFrUG9pbnRSZWdpc3RyeSxcbiAgICAgICAgICAgICAgcHJvdGVjdGVkIG1hdGNoTWVkaWE6IE1hdGNoTWVkaWEsXG4gICAgICAgICAgICAgIHByb3RlY3RlZCBob29rOiBQcmludEhvb2spIHtcbiAgICB0aGlzLl9tZWRpYSQgPSB0aGlzLndhdGNoQWN0aXZhdGlvbnMoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb21wbGV0ZXMgdGhlIGFjdGl2ZSBzdWJqZWN0LCBzaWduYWxsaW5nIHRvIGFsbCBjb21wbGV0ZSBmb3IgYWxsXG4gICAqIE1lZGlhT2JzZXJ2ZXIgc3Vic2NyaWJlcnNcbiAgICovXG4gIG5nT25EZXN0cm95KCk6IHZvaWQge1xuICAgIHRoaXMuZGVzdHJveWVkJC5uZXh0KCk7XG4gICAgdGhpcy5kZXN0cm95ZWQkLmNvbXBsZXRlKCk7XG4gIH1cblxuICAvLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcbiAgLy8gUHVibGljIE1ldGhvZHNcbiAgLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cbiAgLyoqXG4gICAqIE9ic2VydmUgY2hhbmdlcyB0byBjdXJyZW50IGFjdGl2YXRpb24gJ2xpc3QnXG4gICAqL1xuICBhc09ic2VydmFibGUoKTogT2JzZXJ2YWJsZTxNZWRpYUNoYW5nZVtdPiB7XG4gICAgcmV0dXJuIHRoaXMuX21lZGlhJDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBbGxvdyBwcm9ncmFtbWF0aWMgcXVlcnkgdG8gZGV0ZXJtaW5lIGlmIG9uZSBvciBtb3JlIG1lZGlhIHF1ZXJ5L2FsaWFzIG1hdGNoXG4gICAqIHRoZSBjdXJyZW50IHZpZXdwb3J0IHNpemUuXG4gICAqIEBwYXJhbSB2YWx1ZSBPbmUgb3IgbW9yZSBtZWRpYSBxdWVyaWVzIChvciBhbGlhc2VzKSB0byBjaGVjay5cbiAgICogQHJldHVybnMgV2hldGhlciBhbnkgb2YgdGhlIG1lZGlhIHF1ZXJpZXMgbWF0Y2guXG4gICAqL1xuICBpc0FjdGl2ZSh2YWx1ZTogc3RyaW5nIHwgc3RyaW5nW10pOiBib29sZWFuIHtcbiAgICBjb25zdCBhbGlhc2VzID0gc3BsaXRRdWVyaWVzKGNvZXJjZUFycmF5KHZhbHVlKSk7XG4gICAgcmV0dXJuIGFsaWFzZXMuc29tZShhbGlhcyA9PiB7XG4gICAgICBjb25zdCBxdWVyeSA9IHRvTWVkaWFRdWVyeShhbGlhcywgdGhpcy5icmVha3BvaW50cyk7XG4gICAgICByZXR1cm4gcXVlcnkgIT09IG51bGwgJiYgdGhpcy5tYXRjaE1lZGlhLmlzQWN0aXZlKHF1ZXJ5KTtcbiAgICB9KTtcbiAgfVxuXG4gIC8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuICAvLyBJbnRlcm5hbCBNZXRob2RzXG4gIC8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuXG4gIC8qKlxuICAgKiBSZWdpc3RlciBhbGwgdGhlIG1lZGlhUXVlcmllcyByZWdpc3RlcmVkIGluIHRoZSBCcmVha1BvaW50UmVnaXN0cnlcbiAgICogVGhpcyBpcyBuZWVkZWQgc28gc3Vic2NyaWJlcnMgY2FuIGJlIGF1dG8tbm90aWZpZWQgb2YgYWxsIHN0YW5kYXJkLCByZWdpc3RlcmVkXG4gICAqIG1lZGlhUXVlcnkgYWN0aXZhdGlvbnNcbiAgICovXG4gIHByaXZhdGUgd2F0Y2hBY3RpdmF0aW9ucygpIHtcbiAgICBjb25zdCBxdWVyaWVzID0gdGhpcy5icmVha3BvaW50cy5pdGVtcy5tYXAoYnAgPT4gYnAubWVkaWFRdWVyeSk7XG4gICAgcmV0dXJuIHRoaXMuYnVpbGRPYnNlcnZhYmxlKHF1ZXJpZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIE9ubHkgcGFzcy9hbm5vdW5jZSBhY3RpdmF0aW9ucyAobm90IGRlLWFjdGl2YXRpb25zKVxuICAgKlxuICAgKiBTaW5jZSBtdWx0aXBsZS1tZWRpYVF1ZXJpZXMgY2FuIGJlIGFjdGl2YXRpb24gaW4gYSBjeWNsZSxcbiAgICogZ2F0aGVyIGFsbCBjdXJyZW50IGFjdGl2YXRpb25zIGludG8gYSBzaW5nbGUgbGlzdCBvZiBjaGFuZ2VzIHRvIG9ic2VydmVyc1xuICAgKlxuICAgKiBJbmplY3QgYXNzb2NpYXRlZCAoaWYgYW55KSBhbGlhcyBpbmZvcm1hdGlvbiBpbnRvIHRoZSBNZWRpYUNoYW5nZSBldmVudFxuICAgKiAtIEV4Y2x1ZGUgbWVkaWFRdWVyeSBhY3RpdmF0aW9ucyBmb3Igb3ZlcmxhcHBpbmcgbVFzLiBMaXN0IGJvdW5kZWQgbVEgcmFuZ2VzIG9ubHlcbiAgICogLSBFeGNsdWRlIHByaW50IGFjdGl2YXRpb25zIHRoYXQgZG8gbm90IGhhdmUgYW4gYXNzb2NpYXRlZCBtZWRpYVF1ZXJ5XG4gICAqXG4gICAqIE5PVEU6IHRoZSByYXcgTWVkaWFDaGFuZ2UgZXZlbnRzIFtmcm9tIE1hdGNoTWVkaWFdIGRvIG5vdFxuICAgKiAgICAgICBjb250YWluIGltcG9ydGFudCBhbGlhcyBpbmZvcm1hdGlvbjsgYXMgc3VjaCB0aGlzIGluZm9cbiAgICogICAgICAgbXVzdCBiZSBpbmplY3RlZCBpbnRvIHRoZSBNZWRpYUNoYW5nZVxuICAgKi9cbiAgcHJpdmF0ZSBidWlsZE9ic2VydmFibGUobXFMaXN0OiBzdHJpbmdbXSk6IE9ic2VydmFibGU8TWVkaWFDaGFuZ2VbXT4ge1xuICAgIGNvbnN0IGhhc0NoYW5nZXMgPSAoY2hhbmdlczogTWVkaWFDaGFuZ2VbXSkgPT4ge1xuICAgICAgY29uc3QgaXNWYWxpZFF1ZXJ5ID0gKGNoYW5nZTogTWVkaWFDaGFuZ2UpID0+IChjaGFuZ2UubWVkaWFRdWVyeS5sZW5ndGggPiAwKTtcbiAgICAgIHJldHVybiAoY2hhbmdlcy5maWx0ZXIoaXNWYWxpZFF1ZXJ5KS5sZW5ndGggPiAwKTtcbiAgICB9O1xuICAgIGNvbnN0IGV4Y2x1ZGVPdmVybGFwcyA9IChjaGFuZ2VzOiBNZWRpYUNoYW5nZVtdKSA9PiB7XG4gICAgICByZXR1cm4gIXRoaXMuZmlsdGVyT3ZlcmxhcHMgPyBjaGFuZ2VzIDogY2hhbmdlcy5maWx0ZXIoY2hhbmdlID0+IHtcbiAgICAgICAgY29uc3QgYnAgPSB0aGlzLmJyZWFrcG9pbnRzLmZpbmRCeVF1ZXJ5KGNoYW5nZS5tZWRpYVF1ZXJ5KTtcbiAgICAgICAgcmV0dXJuIGJwPy5vdmVybGFwcGluZyA/PyB0cnVlO1xuICAgICAgfSk7XG4gICAgfTtcbiAgICBjb25zdCBpZ25vcmVEdXBsaWNhdGVzID0gKHByZXZpb3VzOiBNZWRpYUNoYW5nZVtdLCBjdXJyZW50OiBNZWRpYUNoYW5nZVtdKTogYm9vbGVhbiA9PiB7XG4gICAgICBpZiAocHJldmlvdXMubGVuZ3RoICE9PSBjdXJyZW50Lmxlbmd0aCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGNvbnN0IHByZXZpb3VzTXFzID0gcHJldmlvdXMubWFwKG1jID0+IG1jLm1lZGlhUXVlcnkpO1xuICAgICAgY29uc3QgY3VycmVudE1xcyA9IG5ldyBTZXQoY3VycmVudC5tYXAobWMgPT4gbWMubWVkaWFRdWVyeSkpO1xuICAgICAgY29uc3QgZGlmZmVyZW5jZSA9IG5ldyBTZXQocHJldmlvdXNNcXMuZmlsdGVyKG1xID0+ICFjdXJyZW50TXFzLmhhcyhtcSkpKTtcblxuICAgICAgcmV0dXJuIGRpZmZlcmVuY2Uuc2l6ZSA9PT0gMDtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICovXG4gICAgcmV0dXJuIHRoaXMubWF0Y2hNZWRpYVxuICAgICAgICAub2JzZXJ2ZSh0aGlzLmhvb2sud2l0aFByaW50UXVlcnkobXFMaXN0KSlcbiAgICAgICAgLnBpcGUoXG4gICAgICAgICAgICBmaWx0ZXIoKGNoYW5nZTogTWVkaWFDaGFuZ2UpID0+IGNoYW5nZS5tYXRjaGVzKSxcbiAgICAgICAgICAgIGRlYm91bmNlVGltZSgwLCBhc2FwU2NoZWR1bGVyKSxcbiAgICAgICAgICAgIHN3aXRjaE1hcChfID0+IG9mKHRoaXMuZmluZEFsbEFjdGl2YXRpb25zKCkpKSxcbiAgICAgICAgICAgIG1hcChleGNsdWRlT3ZlcmxhcHMpLFxuICAgICAgICAgICAgZmlsdGVyKGhhc0NoYW5nZXMpLFxuICAgICAgICAgICAgZGlzdGluY3RVbnRpbENoYW5nZWQoaWdub3JlRHVwbGljYXRlcyksXG4gICAgICAgICAgICB0YWtlVW50aWwodGhpcy5kZXN0cm95ZWQkKVxuICAgICAgICApO1xuICB9XG5cbiAgLyoqXG4gICAqIEZpbmQgYWxsIGN1cnJlbnQgYWN0aXZhdGlvbnMgYW5kIHByZXBhcmUgc2luZ2xlIGxpc3Qgb2YgYWN0aXZhdGlvbnNcbiAgICogc29ydGVkIGJ5IGRlc2NlbmRpbmcgcHJpb3JpdHkuXG4gICAqL1xuICBwcml2YXRlIGZpbmRBbGxBY3RpdmF0aW9ucygpOiBNZWRpYUNoYW5nZVtdIHtcbiAgICBjb25zdCBtZXJnZU1RQWxpYXMgPSAoY2hhbmdlOiBNZWRpYUNoYW5nZSkgPT4ge1xuICAgICAgY29uc3QgYnA6IE9wdGlvbmFsQnJlYWtQb2ludCA9IHRoaXMuYnJlYWtwb2ludHMuZmluZEJ5UXVlcnkoY2hhbmdlLm1lZGlhUXVlcnkpO1xuICAgICAgcmV0dXJuIG1lcmdlQWxpYXMoY2hhbmdlLCBicCk7XG4gICAgfTtcbiAgICBjb25zdCByZXBsYWNlV2l0aFByaW50QWxpYXMgPSAoY2hhbmdlOiBNZWRpYUNoYW5nZSkgPT5cbiAgICAgIHRoaXMuaG9vay5pc1ByaW50RXZlbnQoY2hhbmdlKSA/IHRoaXMuaG9vay51cGRhdGVFdmVudChjaGFuZ2UpIDogY2hhbmdlO1xuXG4gICAgcmV0dXJuIHRoaXMubWF0Y2hNZWRpYVxuICAgICAgICAuYWN0aXZhdGlvbnNcbiAgICAgICAgLm1hcChxdWVyeSA9PiBuZXcgTWVkaWFDaGFuZ2UodHJ1ZSwgcXVlcnkpKVxuICAgICAgICAubWFwKHJlcGxhY2VXaXRoUHJpbnRBbGlhcylcbiAgICAgICAgLm1hcChtZXJnZU1RQWxpYXMpXG4gICAgICAgIC5zb3J0KHNvcnREZXNjZW5kaW5nUHJpb3JpdHkpO1xuICB9XG5cbiAgcHJpdmF0ZSByZWFkb25seSBfbWVkaWEkOiBPYnNlcnZhYmxlPE1lZGlhQ2hhbmdlW10+O1xuICBwcml2YXRlIHJlYWRvbmx5IGRlc3Ryb3llZCQgPSBuZXcgU3ViamVjdDx2b2lkPigpO1xufVxuXG4vKipcbiAqIEZpbmQgYXNzb2NpYXRlZCBicmVha3BvaW50IChpZiBhbnkpXG4gKi9cbmZ1bmN0aW9uIHRvTWVkaWFRdWVyeShxdWVyeTogc3RyaW5nLCBsb2NhdG9yOiBCcmVha1BvaW50UmVnaXN0cnkpOiBzdHJpbmcgfCBudWxsIHtcbiAgY29uc3QgYnAgPSBsb2NhdG9yLmZpbmRCeUFsaWFzKHF1ZXJ5KSA/PyBsb2NhdG9yLmZpbmRCeVF1ZXJ5KHF1ZXJ5KTtcbiAgcmV0dXJuIGJwPy5tZWRpYVF1ZXJ5ID8/IG51bGw7XG59XG5cbi8qKlxuICogU3BsaXQgZWFjaCBxdWVyeSBzdHJpbmcgaW50byBzZXBhcmF0ZSBxdWVyeSBzdHJpbmdzIGlmIHR3byBxdWVyaWVzIGFyZSBwcm92aWRlZCBhcyBjb21tYVxuICogc2VwYXJhdGVkLlxuICovXG5mdW5jdGlvbiBzcGxpdFF1ZXJpZXMocXVlcmllczogc3RyaW5nW10pOiBzdHJpbmdbXSB7XG4gIHJldHVybiBxdWVyaWVzLmZsYXRNYXAocXVlcnkgPT4gcXVlcnkuc3BsaXQoJywnKSlcbiAgICAubWFwKHF1ZXJ5ID0+IHF1ZXJ5LnRyaW0oKSk7XG59XG4iXX0=