(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
    typeof define === 'function' && define.amd ? define('@ngx-translate/http-loader', ['exports'], factory) :
    (factory((global['ngx-translate'] = global['ngx-translate'] || {}, global['ngx-translate']['http-loader'] = {})));
}(this, (function (exports) { 'use strict';

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingReturn,uselessCode} checked by tsc
     */
    var TranslateHttpLoader = /** @class */ (function () {
        function TranslateHttpLoader(http, prefix, suffix) {
            if (prefix === void 0) {
                prefix = "/assets/i18n/";
            }
            if (suffix === void 0) {
                suffix = ".json";
            }
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

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingReturn,uselessCode} checked by tsc
     */

    /**
     * @fileoverview added by tsickle
     * @suppress {checkTypes,extraRequire,missingReturn,uselessCode} checked by tsc
     */

    exports.TranslateHttpLoader = TranslateHttpLoader;

    Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibmd4LXRyYW5zbGF0ZS1odHRwLWxvYWRlci51bWQuanMubWFwIiwic291cmNlcyI6WyJuZzovL0BuZ3gtdHJhbnNsYXRlL2h0dHAtbG9hZGVyL2xpYi9odHRwLWxvYWRlci50cyJdLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQge0h0dHBDbGllbnR9IGZyb20gXCJAYW5ndWxhci9jb21tb24vaHR0cFwiO1xuaW1wb3J0IHtUcmFuc2xhdGVMb2FkZXJ9IGZyb20gXCJAbmd4LXRyYW5zbGF0ZS9jb3JlXCI7XG5pbXBvcnQge09ic2VydmFibGV9IGZyb20gJ3J4anMnO1xuXG5leHBvcnQgY2xhc3MgVHJhbnNsYXRlSHR0cExvYWRlciBpbXBsZW1lbnRzIFRyYW5zbGF0ZUxvYWRlciB7XG4gIGNvbnN0cnVjdG9yKHByaXZhdGUgaHR0cDogSHR0cENsaWVudCwgcHVibGljIHByZWZpeDogc3RyaW5nID0gXCIvYXNzZXRzL2kxOG4vXCIsIHB1YmxpYyBzdWZmaXg6IHN0cmluZyA9IFwiLmpzb25cIikge31cblxuICAvKipcbiAgICogR2V0cyB0aGUgdHJhbnNsYXRpb25zIGZyb20gdGhlIHNlcnZlclxuICAgKi9cbiAgcHVibGljIGdldFRyYW5zbGF0aW9uKGxhbmc6IHN0cmluZyk6IE9ic2VydmFibGU8T2JqZWN0PiB7XG4gICAgcmV0dXJuIHRoaXMuaHR0cC5nZXQoYCR7dGhpcy5wcmVmaXh9JHtsYW5nfSR7dGhpcy5zdWZmaXh9YCk7XG4gIH1cbn1cbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBSUE7UUFDRSw2QkFBb0IsSUFBZ0IsRUFBUyxNQUFnQyxFQUFTLE1BQXdCO1lBQWpFLHVCQUFBO2dCQUFBLHdCQUFnQzs7WUFBUyx1QkFBQTtnQkFBQSxnQkFBd0I7O1lBQTFGLFNBQUksR0FBSixJQUFJLENBQVk7WUFBUyxXQUFNLEdBQU4sTUFBTSxDQUEwQjtZQUFTLFdBQU0sR0FBTixNQUFNLENBQWtCO1NBQUk7Ozs7Ozs7OztRQUszRyw0Q0FBYzs7Ozs7WUFBckIsVUFBc0IsSUFBWTtnQkFDaEMsT0FBTyxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFHLElBQUksQ0FBQyxNQUFNLEdBQUcsSUFBSSxHQUFHLElBQUksQ0FBQyxNQUFRLENBQUMsQ0FBQzthQUM3RDtRQUNILDBCQUFDO0lBQUQsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OzsifQ==