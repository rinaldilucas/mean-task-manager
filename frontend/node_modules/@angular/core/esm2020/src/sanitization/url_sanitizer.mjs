/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * A pattern that recognizes a commonly useful subset of URLs that are safe.
 *
 * This regular expression matches a subset of URLs that will not cause script
 * execution if used in URL context within a HTML document. Specifically, this
 * regular expression matches if (comment from here on and regex copied from
 * Soy's EscapingConventions):
 * (1) Either an allowed protocol (http, https, mailto or ftp).
 * (2) or no protocol.  A protocol must be followed by a colon. The below
 *     allows that by allowing colons only after one of the characters [/?#].
 *     A colon after a hash (#) must be in the fragment.
 *     Otherwise, a colon after a (?) must be in a query.
 *     Otherwise, a colon after a single solidus (/) must be in a path.
 *     Otherwise, a colon after a double solidus (//) must be in the authority
 *     (before port).
 *
 * The pattern disallows &, used in HTML entity declarations before
 * one of the characters in [/?#]. This disallows HTML entities used in the
 * protocol name, which should never happen, e.g. "h&#116;tp" for "http".
 * It also disallows HTML entities in the first path part of a relative path,
 * e.g. "foo&lt;bar/baz".  Our existing escaping functions should not produce
 * that. More importantly, it disallows masking of a colon,
 * e.g. "javascript&#58;...".
 *
 * This regular expression was taken from the Closure sanitization library.
 */
const SAFE_URL_PATTERN = /^(?:(?:https?|mailto|data|ftp|tel|file|sms):|[^&:/?#]*(?:[/?#]|$))/gi;
export function _sanitizeUrl(url) {
    url = String(url);
    if (url.match(SAFE_URL_PATTERN))
        return url;
    if (typeof ngDevMode === 'undefined' || ngDevMode) {
        console.warn(`WARNING: sanitizing unsafe URL value ${url} (see https://g.co/ng/security#xss)`);
    }
    return 'unsafe:' + url;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoidXJsX3Nhbml0aXplci5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzIjpbIi4uLy4uLy4uLy4uLy4uLy4uLy4uL3BhY2thZ2VzL2NvcmUvc3JjL3Nhbml0aXphdGlvbi91cmxfc2FuaXRpemVyLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOzs7Ozs7R0FNRztBQUdIOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBeUJHO0FBQ0gsTUFBTSxnQkFBZ0IsR0FBRyxzRUFBc0UsQ0FBQztBQUVoRyxNQUFNLFVBQVUsWUFBWSxDQUFDLEdBQVc7SUFDdEMsR0FBRyxHQUFHLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQztJQUNsQixJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsZ0JBQWdCLENBQUM7UUFBRSxPQUFPLEdBQUcsQ0FBQztJQUU1QyxJQUFJLE9BQU8sU0FBUyxLQUFLLFdBQVcsSUFBSSxTQUFTLEVBQUU7UUFDakQsT0FBTyxDQUFDLElBQUksQ0FBQyx3Q0FBd0MsR0FBRyxxQ0FBcUMsQ0FBQyxDQUFDO0tBQ2hHO0lBRUQsT0FBTyxTQUFTLEdBQUcsR0FBRyxDQUFDO0FBQ3pCLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cblxuXG4vKipcbiAqIEEgcGF0dGVybiB0aGF0IHJlY29nbml6ZXMgYSBjb21tb25seSB1c2VmdWwgc3Vic2V0IG9mIFVSTHMgdGhhdCBhcmUgc2FmZS5cbiAqXG4gKiBUaGlzIHJlZ3VsYXIgZXhwcmVzc2lvbiBtYXRjaGVzIGEgc3Vic2V0IG9mIFVSTHMgdGhhdCB3aWxsIG5vdCBjYXVzZSBzY3JpcHRcbiAqIGV4ZWN1dGlvbiBpZiB1c2VkIGluIFVSTCBjb250ZXh0IHdpdGhpbiBhIEhUTUwgZG9jdW1lbnQuIFNwZWNpZmljYWxseSwgdGhpc1xuICogcmVndWxhciBleHByZXNzaW9uIG1hdGNoZXMgaWYgKGNvbW1lbnQgZnJvbSBoZXJlIG9uIGFuZCByZWdleCBjb3BpZWQgZnJvbVxuICogU295J3MgRXNjYXBpbmdDb252ZW50aW9ucyk6XG4gKiAoMSkgRWl0aGVyIGFuIGFsbG93ZWQgcHJvdG9jb2wgKGh0dHAsIGh0dHBzLCBtYWlsdG8gb3IgZnRwKS5cbiAqICgyKSBvciBubyBwcm90b2NvbC4gIEEgcHJvdG9jb2wgbXVzdCBiZSBmb2xsb3dlZCBieSBhIGNvbG9uLiBUaGUgYmVsb3dcbiAqICAgICBhbGxvd3MgdGhhdCBieSBhbGxvd2luZyBjb2xvbnMgb25seSBhZnRlciBvbmUgb2YgdGhlIGNoYXJhY3RlcnMgWy8/I10uXG4gKiAgICAgQSBjb2xvbiBhZnRlciBhIGhhc2ggKCMpIG11c3QgYmUgaW4gdGhlIGZyYWdtZW50LlxuICogICAgIE90aGVyd2lzZSwgYSBjb2xvbiBhZnRlciBhICg/KSBtdXN0IGJlIGluIGEgcXVlcnkuXG4gKiAgICAgT3RoZXJ3aXNlLCBhIGNvbG9uIGFmdGVyIGEgc2luZ2xlIHNvbGlkdXMgKC8pIG11c3QgYmUgaW4gYSBwYXRoLlxuICogICAgIE90aGVyd2lzZSwgYSBjb2xvbiBhZnRlciBhIGRvdWJsZSBzb2xpZHVzICgvLykgbXVzdCBiZSBpbiB0aGUgYXV0aG9yaXR5XG4gKiAgICAgKGJlZm9yZSBwb3J0KS5cbiAqXG4gKiBUaGUgcGF0dGVybiBkaXNhbGxvd3MgJiwgdXNlZCBpbiBIVE1MIGVudGl0eSBkZWNsYXJhdGlvbnMgYmVmb3JlXG4gKiBvbmUgb2YgdGhlIGNoYXJhY3RlcnMgaW4gWy8/I10uIFRoaXMgZGlzYWxsb3dzIEhUTUwgZW50aXRpZXMgdXNlZCBpbiB0aGVcbiAqIHByb3RvY29sIG5hbWUsIHdoaWNoIHNob3VsZCBuZXZlciBoYXBwZW4sIGUuZy4gXCJoJiMxMTY7dHBcIiBmb3IgXCJodHRwXCIuXG4gKiBJdCBhbHNvIGRpc2FsbG93cyBIVE1MIGVudGl0aWVzIGluIHRoZSBmaXJzdCBwYXRoIHBhcnQgb2YgYSByZWxhdGl2ZSBwYXRoLFxuICogZS5nLiBcImZvbyZsdDtiYXIvYmF6XCIuICBPdXIgZXhpc3RpbmcgZXNjYXBpbmcgZnVuY3Rpb25zIHNob3VsZCBub3QgcHJvZHVjZVxuICogdGhhdC4gTW9yZSBpbXBvcnRhbnRseSwgaXQgZGlzYWxsb3dzIG1hc2tpbmcgb2YgYSBjb2xvbixcbiAqIGUuZy4gXCJqYXZhc2NyaXB0JiM1ODsuLi5cIi5cbiAqXG4gKiBUaGlzIHJlZ3VsYXIgZXhwcmVzc2lvbiB3YXMgdGFrZW4gZnJvbSB0aGUgQ2xvc3VyZSBzYW5pdGl6YXRpb24gbGlicmFyeS5cbiAqL1xuY29uc3QgU0FGRV9VUkxfUEFUVEVSTiA9IC9eKD86KD86aHR0cHM/fG1haWx0b3xkYXRhfGZ0cHx0ZWx8ZmlsZXxzbXMpOnxbXiY6Lz8jXSooPzpbLz8jXXwkKSkvZ2k7XG5cbmV4cG9ydCBmdW5jdGlvbiBfc2FuaXRpemVVcmwodXJsOiBzdHJpbmcpOiBzdHJpbmcge1xuICB1cmwgPSBTdHJpbmcodXJsKTtcbiAgaWYgKHVybC5tYXRjaChTQUZFX1VSTF9QQVRURVJOKSkgcmV0dXJuIHVybDtcblxuICBpZiAodHlwZW9mIG5nRGV2TW9kZSA9PT0gJ3VuZGVmaW5lZCcgfHwgbmdEZXZNb2RlKSB7XG4gICAgY29uc29sZS53YXJuKGBXQVJOSU5HOiBzYW5pdGl6aW5nIHVuc2FmZSBVUkwgdmFsdWUgJHt1cmx9IChzZWUgaHR0cHM6Ly9nLmNvL25nL3NlY3VyaXR5I3hzcylgKTtcbiAgfVxuXG4gIHJldHVybiAndW5zYWZlOicgKyB1cmw7XG59XG4iXX0=