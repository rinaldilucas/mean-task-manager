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
export const _dom = {
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9tLXRvb2xzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbGlicy9mbGV4LWxheW91dC9fcHJpdmF0ZS11dGlscy90ZXN0aW5nL2RvbS10b29scy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSDs7R0FFRztBQUNILE1BQU0sQ0FBQyxNQUFNLElBQUksR0FBRztJQUNsQixRQUFRO0lBQ1IsbUJBQW1CO0lBQ25CLGFBQWE7SUFDYixPQUFPO0lBQ1AsUUFBUTtJQUNSLFVBQVU7SUFDVixnQkFBZ0I7SUFDaEIsUUFBUTtJQUNSLFlBQVk7SUFDWixZQUFZO0lBQ1osYUFBYTtJQUNiLGFBQWE7SUFDYixhQUFhO0lBQ2IsU0FBUztJQUNULFlBQVk7SUFDWixPQUFPO0lBQ1AsZ0JBQWdCO0NBQ2pCLENBQUM7QUFFRiw2RkFBNkY7QUFDN0Ysa0NBQWtDO0FBQ2xDLHFFQUFxRTtBQUNyRSwwRUFBMEU7QUFDMUUsNkZBQTZGO0FBRTdGLFNBQVMsUUFBUSxDQUFDLE9BQVksRUFBRSxTQUFpQjtJQUMvQyxPQUFPLE9BQU8sQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLENBQUM7QUFDbEMsQ0FBQztBQUVELFNBQVMsUUFBUSxDQUFDLE9BQVksRUFDWixTQUFpQixFQUNqQixhQUFxQixFQUFFLEVBQ3ZCLFVBQVUsR0FBRyxJQUFJO0lBQ2pDLElBQUksS0FBSyxHQUFHLFFBQVEsQ0FBQyxPQUFPLEVBQUUsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDO0lBQy9DLElBQUksQ0FBQyxLQUFLLElBQUksQ0FBQyxVQUFVLEVBQUU7UUFDekIscUJBQXFCO1FBQ3JCLEtBQUssR0FBRyxPQUFPLGdCQUFnQixLQUFLLFVBQVU7WUFDNUMsZ0JBQWdCLENBQUMsT0FBTyxDQUFDLENBQUMsZ0JBQWdCLENBQUMsU0FBUyxDQUFDLElBQUksRUFBRSxDQUFDO0tBQy9EO0lBQ0QsT0FBTyxVQUFVLENBQUMsQ0FBQyxDQUFDLEtBQUssSUFBSSxVQUFVLENBQUMsQ0FBQyxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDO0FBQzdELENBQUM7QUFFRCxTQUFTLG1CQUFtQixDQUFDLEVBQWU7SUFDMUMsT0FBYSxFQUFHLENBQUMsbUJBQW1CLEVBQUUsQ0FBQztBQUN6QyxDQUFDO0FBRUQsU0FBUyxhQUFhLENBQUMsRUFBZTtJQUNwQyxPQUFhLEVBQUcsQ0FBQyxVQUFVLENBQUM7QUFDOUIsQ0FBQztBQUVELFNBQVMsT0FBTyxDQUFDLEVBQVE7SUFDdkIsT0FBTyxFQUFFLENBQUMsV0FBVyxJQUFJLEVBQUUsQ0FBQztBQUM5QixDQUFDO0FBRUQsU0FBUyxnQkFBZ0IsQ0FBQyxFQUFRO0lBQ2hDLE1BQU0sSUFBSSxHQUFHLEVBQUUsQ0FBQyxVQUFVLENBQUM7SUFDM0IsTUFBTSxHQUFHLEdBQUcsSUFBSSxLQUFLLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0lBQ25DLEtBQUssSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxJQUFJLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFO1FBQ3BDLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUM7S0FDbEI7SUFDRCxPQUFPLEdBQUcsQ0FBQztBQUNiLENBQUM7QUFFRCxTQUFTLFFBQVEsQ0FBQyxPQUFZLEVBQUUsU0FBaUI7SUFDL0MsT0FBTyxPQUFPLENBQUMsU0FBUyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQztBQUMvQyxDQUFDO0FBRUQsU0FBUyxZQUFZLENBQUMsT0FBWSxFQUFFLGFBQXFCO0lBQ3ZELE9BQU8sT0FBTyxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUM3QyxDQUFDO0FBRUQsU0FBUyxZQUFZLENBQUMsT0FBWSxFQUFFLGFBQXFCO0lBQ3ZELE9BQU8sT0FBTyxDQUFDLFlBQVksQ0FBQyxhQUFhLENBQUMsQ0FBQztBQUM3QyxDQUFDO0FBRUQsU0FBUyxVQUFVLENBQUMsRUFBTztJQUN6QixPQUFPLEVBQUUsQ0FBQyxVQUFVLENBQUM7QUFDdkIsQ0FBQztBQUVELFNBQVMsYUFBYSxDQUFDLElBQVM7SUFDOUIsT0FBTyxTQUFTLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxJQUFJLElBQUksWUFBWSxXQUFXLENBQUM7QUFDbkUsQ0FBQztBQUVELFNBQVMsYUFBYSxDQUFDLElBQVU7SUFDL0IsT0FBTyxJQUFJLENBQUMsUUFBUSxLQUFLLElBQUksQ0FBQyxZQUFZLENBQUM7QUFDN0MsQ0FBQztBQUVELFNBQVMsYUFBYSxDQUFDLElBQVU7SUFDL0IsT0FBTyxJQUFJLENBQUMsUUFBUSxLQUFLLElBQUksQ0FBQyxZQUFZLENBQUM7QUFDN0MsQ0FBQztBQUVELFNBQVMsWUFBWSxDQUFDLElBQVM7SUFDN0IsT0FBTyxJQUFJLFlBQVksZ0JBQWdCLENBQUM7QUFDMUMsQ0FBQztBQUVELFNBQVMsU0FBUyxDQUFDLEdBQVE7SUFDekIsT0FBTyxHQUFHLElBQUksSUFBSSxDQUFDO0FBQ3JCLENBQUM7QUFFRCxTQUFTLE9BQU8sQ0FBQyxPQUFZO0lBQzNCLE9BQU8sT0FBTyxDQUFDLE9BQU8sQ0FBQztBQUN6QixDQUFDO0FBRUQsNkZBQTZGO0FBQzdGLDBDQUEwQztBQUMxQywwRUFBMEU7QUFDMUUsNkZBQTZGO0FBRTdGLFNBQVMsZ0JBQWdCLENBQUMsT0FBWTtJQUNwQyxPQUFPLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQztBQUNsQyxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbi8qKlxuICogRXhwb3J0ZWQgRE9NIGFjY2Vzc29yIHV0aWxpdHkgZnVuY3Rpb25zXG4gKi9cbmV4cG9ydCBjb25zdCBfZG9tID0ge1xuICBoYXNTdHlsZSxcbiAgZ2V0RGlzdHJpYnV0ZWROb2RlcyxcbiAgZ2V0U2hhZG93Um9vdCxcbiAgZ2V0VGV4dCxcbiAgZ2V0U3R5bGUsXG4gIGNoaWxkTm9kZXMsXG4gIGNoaWxkTm9kZXNBc0xpc3QsXG4gIGhhc0NsYXNzLFxuICBoYXNBdHRyaWJ1dGUsXG4gIGdldEF0dHJpYnV0ZSxcbiAgaGFzU2hhZG93Um9vdCxcbiAgaXNDb21tZW50Tm9kZSxcbiAgaXNFbGVtZW50Tm9kZSxcbiAgaXNQcmVzZW50LFxuICBpc1NoYWRvd1Jvb3QsXG4gIHRhZ05hbWUsXG4gIGxhc3RFbGVtZW50Q2hpbGRcbn07XG5cbi8vICoqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKlxuLy8gVGhlc2UgZnVuY3Rpb25zIGFyZSBjbG9uZWQgZnJvbVxuLy8gICogIEBhbmd1bGFyL3BsYXRmb3JtLWJyb3dzZXIvc3JjL2Jyb3dzZXIvR2VuZXJpY0Jyb3dzZXJEb21BZGFwdGVyXG4vLyBhbmQgYXJlIHRvIGJlIHVzZWQgT05MWSBpbnRlcm5hbGx5IGluIGN1c3RvbS1tYXRjaGVycy50cyBhbmQgVW5pdCBUZXN0c1xuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG5cbmZ1bmN0aW9uIGdldFN0eWxlKGVsZW1lbnQ6IGFueSwgc3R5bGVuYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICByZXR1cm4gZWxlbWVudC5zdHlsZVtzdHlsZW5hbWVdO1xufVxuXG5mdW5jdGlvbiBoYXNTdHlsZShlbGVtZW50OiBhbnksXG4gICAgICAgICAgICAgICAgICBzdHlsZU5hbWU6IHN0cmluZyxcbiAgICAgICAgICAgICAgICAgIHN0eWxlVmFsdWU6IHN0cmluZyA9ICcnLFxuICAgICAgICAgICAgICAgICAgaW5saW5lT25seSA9IHRydWUpOiBib29sZWFuIHtcbiAgbGV0IHZhbHVlID0gZ2V0U3R5bGUoZWxlbWVudCwgc3R5bGVOYW1lKSB8fCAnJztcbiAgaWYgKCF2YWx1ZSAmJiAhaW5saW5lT25seSkge1xuICAgIC8vIFNlYXJjaCBzdHlsZXNoZWV0c1xuICAgIHZhbHVlID0gdHlwZW9mIGdldENvbXB1dGVkU3R5bGUgPT09ICdmdW5jdGlvbicgJiZcbiAgICAgIGdldENvbXB1dGVkU3R5bGUoZWxlbWVudCkuZ2V0UHJvcGVydHlWYWx1ZShzdHlsZU5hbWUpIHx8ICcnO1xuICB9XG4gIHJldHVybiBzdHlsZVZhbHVlID8gdmFsdWUgPT0gc3R5bGVWYWx1ZSA6IHZhbHVlLmxlbmd0aCA+IDA7XG59XG5cbmZ1bmN0aW9uIGdldERpc3RyaWJ1dGVkTm9kZXMoZWw6IEhUTUxFbGVtZW50KTogTm9kZVtdIHtcbiAgcmV0dXJuICg8YW55PmVsKS5nZXREaXN0cmlidXRlZE5vZGVzKCk7XG59XG5cbmZ1bmN0aW9uIGdldFNoYWRvd1Jvb3QoZWw6IEhUTUxFbGVtZW50KTogRG9jdW1lbnRGcmFnbWVudCB7XG4gIHJldHVybiAoPGFueT5lbCkuc2hhZG93Um9vdDtcbn1cblxuZnVuY3Rpb24gZ2V0VGV4dChlbDogTm9kZSk6IHN0cmluZyB7XG4gIHJldHVybiBlbC50ZXh0Q29udGVudCB8fCAnJztcbn1cblxuZnVuY3Rpb24gY2hpbGROb2Rlc0FzTGlzdChlbDogTm9kZSk6IGFueVtdIHtcbiAgY29uc3QgbGlzdCA9IGVsLmNoaWxkTm9kZXM7XG4gIGNvbnN0IHJlcyA9IG5ldyBBcnJheShsaXN0Lmxlbmd0aCk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuICAgIHJlc1tpXSA9IGxpc3RbaV07XG4gIH1cbiAgcmV0dXJuIHJlcztcbn1cblxuZnVuY3Rpb24gaGFzQ2xhc3MoZWxlbWVudDogYW55LCBjbGFzc05hbWU6IHN0cmluZyk6IGJvb2xlYW4ge1xuICByZXR1cm4gZWxlbWVudC5jbGFzc0xpc3QuY29udGFpbnMoY2xhc3NOYW1lKTtcbn1cblxuZnVuY3Rpb24gaGFzQXR0cmlidXRlKGVsZW1lbnQ6IGFueSwgYXR0cmlidXRlTmFtZTogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHJldHVybiBlbGVtZW50Lmhhc0F0dHJpYnV0ZShhdHRyaWJ1dGVOYW1lKTtcbn1cblxuZnVuY3Rpb24gZ2V0QXR0cmlidXRlKGVsZW1lbnQ6IGFueSwgYXR0cmlidXRlTmFtZTogc3RyaW5nKTogc3RyaW5nIHtcbiAgcmV0dXJuIGVsZW1lbnQuZ2V0QXR0cmlidXRlKGF0dHJpYnV0ZU5hbWUpO1xufVxuXG5mdW5jdGlvbiBjaGlsZE5vZGVzKGVsOiBhbnkpOiBOb2RlW10ge1xuICByZXR1cm4gZWwuY2hpbGROb2Rlcztcbn1cblxuZnVuY3Rpb24gaGFzU2hhZG93Um9vdChub2RlOiBhbnkpOiBib29sZWFuIHtcbiAgcmV0dXJuIGlzUHJlc2VudChub2RlLnNoYWRvd1Jvb3QpICYmIG5vZGUgaW5zdGFuY2VvZiBIVE1MRWxlbWVudDtcbn1cblxuZnVuY3Rpb24gaXNDb21tZW50Tm9kZShub2RlOiBOb2RlKTogYm9vbGVhbiB7XG4gIHJldHVybiBub2RlLm5vZGVUeXBlID09PSBOb2RlLkNPTU1FTlRfTk9ERTtcbn1cblxuZnVuY3Rpb24gaXNFbGVtZW50Tm9kZShub2RlOiBOb2RlKTogYm9vbGVhbiB7XG4gIHJldHVybiBub2RlLm5vZGVUeXBlID09PSBOb2RlLkVMRU1FTlRfTk9ERTtcbn1cblxuZnVuY3Rpb24gaXNTaGFkb3dSb290KG5vZGU6IGFueSk6IGJvb2xlYW4ge1xuICByZXR1cm4gbm9kZSBpbnN0YW5jZW9mIERvY3VtZW50RnJhZ21lbnQ7XG59XG5cbmZ1bmN0aW9uIGlzUHJlc2VudChvYmo6IGFueSk6IGJvb2xlYW4ge1xuICByZXR1cm4gb2JqICE9IG51bGw7XG59XG5cbmZ1bmN0aW9uIHRhZ05hbWUoZWxlbWVudDogYW55KTogc3RyaW5nIHtcbiAgcmV0dXJuIGVsZW1lbnQudGFnTmFtZTtcbn1cblxuLy8gKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqXG4vLyBUaGVzZSBmdW5jdGlvbnMgYXJlIHBhcnQgb2YgdGhlIERPTSBBUElcbi8vIGFuZCBhcmUgdG8gYmUgdXNlZCBPTkxZIGludGVybmFsbHkgaW4gY3VzdG9tLW1hdGNoZXJzLnRzIGFuZCBVbml0IFRlc3RzXG4vLyAqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKioqKipcblxuZnVuY3Rpb24gbGFzdEVsZW1lbnRDaGlsZChlbGVtZW50OiBhbnkpOiBOb2RlfG51bGwge1xuICByZXR1cm4gZWxlbWVudC5sYXN0RWxlbWVudENoaWxkO1xufVxuXG4iXX0=