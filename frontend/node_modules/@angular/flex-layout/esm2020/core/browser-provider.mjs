/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { APP_BOOTSTRAP_LISTENER, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
/**
 * Find all of the server-generated stylings, if any, and remove them
 * This will be in the form of inline classes and the style block in the
 * head of the DOM
 */
export function removeStyles(_document, platformId) {
    return () => {
        if (isPlatformBrowser(platformId)) {
            const elements = Array.from(_document.querySelectorAll(`[class*=${CLASS_NAME}]`));
            // RegExp constructor should only be used if passing a variable to the constructor.
            // When using static regular expression it is more performant to use reg exp literal.
            // This is also needed to provide Safari 9 compatibility, please see
            // https://stackoverflow.com/questions/37919802 for more discussion.
            const classRegex = /\bflex-layout-.+?\b/g;
            elements.forEach(el => {
                el.classList.contains(`${CLASS_NAME}ssr`) && el.parentNode ?
                    el.parentNode.removeChild(el) : el.className.replace(classRegex, '');
            });
        }
    };
}
/**
 *  Provider to remove SSR styles on the browser
 */
export const BROWSER_PROVIDER = {
    provide: APP_BOOTSTRAP_LISTENER,
    useFactory: removeStyles,
    deps: [DOCUMENT, PLATFORM_ID],
    multi: true
};
export const CLASS_NAME = 'flex-layout-';
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJvd3Nlci1wcm92aWRlci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uL3Byb2plY3RzL2xpYnMvZmxleC1sYXlvdXQvY29yZS9icm93c2VyLXByb3ZpZGVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUNILE9BQU8sRUFBQyxzQkFBc0IsRUFBRSxXQUFXLEVBQWlCLE1BQU0sZUFBZSxDQUFDO0FBQ2xGLE9BQU8sRUFBQyxRQUFRLEVBQUUsaUJBQWlCLEVBQUMsTUFBTSxpQkFBaUIsQ0FBQztBQUU1RDs7OztHQUlHO0FBQ0gsTUFBTSxVQUFVLFlBQVksQ0FBQyxTQUFtQixFQUFFLFVBQWtCO0lBQ2xFLE9BQU8sR0FBRyxFQUFFO1FBQ1YsSUFBSSxpQkFBaUIsQ0FBQyxVQUFVLENBQUMsRUFBRTtZQUNqQyxNQUFNLFFBQVEsR0FBRyxLQUFLLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxnQkFBZ0IsQ0FBQyxXQUFXLFVBQVUsR0FBRyxDQUFDLENBQUMsQ0FBQztZQUVsRixtRkFBbUY7WUFDbkYscUZBQXFGO1lBQ3JGLG9FQUFvRTtZQUNwRSxvRUFBb0U7WUFDcEUsTUFBTSxVQUFVLEdBQUcsc0JBQXNCLENBQUM7WUFDMUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxFQUFFLENBQUMsRUFBRTtnQkFDcEIsRUFBRSxDQUFDLFNBQVMsQ0FBQyxRQUFRLENBQUMsR0FBRyxVQUFVLEtBQUssQ0FBQyxJQUFJLEVBQUUsQ0FBQyxVQUFVLENBQUMsQ0FBQztvQkFDMUQsRUFBRSxDQUFDLFVBQVUsQ0FBQyxXQUFXLENBQUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLFVBQVUsRUFBRSxFQUFFLENBQUMsQ0FBQztZQUN6RSxDQUFDLENBQUMsQ0FBQztTQUNKO0lBQ0gsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQUVEOztHQUVHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sZ0JBQWdCLEdBQUc7SUFDOUIsT0FBTyxFQUFrQyxzQkFBc0I7SUFDL0QsVUFBVSxFQUFFLFlBQVk7SUFDeEIsSUFBSSxFQUFFLENBQUMsUUFBUSxFQUFFLFdBQVcsQ0FBQztJQUM3QixLQUFLLEVBQUUsSUFBSTtDQUNaLENBQUM7QUFFRixNQUFNLENBQUMsTUFBTSxVQUFVLEdBQUcsY0FBYyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge0FQUF9CT09UU1RSQVBfTElTVEVORVIsIFBMQVRGT1JNX0lELCBJbmplY3Rpb25Ub2tlbn0gZnJvbSAnQGFuZ3VsYXIvY29yZSc7XG5pbXBvcnQge0RPQ1VNRU5ULCBpc1BsYXRmb3JtQnJvd3Nlcn0gZnJvbSAnQGFuZ3VsYXIvY29tbW9uJztcblxuLyoqXG4gKiBGaW5kIGFsbCBvZiB0aGUgc2VydmVyLWdlbmVyYXRlZCBzdHlsaW5ncywgaWYgYW55LCBhbmQgcmVtb3ZlIHRoZW1cbiAqIFRoaXMgd2lsbCBiZSBpbiB0aGUgZm9ybSBvZiBpbmxpbmUgY2xhc3NlcyBhbmQgdGhlIHN0eWxlIGJsb2NrIGluIHRoZVxuICogaGVhZCBvZiB0aGUgRE9NXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiByZW1vdmVTdHlsZXMoX2RvY3VtZW50OiBEb2N1bWVudCwgcGxhdGZvcm1JZDogT2JqZWN0KSB7XG4gIHJldHVybiAoKSA9PiB7XG4gICAgaWYgKGlzUGxhdGZvcm1Ccm93c2VyKHBsYXRmb3JtSWQpKSB7XG4gICAgICBjb25zdCBlbGVtZW50cyA9IEFycmF5LmZyb20oX2RvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYFtjbGFzcyo9JHtDTEFTU19OQU1FfV1gKSk7XG5cbiAgICAgIC8vIFJlZ0V4cCBjb25zdHJ1Y3RvciBzaG91bGQgb25seSBiZSB1c2VkIGlmIHBhc3NpbmcgYSB2YXJpYWJsZSB0byB0aGUgY29uc3RydWN0b3IuXG4gICAgICAvLyBXaGVuIHVzaW5nIHN0YXRpYyByZWd1bGFyIGV4cHJlc3Npb24gaXQgaXMgbW9yZSBwZXJmb3JtYW50IHRvIHVzZSByZWcgZXhwIGxpdGVyYWwuXG4gICAgICAvLyBUaGlzIGlzIGFsc28gbmVlZGVkIHRvIHByb3ZpZGUgU2FmYXJpIDkgY29tcGF0aWJpbGl0eSwgcGxlYXNlIHNlZVxuICAgICAgLy8gaHR0cHM6Ly9zdGFja292ZXJmbG93LmNvbS9xdWVzdGlvbnMvMzc5MTk4MDIgZm9yIG1vcmUgZGlzY3Vzc2lvbi5cbiAgICAgIGNvbnN0IGNsYXNzUmVnZXggPSAvXFxiZmxleC1sYXlvdXQtLis/XFxiL2c7XG4gICAgICBlbGVtZW50cy5mb3JFYWNoKGVsID0+IHtcbiAgICAgICAgZWwuY2xhc3NMaXN0LmNvbnRhaW5zKGAke0NMQVNTX05BTUV9c3NyYCkgJiYgZWwucGFyZW50Tm9kZSA/XG4gICAgICAgICAgZWwucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChlbCkgOiBlbC5jbGFzc05hbWUucmVwbGFjZShjbGFzc1JlZ2V4LCAnJyk7XG4gICAgICB9KTtcbiAgICB9XG4gIH07XG59XG5cbi8qKlxuICogIFByb3ZpZGVyIHRvIHJlbW92ZSBTU1Igc3R5bGVzIG9uIHRoZSBicm93c2VyXG4gKi9cbmV4cG9ydCBjb25zdCBCUk9XU0VSX1BST1ZJREVSID0ge1xuICBwcm92aWRlOiA8SW5qZWN0aW9uVG9rZW48KCgpID0+IHZvaWQpW10+PkFQUF9CT09UU1RSQVBfTElTVEVORVIsXG4gIHVzZUZhY3Rvcnk6IHJlbW92ZVN0eWxlcyxcbiAgZGVwczogW0RPQ1VNRU5ULCBQTEFURk9STV9JRF0sXG4gIG11bHRpOiB0cnVlXG59O1xuXG5leHBvcnQgY29uc3QgQ0xBU1NfTkFNRSA9ICdmbGV4LWxheW91dC0nO1xuIl19