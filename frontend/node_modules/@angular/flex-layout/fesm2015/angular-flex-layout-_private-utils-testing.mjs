import { extendObject, applyCssPrefixes } from '@angular/flex-layout/_private-utils';
import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
/**
 * Exported DOM accessor utility functions
 */
const _dom = {
    hasStyle,
    getDistributedNodes,
    getShadowRoot,
    getText,
    getStyle,
    childNodes,
    childNodesAsList,
    hasClass,
    hasAttribute,
    getAttribute,
    hasShadowRoot,
    isCommentNode,
    isElementNode,
    isPresent,
    isShadowRoot,
    tagName,
    lastElementChild
};
// ******************************************************************************************
// These functions are cloned from
//  *  @angular/platform-browser/src/browser/GenericBrowserDomAdapter
// and are to be used ONLY internally in custom-matchers.ts and Unit Tests
// ******************************************************************************************
function getStyle(element, stylename) {
    return element.style[stylename];
}
function hasStyle(element, styleName, styleValue = '', inlineOnly = true) {
    let value = getStyle(element, styleName) || '';
    if (!value && !inlineOnly) {
        // Search stylesheets
        value = typeof getComputedStyle === 'function' &&
            getComputedStyle(element).getPropertyValue(styleName) || '';
    }
    return styleValue ? value == styleValue : value.length > 0;
}
function getDistributedNodes(el) {
    return el.getDistributedNodes();
}
function getShadowRoot(el) {
    return el.shadowRoot;
}
function getText(el) {
    return el.textContent || '';
}
function childNodesAsList(el) {
    const list = el.childNodes;
    const res = new Array(list.length);
    for (let i = 0; i < list.length; i++) {
        res[i] = list[i];
    }
    return res;
}
function hasClass(element, className) {
    return element.classList.contains(className);
}
function hasAttribute(element, attributeName) {
    return element.hasAttribute(attributeName);
}
function getAttribute(element, attributeName) {
    return element.getAttribute(attributeName);
}
function childNodes(el) {
    return el.childNodes;
}
function hasShadowRoot(node) {
    return isPresent(node.shadowRoot) && node instanceof HTMLElement;
}
function isCommentNode(node) {
    return node.nodeType === Node.COMMENT_NODE;
}
function isElementNode(node) {
    return node.nodeType === Node.ELEMENT_NODE;
}
function isShadowRoot(node) {
    return node instanceof DocumentFragment;
}
function isPresent(obj) {
    return obj != null;
}
function tagName(element) {
    return element.tagName;
}
// ******************************************************************************************
// These functions are part of the DOM API
// and are to be used ONLY internally in custom-matchers.ts and Unit Tests
// ******************************************************************************************
function lastElementChild(element) {
    return element.lastElementChild;
}

const _global = (typeof window === 'undefined' ? global : window);
const expect$1 = _global.expect;
/**
 * NOTE: These custom JASMINE Matchers are used only
 *       in the Karma/Jasmine testing for the Layout Directives
 *       in `src/lib/flex/api`
 */
const customMatchers = {
    toEqual: function (util) {
        return {
            compare: function (actual, expected) {
                return { pass: util.equals(actual, expected) };
            }
        };
    },
    toHaveText: function () {
        return {
            compare: function (actual, expectedText) {
                const actualText = elementText(actual);
                return {
                    pass: actualText == expectedText,
                    get message() {
                        return 'Expected ' + actualText + ' to be equal to ' + expectedText;
                    }
                };
            }
        };
    },
    toHaveCssClass: function () {
        return { compare: buildError(false), negativeCompare: buildError(true) };
        function buildError(isNot) {
            return function (actual, className) {
                return {
                    pass: _dom.hasClass(actual, className) == !isNot,
                    get message() {
                        return `
              Expected ${actual.outerHTML} ${isNot ? 'not ' : ''}
              to contain the CSS class '${className}'
            `;
                    }
                };
            };
        }
    },
    toHaveMap: function () {
        return {
            compare: function (actual, map) {
                let allPassed;
                allPassed = Object.keys(map).length !== 0;
                Object.keys(map).forEach(key => {
                    allPassed = allPassed && (actual[key] === map[key]);
                });
                return {
                    pass: allPassed,
                    get message() {
                        return `
              Expected ${JSON.stringify(actual)} ${!allPassed ? ' ' : 'not '} to contain the
              '${JSON.stringify(map)}'
            `;
                    }
                };
            }
        };
    },
    toHaveAttributes: function () {
        return {
            compare: function (actual, map) {
                let allPassed;
                let attributeNames = Object.keys(map);
                allPassed = attributeNames.length !== 0;
                attributeNames.forEach(name => {
                    allPassed = allPassed && _dom.hasAttribute(actual, name)
                        && _dom.getAttribute(actual, name) === map[name];
                });
                return {
                    pass: allPassed,
                    get message() {
                        return `
              Expected ${actual.outerHTML} ${allPassed ? 'not ' : ''} attributes to contain
              '${JSON.stringify(map)}'
            `;
                    }
                };
            }
        };
    },
    /**
     * Check element's inline styles only
     */
    toHaveStyle: function () {
        return {
            compare: buildCompareStyleFunction(true)
        };
    },
    /**
     * Check element's css stylesheet only (if not present inline)
     */
    toHaveCSS: function () {
        return {
            compare: buildCompareStyleFunction(false)
        };
    }
};
/**
 * Curried value to function to check styles that are inline or in a stylesheet for the
 * specified DOM element.
 */
function buildCompareStyleFunction(inlineOnly = true) {
    return function (actual, styles, styler) {
        const found = {};
        const styleMap = {};
        if (typeof styles === 'string') {
            styleMap[styles] = '';
        }
        else {
            Object.assign(styleMap, styles);
        }
        let allPassed = Object.keys(styleMap).length !== 0;
        Object.keys(styleMap).forEach(prop => {
            let { elHasStyle, current } = hasPrefixedStyles(actual, prop, styleMap[prop], inlineOnly, styler);
            allPassed = allPassed && elHasStyle;
            if (!elHasStyle) {
                extendObject(found, current);
            }
        });
        return {
            pass: allPassed,
            get message() {
                const expectedValueStr = (typeof styles === 'string') ? styleMap :
                    JSON.stringify(styleMap, null, 2);
                const foundValueStr = inlineOnly ? actual.outerHTML : JSON.stringify(found);
                return `
          Expected ${foundValueStr}${!allPassed ? '' : ' not'} to contain the
          CSS ${typeof styles === 'string' ? 'property' : 'styles'} '${expectedValueStr}'
        `;
            }
        };
    };
}
/**
 * Validate presence of requested style or use fallback
 * to possible `prefixed` styles. Useful when some browsers
 * (Safari, IE, etc) will use prefixed style instead of defaults.
 */
function hasPrefixedStyles(actual, key, value, inlineOnly, styler) {
    const current = {};
    if (value === '*') {
        return { elHasStyle: styler.lookupStyle(actual, key, inlineOnly) !== '', current };
    }
    value = value.trim();
    let elHasStyle = styler.lookupStyle(actual, key, inlineOnly) === value;
    if (!elHasStyle) {
        let prefixedStyles = applyCssPrefixes({ [key]: value });
        Object.keys(prefixedStyles).forEach(prop => {
            // Search for optional prefixed values
            elHasStyle = elHasStyle ||
                styler.lookupStyle(actual, prop, inlineOnly) === prefixedStyles[prop];
        });
    }
    // Return BOTH confirmation and current computed key values (if confirmation == false)
    return { elHasStyle, current };
}
function elementText(n) {
    const hasNodes = (m) => {
        const children = _dom.childNodes(m);
        return children && children['length'];
    };
    if (n instanceof Array) {
        return n.map(elementText).join('');
    }
    if (_dom.isCommentNode(n)) {
        return '';
    }
    if (_dom.isElementNode(n) && _dom.tagName(n) == 'CONTENT') {
        return elementText(Array.prototype.slice.apply(_dom.getDistributedNodes(n)));
    }
    if (_dom.hasShadowRoot(n)) {
        return elementText(_dom.childNodesAsList(_dom.getShadowRoot(n)));
    }
    if (hasNodes(n)) {
        return elementText(_dom.childNodesAsList(n));
    }
    return _dom.getText(n);
}

/**
 * Function generator that captures a Component Type accessor and enables
 * `createTestComponent()` to be reusable for *any* captured Component class.
 */
function makeCreateTestComponent(getClass) {
    let componentAny;
    // Return actual `createTestComponent()` function
    return function createTestComponent(template, styles) {
        if (!componentAny) {
            // Defer access to Component class to enable metadata to be configured properly...
            componentAny = getClass();
        }
        return TestBed
            .overrideComponent(componentAny, {
            set: {
                template: template,
                styles: styles || [],
            }
        })
            .createComponent(componentAny);
    };
}
/**
 *
 */
function expectNativeEl(fixture, instanceOptions) {
    extendObject(fixture.componentInstance, instanceOptions || {});
    fixture.detectChanges();
    return expect(fixture.debugElement.children[0].nativeElement);
}
/**
 *
 */
function expectEl(debugEl) {
    return expect(debugEl.nativeElement);
}
function queryFor(fixture, selector) {
    return fixture.debugElement.queryAll(By.css(selector));
}

/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

/**
 * Generated bundle index. Do not edit.
 */

export { _dom, customMatchers, expect$1 as expect, expectEl, expectNativeEl, makeCreateTestComponent, queryFor };
//# sourceMappingURL=angular-flex-layout-_private-utils-testing.mjs.map
