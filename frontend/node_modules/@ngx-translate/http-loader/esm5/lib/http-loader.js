/**
 * @fileoverview added by tsickle
 * @suppress {checkTypes,extraRequire,missingReturn,uselessCode} checked by tsc
 */
var TranslateHttpLoader = /** @class */ (function () {
    function TranslateHttpLoader(http, prefix, suffix) {
        if (prefix === void 0) { prefix = "/assets/i18n/"; }
        if (suffix === void 0) { suffix = ".json"; }
        this.http = http;
        this.prefix = prefix;
        this.suffix = suffix;
    }
    /**
     * Gets the translations from the server
     */
    /**
     * Gets the translations from the server
     * @param {?} lang
     * @return {?}
     */
    TranslateHttpLoader.prototype.getTranslation = /**
     * Gets the translations from the server
     * @param {?} lang
     * @return {?}
     */
    function (lang) {
        return this.http.get("" + this.prefix + lang + this.suffix);
    };
    return TranslateHttpLoader;
}());
export { TranslateHttpLoader };
if (false) {
    /** @type {?} */
    TranslateHttpLoader.prototype.http;
    /** @type {?} */
    TranslateHttpLoader.prototype.prefix;
    /** @type {?} */
    TranslateHttpLoader.prototype.suffix;
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaHR0cC1sb2FkZXIuanMiLCJzb3VyY2VSb290Ijoibmc6Ly9Abmd4LXRyYW5zbGF0ZS9odHRwLWxvYWRlci8iLCJzb3VyY2VzIjpbImxpYi9odHRwLWxvYWRlci50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7O0FBSUE7SUFDRSw2QkFBb0IsSUFBZ0IsRUFBUyxNQUFnQyxFQUFTLE1BQXdCO1FBQWpFLHVCQUFBLEVBQUEsd0JBQWdDO1FBQVMsdUJBQUEsRUFBQSxnQkFBd0I7UUFBMUYsU0FBSSxHQUFKLElBQUksQ0FBWTtRQUFTLFdBQU0sR0FBTixNQUFNLENBQTBCO1FBQVMsV0FBTSxHQUFOLE1BQU0sQ0FBa0I7SUFBRyxDQUFDO0lBRWxIOztPQUVHOzs7Ozs7SUFDSSw0Q0FBYzs7Ozs7SUFBckIsVUFBc0IsSUFBWTtRQUNoQyxPQUFPLElBQUksQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEtBQUcsSUFBSSxDQUFDLE1BQU0sR0FBRyxJQUFJLEdBQUcsSUFBSSxDQUFDLE1BQVEsQ0FBQyxDQUFDO0lBQzlELENBQUM7SUFDSCwwQkFBQztBQUFELENBQUMsQUFURCxJQVNDOzs7O0lBUmEsbUNBQXdCOztJQUFFLHFDQUF1Qzs7SUFBRSxxQ0FBK0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0h0dHBDbGllbnR9IGZyb20gXCJAYW5ndWxhci9jb21tb24vaHR0cFwiO1xuaW1wb3J0IHtUcmFuc2xhdGVMb2FkZXJ9IGZyb20gXCJAbmd4LXRyYW5zbGF0ZS9jb3JlXCI7XG5pbXBvcnQge09ic2VydmFibGV9IGZyb20gJ3J4anMnO1xuXG5leHBvcnQgY2xhc3MgVHJhbnNsYXRlSHR0cExvYWRlciBpbXBsZW1lbnRzIFRyYW5zbGF0ZUxvYWRlciB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgaHR0cDogSHR0cENsaWVudCwgcHVibGljIHByZWZpeDogc3RyaW5nID0gXCIvYXNzZXRzL2kxOG4vXCIsIHB1YmxpYyBzdWZmaXg6IHN0cmluZyA9IFwiLmpzb25cIikge31cblxuICAvKipcbiAgICogR2V0cyB0aGUgdHJhbnNsYXRpb25zIGZyb20gdGhlIHNlcnZlclxuICAgKi9cbiAgcHVibGljIGdldFRyYW5zbGF0aW9uKGxhbmc6IHN0cmluZyk6IE9ic2VydmFibGU8T2JqZWN0PiB7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQoYCR7dGhpcy5wcmVmaXh9JHtsYW5nfSR7dGhpcy5zdWZmaXh9YCk7XG4gIH1cbn1cbiJdfQ==