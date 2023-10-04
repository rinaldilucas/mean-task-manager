/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { ChangeDetectionStrategy } from '../../change_detection/constants';
import { Injector } from '../../di/injector';
import { assertEqual } from '../../util/assert';
import { assertLView } from '../assert';
import { discoverLocalRefs, getComponentAtNodeIndex, getDirectivesAtNodeIndex, getLContext, readPatchedLView } from '../context_discovery';
import { getComponentDef, getDirectiveDef } from '../definition';
import { NodeInjector } from '../di';
import { buildDebugNode } from '../instructions/lview_debug';
import { isLView } from '../interfaces/type_checks';
import { CLEANUP, CONTEXT, FLAGS, T_HOST, TVIEW } from '../interfaces/view';
import { getLViewParent, getRootContext } from './view_traversal_utils';
import { getTNode, unwrapRNode } from './view_utils';
/**
 * Retrieves the component instance associated with a given DOM element.
 *
 * @usageNotes
 * Given the following DOM structure:
 *
 * ```html
 * <app-root>
 *   <div>
 *     <child-comp></child-comp>
 *   </div>
 * </app-root>
 * ```
 *
 * Calling `getComponent` on `<child-comp>` will return the instance of `ChildComponent`
 * associated with this DOM element.
 *
 * Calling the function on `<app-root>` will return the `MyApp` instance.
 *
 *
 * @param element DOM element from which the component should be retrieved.
 * @returns Component instance associated with the element or `null` if there
 *    is no component associated with it.
 *
 * @publicApi
 * @globalApi ng
 */
export function getComponent(element) {
    ngDevMode && assertDomElement(element);
    const context = getLContext(element);
    if (context === null)
        return null;
    if (context.component === undefined) {
        const lView = context.lView;
        if (lView === null) {
            return null;
        }
        context.component = getComponentAtNodeIndex(context.nodeIndex, lView);
    }
    return context.component;
}
/**
 * If inside an embedded view (e.g. `*ngIf` or `*ngFor`), retrieves the context of the embedded
 * view that the element is part of. Otherwise retrieves the instance of the component whose view
 * owns the element (in this case, the result is the same as calling `getOwningComponent`).
 *
 * @param element Element for which to get the surrounding component instance.
 * @returns Instance of the component that is around the element or null if the element isn't
 *    inside any component.
 *
 * @publicApi
 * @globalApi ng
 */
export function getContext(element) {
    assertDomElement(element);
    const context = getLContext(element);
    const lView = context ? context.lView : null;
    return lView === null ? null : lView[CONTEXT];
}
/**
 * Retrieves the component instance whose view contains the DOM element.
 *
 * For example, if `<child-comp>` is used in the template of `<app-comp>`
 * (i.e. a `ViewChild` of `<app-comp>`), calling `getOwningComponent` on `<child-comp>`
 * would return `<app-comp>`.
 *
 * @param elementOrDir DOM element, component or directive instance
 *    for which to retrieve the root components.
 * @returns Component instance whose view owns the DOM element or null if the element is not
 *    part of a component view.
 *
 * @publicApi
 * @globalApi ng
 */
export function getOwningComponent(elementOrDir) {
    const context = getLContext(elementOrDir);
    let lView = context ? context.lView : null;
    if (lView === null)
        return null;
    let parent;
    while (lView[TVIEW].type === 2 /* TViewType.Embedded */ && (parent = getLViewParent(lView))) {
        lView = parent;
    }
    return lView[FLAGS] & 256 /* LViewFlags.IsRoot */ ? null : lView[CONTEXT];
}
/**
 * Retrieves all root components associated with a DOM element, directive or component instance.
 * Root components are those which have been bootstrapped by Angular.
 *
 * @param elementOrDir DOM element, component or directive instance
 *    for which to retrieve the root components.
 * @returns Root components associated with the target object.
 *
 * @publicApi
 * @globalApi ng
 */
export function getRootComponents(elementOrDir) {
    const lView = readPatchedLView(elementOrDir);
    return lView !== null ? [getRootContext(lView)] : [];
}
/**
 * Retrieves an `Injector` associated with an element, component or directive instance.
 *
 * @param elementOrDir DOM element, component or directive instance for which to
 *    retrieve the injector.
 * @returns Injector associated with the element, component or directive instance.
 *
 * @publicApi
 * @globalApi ng
 */
export function getInjector(elementOrDir) {
    const context = getLContext(elementOrDir);
    const lView = context ? context.lView : null;
    if (lView === null)
        return Injector.NULL;
    const tNode = lView[TVIEW].data[context.nodeIndex];
    return new NodeInjector(tNode, lView);
}
/**
 * Retrieve a set of injection tokens at a given DOM node.
 *
 * @param element Element for which the injection tokens should be retrieved.
 */
export function getInjectionTokens(element) {
    const context = getLContext(element);
    const lView = context ? context.lView : null;
    if (lView === null)
        return [];
    const tView = lView[TVIEW];
    const tNode = tView.data[context.nodeIndex];
    const providerTokens = [];
    const startIndex = tNode.providerIndexes & 1048575 /* TNodeProviderIndexes.ProvidersStartIndexMask */;
    const endIndex = tNode.directiveEnd;
    for (let i = startIndex; i < endIndex; i++) {
        let value = tView.data[i];
        if (isDirectiveDefHack(value)) {
            // The fact that we sometimes store Type and sometimes DirectiveDef in this location is a
            // design flaw.  We should always store same type so that we can be monomorphic. The issue
            // is that for Components/Directives we store the def instead the type. The correct behavior
            // is that we should always be storing injectable type in this location.
            value = value.type;
        }
        providerTokens.push(value);
    }
    return providerTokens;
}
/**
 * Retrieves directive instances associated with a given DOM node. Does not include
 * component instances.
 *
 * @usageNotes
 * Given the following DOM structure:
 *
 * ```html
 * <app-root>
 *   <button my-button></button>
 *   <my-comp></my-comp>
 * </app-root>
 * ```
 *
 * Calling `getDirectives` on `<button>` will return an array with an instance of the `MyButton`
 * directive that is associated with the DOM node.
 *
 * Calling `getDirectives` on `<my-comp>` will return an empty array.
 *
 * @param node DOM node for which to get the directives.
 * @returns Array of directives associated with the node.
 *
 * @publicApi
 * @globalApi ng
 */
export function getDirectives(node) {
    // Skip text nodes because we can't have directives associated with them.
    if (node instanceof Text) {
        return [];
    }
    const context = getLContext(node);
    const lView = context ? context.lView : null;
    if (lView === null) {
        return [];
    }
    const tView = lView[TVIEW];
    const nodeIndex = context.nodeIndex;
    if (!tView?.data[nodeIndex]) {
        return [];
    }
    if (context.directives === undefined) {
        context.directives = getDirectivesAtNodeIndex(nodeIndex, lView, false);
    }
    // The `directives` in this case are a named array called `LComponentView`. Clone the
    // result so we don't expose an internal data structure in the user's console.
    return context.directives === null ? [] : [...context.directives];
}
/**
 * Returns the debug (partial) metadata for a particular directive or component instance.
 * The function accepts an instance of a directive or component and returns the corresponding
 * metadata.
 *
 * @param directiveOrComponentInstance Instance of a directive or component
 * @returns metadata of the passed directive or component
 *
 * @publicApi
 * @globalApi ng
 */
export function getDirectiveMetadata(directiveOrComponentInstance) {
    const { constructor } = directiveOrComponentInstance;
    if (!constructor) {
        throw new Error('Unable to find the instance constructor');
    }
    // In case a component inherits from a directive, we may have component and directive metadata
    // To ensure we don't get the metadata of the directive, we want to call `getComponentDef` first.
    const componentDef = getComponentDef(constructor);
    if (componentDef) {
        return {
            inputs: componentDef.inputs,
            outputs: componentDef.outputs,
            encapsulation: componentDef.encapsulation,
            changeDetection: componentDef.onPush ? ChangeDetectionStrategy.OnPush :
                ChangeDetectionStrategy.Default
        };
    }
    const directiveDef = getDirectiveDef(constructor);
    if (directiveDef) {
        return { inputs: directiveDef.inputs, outputs: directiveDef.outputs };
    }
    return null;
}
/**
 * Retrieve map of local references.
 *
 * The references are retrieved as a map of local reference name to element or directive instance.
 *
 * @param target DOM element, component or directive instance for which to retrieve
 *    the local references.
 */
export function getLocalRefs(target) {
    const context = getLContext(target);
    if (context === null)
        return {};
    if (context.localRefs === undefined) {
        const lView = context.lView;
        if (lView === null) {
            return {};
        }
        context.localRefs = discoverLocalRefs(lView, context.nodeIndex);
    }
    return context.localRefs || {};
}
/**
 * Retrieves the host element of a component or directive instance.
 * The host element is the DOM element that matched the selector of the directive.
 *
 * @param componentOrDirective Component or directive instance for which the host
 *     element should be retrieved.
 * @returns Host element of the target.
 *
 * @publicApi
 * @globalApi ng
 */
export function getHostElement(componentOrDirective) {
    return getLContext(componentOrDirective).native;
}
/**
 * Retrieves the rendered text for a given component.
 *
 * This function retrieves the host element of a component and
 * and then returns the `textContent` for that element. This implies
 * that the text returned will include re-projected content of
 * the component as well.
 *
 * @param component The component to return the content text for.
 */
export function getRenderedText(component) {
    const hostElement = getHostElement(component);
    return hostElement.textContent || '';
}
/**
 * Retrieves a list of event listeners associated with a DOM element. The list does include host
 * listeners, but it does not include event listeners defined outside of the Angular context
 * (e.g. through `addEventListener`).
 *
 * @usageNotes
 * Given the following DOM structure:
 *
 * ```html
 * <app-root>
 *   <div (click)="doSomething()"></div>
 * </app-root>
 * ```
 *
 * Calling `getListeners` on `<div>` will return an object that looks as follows:
 *
 * ```ts
 * {
 *   name: 'click',
 *   element: <div>,
 *   callback: () => doSomething(),
 *   useCapture: false
 * }
 * ```
 *
 * @param element Element for which the DOM listeners should be retrieved.
 * @returns Array of event listeners on the DOM element.
 *
 * @publicApi
 * @globalApi ng
 */
export function getListeners(element) {
    ngDevMode && assertDomElement(element);
    const lContext = getLContext(element);
    const lView = lContext === null ? null : lContext.lView;
    if (lView === null)
        return [];
    const tView = lView[TVIEW];
    const lCleanup = lView[CLEANUP];
    const tCleanup = tView.cleanup;
    const listeners = [];
    if (tCleanup && lCleanup) {
        for (let i = 0; i < tCleanup.length;) {
            const firstParam = tCleanup[i++];
            const secondParam = tCleanup[i++];
            if (typeof firstParam === 'string') {
                const name = firstParam;
                const listenerElement = unwrapRNode(lView[secondParam]);
                const callback = lCleanup[tCleanup[i++]];
                const useCaptureOrIndx = tCleanup[i++];
                // if useCaptureOrIndx is boolean then report it as is.
                // if useCaptureOrIndx is positive number then it in unsubscribe method
                // if useCaptureOrIndx is negative number then it is a Subscription
                const type = (typeof useCaptureOrIndx === 'boolean' || useCaptureOrIndx >= 0) ? 'dom' : 'output';
                const useCapture = typeof useCaptureOrIndx === 'boolean' ? useCaptureOrIndx : false;
                if (element == listenerElement) {
                    listeners.push({ element, name, callback, useCapture, type });
                }
            }
        }
    }
    listeners.sort(sortListeners);
    return listeners;
}
function sortListeners(a, b) {
    if (a.name == b.name)
        return 0;
    return a.name < b.name ? -1 : 1;
}
/**
 * This function should not exist because it is megamorphic and only mostly correct.
 *
 * See call site for more info.
 */
function isDirectiveDefHack(obj) {
    return obj.type !== undefined && obj.template !== undefined && obj.declaredInputs !== undefined;
}
/**
 * Returns the attached `DebugNode` instance for an element in the DOM.
 *
 * @param element DOM element which is owned by an existing component's view.
 */
export function getDebugNode(element) {
    if (ngDevMode && !(element instanceof Node)) {
        throw new Error('Expecting instance of DOM Element');
    }
    const lContext = getLContext(element);
    const lView = lContext ? lContext.lView : null;
    if (lView === null) {
        return null;
    }
    const nodeIndex = lContext.nodeIndex;
    if (nodeIndex !== -1) {
        const valueInLView = lView[nodeIndex];
        // this means that value in the lView is a component with its own
        // data. In this situation the TNode is not accessed at the same spot.
        const tNode = isLView(valueInLView) ? valueInLView[T_HOST] : getTNode(lView[TVIEW], nodeIndex);
        ngDevMode &&
            assertEqual(tNode.index, nodeIndex, 'Expecting that TNode at index is same as index');
        return buildDebugNode(tNode, lView);
    }
    return null;
}
/**
 * Retrieve the component `LView` from component/element.
 *
 * NOTE: `LView` is a private and should not be leaked outside.
 *       Don't export this method to `ng.*` on window.
 *
 * @param target DOM element or component instance for which to retrieve the LView.
 */
export function getComponentLView(target) {
    const lContext = getLContext(target);
    const nodeIndx = lContext.nodeIndex;
    const lView = lContext.lView;
    ngDevMode && assertLView(lView);
    const componentLView = lView[nodeIndx];
    ngDevMode && assertLView(componentLView);
    return componentLView;
}
/** Asserts that a value is a DOM Element. */
function assertDomElement(value) {
    if (typeof Element !== 'undefined' && !(value instanceof Element)) {
        throw new Error('Expecting instance of DOM Element');
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZGlzY292ZXJ5X3V0aWxzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29yZS9zcmMvcmVuZGVyMy91dGlsL2Rpc2NvdmVyeV91dGlscy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7O0dBTUc7QUFFSCxPQUFPLEVBQUMsdUJBQXVCLEVBQUMsTUFBTSxrQ0FBa0MsQ0FBQztBQUN6RSxPQUFPLEVBQUMsUUFBUSxFQUFDLE1BQU0sbUJBQW1CLENBQUM7QUFFM0MsT0FBTyxFQUFDLFdBQVcsRUFBQyxNQUFNLG1CQUFtQixDQUFDO0FBQzlDLE9BQU8sRUFBQyxXQUFXLEVBQUMsTUFBTSxXQUFXLENBQUM7QUFDdEMsT0FBTyxFQUFDLGlCQUFpQixFQUFFLHVCQUF1QixFQUFFLHdCQUF3QixFQUFFLFdBQVcsRUFBRSxnQkFBZ0IsRUFBQyxNQUFNLHNCQUFzQixDQUFDO0FBQ3pJLE9BQU8sRUFBQyxlQUFlLEVBQUUsZUFBZSxFQUFDLE1BQU0sZUFBZSxDQUFDO0FBQy9ELE9BQU8sRUFBQyxZQUFZLEVBQUMsTUFBTSxPQUFPLENBQUM7QUFDbkMsT0FBTyxFQUFDLGNBQWMsRUFBQyxNQUFNLDZCQUE2QixDQUFDO0FBRzNELE9BQU8sRUFBQyxPQUFPLEVBQUMsTUFBTSwyQkFBMkIsQ0FBQztBQUNsRCxPQUFPLEVBQUMsT0FBTyxFQUFFLE9BQU8sRUFBYSxLQUFLLEVBQXFCLE1BQU0sRUFBRSxLQUFLLEVBQVksTUFBTSxvQkFBb0IsQ0FBQztBQUVuSCxPQUFPLEVBQUMsY0FBYyxFQUFFLGNBQWMsRUFBQyxNQUFNLHdCQUF3QixDQUFDO0FBQ3RFLE9BQU8sRUFBQyxRQUFRLEVBQUUsV0FBVyxFQUFDLE1BQU0sY0FBYyxDQUFDO0FBSW5EOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztHQTBCRztBQUNILE1BQU0sVUFBVSxZQUFZLENBQUksT0FBZ0I7SUFDOUMsU0FBUyxJQUFJLGdCQUFn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QUFXLENBQUMsTUFBTSxDQUFFLENBQUM7SUFDdEMsTUFBTSxRQUFRLEdBQUcsUUFBUSxDQUFDLFNBQVMsQ0FBQztJQUNwQyxNQUFNLEtBQUssR0FBRyxRQUFRLENBQUMsS0FBTSxDQUFDO0lBQzlCLFNBQVMsSUFBSSxXQUFXLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDaEMsTUFBTSxjQUFjLEdBQUcsS0FBSyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3ZDLFNBQVMsSUFBSSxXQUFXLENBQUMsY0FBYyxDQUFDLENBQUM7SUFDekMsT0FBTyxjQUFjLENBQUM7QUFDeEIsQ0FBQztBQUVELDZDQUE2QztBQUM3QyxTQUFTLGdCQUFnQixDQUFDLEtBQVU7SUFDbEMsSUFBSSxPQUFPLE9BQU8sS0FBSyxXQUFXLElBQUksQ0FBQyxDQUFDLEtBQUssWUFBWSxPQUFPLENBQUMsRUFBRTtRQUNqRSxNQUFNLElBQUksS0FBSyxDQUFDLG1DQUFtQyxDQUFDLENBQUM7S0FDdEQ7QUFDSCxDQUFDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBMTEMgQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5cbmltcG9ydCB7Q2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3l9IGZyb20gJy4uLy4uL2NoYW5nZV9kZXRlY3Rpb24vY29uc3RhbnRzJztcbmltcG9ydCB7SW5qZWN0b3J9IGZyb20gJy4uLy4uL2RpL2luamVjdG9yJztcbmltcG9ydCB7Vmlld0VuY2Fwc3VsYXRpb259IGZyb20gJy4uLy4uL21ldGFkYXRhL3ZpZXcnO1xuaW1wb3J0IHthc3NlcnRFcXVhbH0gZnJvbSAnLi4vLi4vdXRpbC9hc3NlcnQnO1xuaW1wb3J0IHthc3NlcnRMVmlld30gZnJvbSAnLi4vYXNzZXJ0JztcbmltcG9ydCB7ZGlzY292ZXJMb2NhbFJlZnMsIGdldENvbXBvbmVudEF0Tm9kZUluZGV4LCBnZXREaXJlY3RpdmVzQXROb2RlSW5kZXgsIGdldExDb250ZXh0LCByZWFkUGF0Y2hlZExWaWV3fSBmcm9tICcuLi9jb250ZXh0X2Rpc2NvdmVyeSc7XG5pbXBvcnQge2dldENvbXBvbmVudERlZiwgZ2V0RGlyZWN0aXZlRGVmfSBmcm9tICcuLi9kZWZpbml0aW9uJztcbmltcG9ydCB7Tm9kZUluamVjdG9yfSBmcm9tICcuLi9kaSc7XG5pbXBvcnQge2J1aWxkRGVidWdOb2RlfSBmcm9tICcuLi9pbnN0cnVjdGlvbnMvbHZpZXdfZGVidWcnO1xuaW1wb3J0IHtEaXJlY3RpdmVEZWZ9IGZyb20gJy4uL2ludGVyZmFjZXMvZGVmaW5pdGlvbic7XG5pbXBvcnQge1RFbGVtZW50Tm9kZSwgVE5vZGUsIFROb2RlUHJvdmlkZXJJbmRleGVzfSBmcm9tICcuLi9pbnRlcmZhY2VzL25vZGUnO1xuaW1wb3J0IHtpc0xWaWV3fSBmcm9tICcuLi9pbnRlcmZhY2VzL3R5cGVfY2hlY2tzJztcbmltcG9ydCB7Q0xFQU5VUCwgQ09OVEVYVCwgRGVidWdOb2RlLCBGTEFHUywgTFZpZXcsIExWaWV3RmxhZ3MsIFRfSE9TVCwgVFZJRVcsIFRWaWV3VHlwZX0gZnJvbSAnLi4vaW50ZXJmYWNlcy92aWV3JztcblxuaW1wb3J0IHtnZXRMVmlld1BhcmVudCwgZ2V0Um9vdENvbnRleHR9IGZyb20gJy4vdmlld190cmF2ZXJzYWxfdXRpbHMnO1xuaW1wb3J0IHtnZXRUTm9kZSwgdW53cmFwUk5vZGV9IGZyb20gJy4vdmlld191dGlscyc7XG5cblxuXG4vKipcbiAqIFJldHJpZXZlcyB0aGUgY29tcG9uZW50IGluc3RhbmNlIGFzc29jaWF0ZWQgd2l0aCBhIGdpdmVuIERPTSBlbGVtZW50LlxuICpcbiAqIEB1c2FnZU5vdGVzXG4gKiBHaXZlbiB0aGUgZm9sbG93aW5nIERPTSBzdHJ1Y3R1cmU6XG4gKlxuICogYGBgaHRtbFxuICogPGFwcC1yb290PlxuICogICA8ZGl2PlxuICogICAgIDxjaGlsZC1jb21wPjwvY2hpbGQtY29tcD5cbiAqICAgPC9kaXY+XG4gKiA8L2FwcC1yb290PlxuICogYGBgXG4gKlxuICogQ2FsbGluZyBgZ2V0Q29tcG9uZW50YCBvbiBgPGNoaWxkLWNvbXA+YCB3aWxsIHJldHVybiB0aGUgaW5zdGFuY2Ugb2YgYENoaWxkQ29tcG9uZW50YFxuICogYXNzb2NpYXRlZCB3aXRoIHRoaXMgRE9NIGVsZW1lbnQuXG4gKlxuICogQ2FsbGluZyB0aGUgZnVuY3Rpb24gb24gYDxhcHAtcm9vdD5gIHdpbGwgcmV0dXJuIHRoZSBgTXlBcHBgIGluc3RhbmNlLlxuICpcbiAqXG4gKiBAcGFyYW0gZWxlbWVudCBET00gZWxlbWVudCBmcm9tIHdoaWNoIHRoZSBjb21wb25lbnQgc2hvdWxkIGJlIHJldHJpZXZlZC5cbiAqIEByZXR1cm5zIENvbXBvbmVudCBpbnN0YW5jZSBhc3NvY2lhdGVkIHdpdGggdGhlIGVsZW1lbnQgb3IgYG51bGxgIGlmIHRoZXJlXG4gKiAgICBpcyBubyBjb21wb25lbnQgYXNzb2NpYXRlZCB3aXRoIGl0LlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqIEBnbG9iYWxBcGkgbmdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldENvbXBvbmVudDxUPihlbGVtZW50OiBFbGVtZW50KTogVHxudWxsIHtcbiAgbmdEZXZNb2RlICYmIGFzc2VydERvbUVsZW1lbnQoZWxlbWVudCk7XG4gIGNvbnN0IGNvbnRleHQgPSBnZXRMQ29udGV4dChlbGVtZW50KTtcbiAgaWYgKGNvbnRleHQgPT09IG51bGwpIHJldHVybiBudWxsO1xuXG4gIGlmIChjb250ZXh0LmNvbXBvbmVudCA9PT0gdW5kZWZpbmVkKSB7XG4gICAgY29uc3QgbFZpZXcgPSBjb250ZXh0LmxWaWV3O1xuICAgIGlmIChsVmlldyA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIGNvbnRleHQuY29tcG9uZW50ID0gZ2V0Q29tcG9uZW50QXROb2RlSW5kZXgoY29udGV4dC5ub2RlSW5kZXgsIGxWaWV3KTtcbiAgfVxuXG4gIHJldHVybiBjb250ZXh0LmNvbXBvbmVudCBhcyB1bmtub3duIGFzIFQ7XG59XG5cblxuLyoqXG4gKiBJZiBpbnNpZGUgYW4gZW1iZWRkZWQgdmlldyAoZS5nLiBgKm5nSWZgIG9yIGAqbmdGb3JgKSwgcmV0cmlldmVzIHRoZSBjb250ZXh0IG9mIHRoZSBlbWJlZGRlZFxuICogdmlldyB0aGF0IHRoZSBlbGVtZW50IGlzIHBhcnQgb2YuIE90aGVyd2lzZSByZXRyaWV2ZXMgdGhlIGluc3RhbmNlIG9mIHRoZSBjb21wb25lbnQgd2hvc2Ugdmlld1xuICogb3ducyB0aGUgZWxlbWVudCAoaW4gdGhpcyBjYXNlLCB0aGUgcmVzdWx0IGlzIHRoZSBzYW1lIGFzIGNhbGxpbmcgYGdldE93bmluZ0NvbXBvbmVudGApLlxuICpcbiAqIEBwYXJhbSBlbGVtZW50IEVsZW1lbnQgZm9yIHdoaWNoIHRvIGdldCB0aGUgc3Vycm91bmRpbmcgY29tcG9uZW50IGluc3RhbmNlLlxuICogQHJldHVybnMgSW5zdGFuY2Ugb2YgdGhlIGNvbXBvbmVudCB0aGF0IGlzIGFyb3VuZCB0aGUgZWxlbWVudCBvciBudWxsIGlmIHRoZSBlbGVtZW50IGlzbid0XG4gKiAgICBpbnNpZGUgYW55IGNvbXBvbmVudC5cbiAqXG4gKiBAcHVibGljQXBpXG4gKiBAZ2xvYmFsQXBpIG5nXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRDb250ZXh0PFQgZXh0ZW5kcyB7fT4oZWxlbWVudDogRWxlbWVudCk6IFR8bnVsbCB7XG4gIGFzc2VydERvbUVsZW1lbnQoZWxlbWVudCk7XG4gIGNvbnN0IGNvbnRleHQgPSBnZXRMQ29udGV4dChlbGVtZW50KSE7XG4gIGNvbnN0IGxWaWV3ID0gY29udGV4dCA/IGNvbnRleHQubFZpZXcgOiBudWxsO1xuICByZXR1cm4gbFZpZXcgPT09IG51bGwgPyBudWxsIDogbFZpZXdbQ09OVEVYVF0gYXMgVDtcbn1cblxuLyoqXG4gKiBSZXRyaWV2ZXMgdGhlIGNvbXBvbmVudCBpbnN0YW5jZSB3aG9zZSB2aWV3IGNvbnRhaW5zIHRoZSBET00gZWxlbWVudC5cbiAqXG4gKiBGb3IgZXhhbXBsZSwgaWYgYDxjaGlsZC1jb21wPmAgaXMgdXNlZCBpbiB0aGUgdGVtcGxhdGUgb2YgYDxhcHAtY29tcD5gXG4gKiAoaS5lLiBhIGBWaWV3Q2hpbGRgIG9mIGA8YXBwLWNvbXA+YCksIGNhbGxpbmcgYGdldE93bmluZ0NvbXBvbmVudGAgb24gYDxjaGlsZC1jb21wPmBcbiAqIHdvdWxkIHJldHVybiBgPGFwcC1jb21wPmAuXG4gKlxuICogQHBhcmFtIGVsZW1lbnRPckRpciBET00gZWxlbWVudCwgY29tcG9uZW50IG9yIGRpcmVjdGl2ZSBpbnN0YW5jZVxuICogICAgZm9yIHdoaWNoIHRvIHJldHJpZXZlIHRoZSByb290IGNvbXBvbmVudHMuXG4gKiBAcmV0dXJucyBDb21wb25lbnQgaW5zdGFuY2Ugd2hvc2UgdmlldyBvd25zIHRoZSBET00gZWxlbWVudCBvciBudWxsIGlmIHRoZSBlbGVtZW50IGlzIG5vdFxuICogICAgcGFydCBvZiBhIGNvbXBvbmVudCB2aWV3LlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqIEBnbG9iYWxBcGkgbmdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldE93bmluZ0NvbXBvbmVudDxUPihlbGVtZW50T3JEaXI6IEVsZW1lbnR8e30pOiBUfG51bGwge1xuICBjb25zdCBjb250ZXh0ID0gZ2V0TENvbnRleHQoZWxlbWVudE9yRGlyKSE7XG4gIGxldCBsVmlldyA9IGNvbnRleHQgPyBjb250ZXh0LmxWaWV3IDogbnVsbDtcbiAgaWYgKGxWaWV3ID09PSBudWxsKSByZXR1cm4gbnVsbDtcblxuICBsZXQgcGFyZW50OiBMVmlld3xudWxsO1xuICB3aGlsZSAobFZpZXdbVFZJRVddLnR5cGUgPT09IFRWaWV3VHlwZS5FbWJlZGRlZCAmJiAocGFyZW50ID0gZ2V0TFZpZXdQYXJlbnQobFZpZXcpISkpIHtcbiAgICBsVmlldyA9IHBhcmVudDtcbiAgfVxuICByZXR1cm4gbFZpZXdbRkxBR1NdICYgTFZpZXdGbGFncy5Jc1Jvb3QgPyBudWxsIDogbFZpZXdbQ09OVEVYVF0gYXMgdW5rbm93biBhcyBUO1xufVxuXG4vKipcbiAqIFJldHJpZXZlcyBhbGwgcm9vdCBjb21wb25lbnRzIGFzc29jaWF0ZWQgd2l0aCBhIERPTSBlbGVtZW50LCBkaXJlY3RpdmUgb3IgY29tcG9uZW50IGluc3RhbmNlLlxuICogUm9vdCBjb21wb25lbnRzIGFyZSB0aG9zZSB3aGljaCBoYXZlIGJlZW4gYm9vdHN0cmFwcGVkIGJ5IEFuZ3VsYXIuXG4gKlxuICogQHBhcmFtIGVsZW1lbnRPckRpciBET00gZWxlbWVudCwgY29tcG9uZW50IG9yIGRpcmVjdGl2ZSBpbnN0YW5jZVxuICogICAgZm9yIHdoaWNoIHRvIHJldHJpZXZlIHRoZSByb290IGNvbXBvbmVudHMuXG4gKiBAcmV0dXJucyBSb290IGNvbXBvbmVudHMgYXNzb2NpYXRlZCB3aXRoIHRoZSB0YXJnZXQgb2JqZWN0LlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqIEBnbG9iYWxBcGkgbmdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFJvb3RDb21wb25lbnRzKGVsZW1lbnRPckRpcjogRWxlbWVudHx7fSk6IHt9W10ge1xuICBjb25zdCBsVmlldyA9IHJlYWRQYXRjaGVkTFZpZXc8e30+KGVsZW1lbnRPckRpcik7XG4gIHJldHVybiBsVmlldyAhPT0gbnVsbCA/IFtnZXRSb290Q29udGV4dChsVmlldyldIDogW107XG59XG5cbi8qKlxuICogUmV0cmlldmVzIGFuIGBJbmplY3RvcmAgYXNzb2NpYXRlZCB3aXRoIGFuIGVsZW1lbnQsIGNvbXBvbmVudCBvciBkaXJlY3RpdmUgaW5zdGFuY2UuXG4gKlxuICogQHBhcmFtIGVsZW1lbnRPckRpciBET00gZWxlbWVudCwgY29tcG9uZW50IG9yIGRpcmVjdGl2ZSBpbnN0YW5jZSBmb3Igd2hpY2ggdG9cbiAqICAgIHJldHJpZXZlIHRoZSBpbmplY3Rvci5cbiAqIEByZXR1cm5zIEluamVjdG9yIGFzc29jaWF0ZWQgd2l0aCB0aGUgZWxlbWVudCwgY29tcG9uZW50IG9yIGRpcmVjdGl2ZSBpbnN0YW5jZS5cbiAqXG4gKiBAcHVibGljQXBpXG4gKiBAZ2xvYmFsQXBpIG5nXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRJbmplY3RvcihlbGVtZW50T3JEaXI6IEVsZW1lbnR8e30pOiBJbmplY3RvciB7XG4gIGNvbnN0IGNvbnRleHQgPSBnZXRMQ29udGV4dChlbGVtZW50T3JEaXIpITtcbiAgY29uc3QgbFZpZXcgPSBjb250ZXh0ID8gY29udGV4dC5sVmlldyA6IG51bGw7XG4gIGlmIChsVmlldyA9PT0gbnVsbCkgcmV0dXJuIEluamVjdG9yLk5VTEw7XG5cbiAgY29uc3QgdE5vZGUgPSBsVmlld1tUVklFV10uZGF0YVtjb250ZXh0Lm5vZGVJbmRleF0gYXMgVEVsZW1lbnROb2RlO1xuICByZXR1cm4gbmV3IE5vZGVJbmplY3Rvcih0Tm9kZSwgbFZpZXcpO1xufVxuXG4vKipcbiAqIFJldHJpZXZlIGEgc2V0IG9mIGluamVjdGlvbiB0b2tlbnMgYXQgYSBnaXZlbiBET00gbm9kZS5cbiAqXG4gKiBAcGFyYW0gZWxlbWVudCBFbGVtZW50IGZvciB3aGljaCB0aGUgaW5qZWN0aW9uIHRva2VucyBzaG91bGQgYmUgcmV0cmlldmVkLlxuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0SW5qZWN0aW9uVG9rZW5zKGVsZW1lbnQ6IEVsZW1lbnQpOiBhbnlbXSB7XG4gIGNvbnN0IGNvbnRleHQgPSBnZXRMQ29udGV4dChlbGVtZW50KSE7XG4gIGNvbnN0IGxWaWV3ID0gY29udGV4dCA/IGNvbnRleHQubFZpZXcgOiBudWxsO1xuICBpZiAobFZpZXcgPT09IG51bGwpIHJldHVybiBbXTtcbiAgY29uc3QgdFZpZXcgPSBsVmlld1tUVklFV107XG4gIGNvbnN0IHROb2RlID0gdFZpZXcuZGF0YVtjb250ZXh0Lm5vZGVJbmRleF0gYXMgVE5vZGU7XG4gIGNvbnN0IHByb3ZpZGVyVG9rZW5zOiBhbnlbXSA9IFtdO1xuICBjb25zdCBzdGFydEluZGV4ID0gdE5vZGUucHJvdmlkZXJJbmRleGVzICYgVE5vZGVQcm92aWRlckluZGV4ZXMuUHJvdmlkZXJzU3RhcnRJbmRleE1hc2s7XG4gIGNvbnN0IGVuZEluZGV4ID0gdE5vZGUuZGlyZWN0aXZlRW5kO1xuICBmb3IgKGxldCBpID0gc3RhcnRJbmRleDsgaSA8IGVuZEluZGV4OyBpKyspIHtcbiAgICBsZXQgdmFsdWUgPSB0Vmlldy5kYXRhW2ldO1xuICAgIGlmIChpc0RpcmVjdGl2ZURlZkhhY2sodmFsdWUpKSB7XG4gICAgICAvLyBUaGUgZmFjdCB0aGF0IHdlIHNvbWV0aW1lcyBzdG9yZSBUeXBlIGFuZCBzb21ldGltZXMgRGlyZWN0aXZlRGVmIGluIHRoaXMgbG9jYXRpb24gaXMgYVxuICAgICAgLy8gZGVzaWduIGZsYXcuICBXZSBzaG91bGQgYWx3YXlzIHN0b3JlIHNhbWUgdHlwZSBzbyB0aGF0IHdlIGNhbiBiZSBtb25vbW9ycGhpYy4gVGhlIGlzc3VlXG4gICAgICAvLyBpcyB0aGF0IGZvciBDb21wb25lbnRzL0RpcmVjdGl2ZXMgd2Ugc3RvcmUgdGhlIGRlZiBpbnN0ZWFkIHRoZSB0eXBlLiBUaGUgY29ycmVjdCBiZWhhdmlvclxuICAgICAgLy8gaXMgdGhhdCB3ZSBzaG91bGQgYWx3YXlzIGJlIHN0b3JpbmcgaW5qZWN0YWJsZSB0eXBlIGluIHRoaXMgbG9jYXRpb24uXG4gICAgICB2YWx1ZSA9IHZhbHVlLnR5cGU7XG4gICAgfVxuICAgIHByb3ZpZGVyVG9rZW5zLnB1c2godmFsdWUpO1xuICB9XG4gIHJldHVybiBwcm92aWRlclRva2Vucztcbn1cblxuLyoqXG4gKiBSZXRyaWV2ZXMgZGlyZWN0aXZlIGluc3RhbmNlcyBhc3NvY2lhdGVkIHdpdGggYSBnaXZlbiBET00gbm9kZS4gRG9lcyBub3QgaW5jbHVkZVxuICogY29tcG9uZW50IGluc3RhbmNlcy5cbiAqXG4gKiBAdXNhZ2VOb3Rlc1xuICogR2l2ZW4gdGhlIGZvbGxvd2luZyBET00gc3RydWN0dXJlOlxuICpcbiAqIGBgYGh0bWxcbiAqIDxhcHAtcm9vdD5cbiAqICAgPGJ1dHRvbiBteS1idXR0b24+PC9idXR0b24+XG4gKiAgIDxteS1jb21wPjwvbXktY29tcD5cbiAqIDwvYXBwLXJvb3Q+XG4gKiBgYGBcbiAqXG4gKiBDYWxsaW5nIGBnZXREaXJlY3RpdmVzYCBvbiBgPGJ1dHRvbj5gIHdpbGwgcmV0dXJuIGFuIGFycmF5IHdpdGggYW4gaW5zdGFuY2Ugb2YgdGhlIGBNeUJ1dHRvbmBcbiAqIGRpcmVjdGl2ZSB0aGF0IGlzIGFzc29jaWF0ZWQgd2l0aCB0aGUgRE9NIG5vZGUuXG4gKlxuICogQ2FsbGluZyBgZ2V0RGlyZWN0aXZlc2Agb24gYDxteS1jb21wPmAgd2lsbCByZXR1cm4gYW4gZW1wdHkgYXJyYXkuXG4gKlxuICogQHBhcmFtIG5vZGUgRE9NIG5vZGUgZm9yIHdoaWNoIHRvIGdldCB0aGUgZGlyZWN0aXZlcy5cbiAqIEByZXR1cm5zIEFycmF5IG9mIGRpcmVjdGl2ZXMgYXNzb2NpYXRlZCB3aXRoIHRoZSBub2RlLlxuICpcbiAqIEBwdWJsaWNBcGlcbiAqIEBnbG9iYWxBcGkgbmdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldERpcmVjdGl2ZXMobm9kZTogTm9kZSk6IHt9W10ge1xuICAvLyBTa2lwIHRleHQgbm9kZXMgYmVjYXVzZSB3ZSBjYW4ndCBoYXZlIGRpcmVjdGl2ZXMgYXNzb2NpYXRlZCB3aXRoIHRoZW0uXG4gIGlmIChub2RlIGluc3RhbmNlb2YgVGV4dCkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuXG4gIGNvbnN0IGNvbnRleHQgPSBnZXRMQ29udGV4dChub2RlKSE7XG4gIGNvbnN0IGxWaWV3ID0gY29udGV4dCA/IGNvbnRleHQubFZpZXcgOiBudWxsO1xuICBpZiAobFZpZXcgPT09IG51bGwpIHtcbiAgICByZXR1cm4gW107XG4gIH1cblxuICBjb25zdCB0VmlldyA9IGxWaWV3W1RWSUVXXTtcbiAgY29uc3Qgbm9kZUluZGV4ID0gY29udGV4dC5ub2RlSW5kZXg7XG4gIGlmICghdFZpZXc/LmRhdGFbbm9kZUluZGV4XSkge1xuICAgIHJldHVybiBbXTtcbiAgfVxuICBpZiAoY29udGV4dC5kaXJlY3RpdmVzID09PSB1bmRlZmluZWQpIHtcbiAgICBjb250ZXh0LmRpcmVjdGl2ZXMgPSBnZXREaXJlY3RpdmVzQXROb2RlSW5kZXgobm9kZUluZGV4LCBsVmlldywgZmFsc2UpO1xuICB9XG5cbiAgLy8gVGhlIGBkaXJlY3RpdmVzYCBpbiB0aGlzIGNhc2UgYXJlIGEgbmFtZWQgYXJyYXkgY2FsbGVkIGBMQ29tcG9uZW50Vmlld2AuIENsb25lIHRoZVxuICAvLyByZXN1bHQgc28gd2UgZG9uJ3QgZXhwb3NlIGFuIGludGVybmFsIGRhdGEgc3RydWN0dXJlIGluIHRoZSB1c2VyJ3MgY29uc29sZS5cbiAgcmV0dXJuIGNvbnRleHQuZGlyZWN0aXZlcyA9PT0gbnVsbCA/IFtdIDogWy4uLmNvbnRleHQuZGlyZWN0aXZlc107XG59XG5cbi8qKlxuICogUGFydGlhbCBtZXRhZGF0YSBmb3IgYSBnaXZlbiBkaXJlY3RpdmUgaW5zdGFuY2UuXG4gKiBUaGlzIGluZm9ybWF0aW9uIG1pZ2h0IGJlIHVzZWZ1bCBmb3IgZGVidWdnaW5nIHB1cnBvc2VzIG9yIHRvb2xpbmcuXG4gKiBDdXJyZW50bHkgb25seSBgaW5wdXRzYCBhbmQgYG91dHB1dHNgIG1ldGFkYXRhIGlzIGF2YWlsYWJsZS5cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgRGlyZWN0aXZlRGVidWdNZXRhZGF0YSB7XG4gIGlucHV0czogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbiAgb3V0cHV0czogUmVjb3JkPHN0cmluZywgc3RyaW5nPjtcbn1cblxuLyoqXG4gKiBQYXJ0aWFsIG1ldGFkYXRhIGZvciBhIGdpdmVuIGNvbXBvbmVudCBpbnN0YW5jZS5cbiAqIFRoaXMgaW5mb3JtYXRpb24gbWlnaHQgYmUgdXNlZnVsIGZvciBkZWJ1Z2dpbmcgcHVycG9zZXMgb3IgdG9vbGluZy5cbiAqIEN1cnJlbnRseSB0aGUgZm9sbG93aW5nIGZpZWxkcyBhcmUgYXZhaWxhYmxlOlxuICogIC0gaW5wdXRzXG4gKiAgLSBvdXRwdXRzXG4gKiAgLSBlbmNhcHN1bGF0aW9uXG4gKiAgLSBjaGFuZ2VEZXRlY3Rpb25cbiAqXG4gKiBAcHVibGljQXBpXG4gKi9cbmV4cG9ydCBpbnRlcmZhY2UgQ29tcG9uZW50RGVidWdNZXRhZGF0YSBleHRlbmRzIERpcmVjdGl2ZURlYnVnTWV0YWRhdGEge1xuICBlbmNhcHN1bGF0aW9uOiBWaWV3RW5jYXBzdWxhdGlvbjtcbiAgY2hhbmdlRGV0ZWN0aW9uOiBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneTtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBkZWJ1ZyAocGFydGlhbCkgbWV0YWRhdGEgZm9yIGEgcGFydGljdWxhciBkaXJlY3RpdmUgb3IgY29tcG9uZW50IGluc3RhbmNlLlxuICogVGhlIGZ1bmN0aW9uIGFjY2VwdHMgYW4gaW5zdGFuY2Ugb2YgYSBkaXJlY3RpdmUgb3IgY29tcG9uZW50IGFuZCByZXR1cm5zIHRoZSBjb3JyZXNwb25kaW5nXG4gKiBtZXRhZGF0YS5cbiAqXG4gKiBAcGFyYW0gZGlyZWN0aXZlT3JDb21wb25lbnRJbnN0YW5jZSBJbnN0YW5jZSBvZiBhIGRpcmVjdGl2ZSBvciBjb21wb25lbnRcbiAqIEByZXR1cm5zIG1ldGFkYXRhIG9mIHRoZSBwYXNzZWQgZGlyZWN0aXZlIG9yIGNvbXBvbmVudFxuICpcbiAqIEBwdWJsaWNBcGlcbiAqIEBnbG9iYWxBcGkgbmdcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldERpcmVjdGl2ZU1ldGFkYXRhKGRpcmVjdGl2ZU9yQ29tcG9uZW50SW5zdGFuY2U6IGFueSk6IENvbXBvbmVudERlYnVnTWV0YWRhdGF8XG4gICAgRGlyZWN0aXZlRGVidWdNZXRhZGF0YXxudWxsIHtcbiAgY29uc3Qge2NvbnN0cnVjdG9yfSA9IGRpcmVjdGl2ZU9yQ29tcG9uZW50SW5zdGFuY2U7XG4gIGlmICghY29uc3RydWN0b3IpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ1VuYWJsZSB0byBmaW5kIHRoZSBpbnN0YW5jZSBjb25zdHJ1Y3RvcicpO1xuICB9XG4gIC8vIEluIGNhc2UgYSBjb21wb25lbnQgaW5oZXJpdHMgZnJvbSBhIGRpcmVjdGl2ZSwgd2UgbWF5IGhhdmUgY29tcG9uZW50IGFuZCBkaXJlY3RpdmUgbWV0YWRhdGFcbiAgLy8gVG8gZW5zdXJlIHdlIGRvbid0IGdldCB0aGUgbWV0YWRhdGEgb2YgdGhlIGRpcmVjdGl2ZSwgd2Ugd2FudCB0byBjYWxsIGBnZXRDb21wb25lbnREZWZgIGZpcnN0LlxuICBjb25zdCBjb21wb25lbnREZWYgPSBnZXRDb21wb25lbnREZWYoY29uc3RydWN0b3IpO1xuICBpZiAoY29tcG9uZW50RGVmKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGlucHV0czogY29tcG9uZW50RGVmLmlucHV0cyxcbiAgICAgIG91dHB1dHM6IGNvbXBvbmVudERlZi5vdXRwdXRzLFxuICAgICAgZW5jYXBzdWxhdGlvbjogY29tcG9uZW50RGVmLmVuY2Fwc3VsYXRpb24sXG4gICAgICBjaGFuZ2VEZXRlY3Rpb246IGNvbXBvbmVudERlZi5vblB1c2ggPyBDaGFuZ2VEZXRlY3Rpb25TdHJhdGVneS5PblB1c2ggOlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgQ2hhbmdlRGV0ZWN0aW9uU3RyYXRlZ3kuRGVmYXVsdFxuICAgIH07XG4gIH1cbiAgY29uc3QgZGlyZWN0aXZlRGVmID0gZ2V0RGlyZWN0aXZlRGVmKGNvbnN0cnVjdG9yKTtcbiAgaWYgKGRpcmVjdGl2ZURlZikge1xuICAgIHJldHVybiB7aW5wdXRzOiBkaXJlY3RpdmVEZWYuaW5wdXRzLCBvdXRwdXRzOiBkaXJlY3RpdmVEZWYub3V0cHV0c307XG4gIH1cbiAgcmV0dXJuIG51bGw7XG59XG5cbi8qKlxuICogUmV0cmlldmUgbWFwIG9mIGxvY2FsIHJlZmVyZW5jZXMuXG4gKlxuICogVGhlIHJlZmVyZW5jZXMgYXJlIHJldHJpZXZlZCBhcyBhIG1hcCBvZiBsb2NhbCByZWZlcmVuY2UgbmFtZSB0byBlbGVtZW50IG9yIGRpcmVjdGl2ZSBpbnN0YW5jZS5cbiAqXG4gKiBAcGFyYW0gdGFyZ2V0IERPTSBlbGVtZW50LCBjb21wb25lbnQgb3IgZGlyZWN0aXZlIGluc3RhbmNlIGZvciB3aGljaCB0byByZXRyaWV2ZVxuICogICAgdGhlIGxvY2FsIHJlZmVyZW5jZXMuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRMb2NhbFJlZnModGFyZ2V0OiB7fSk6IHtba2V5OiBzdHJpbmddOiBhbnl9IHtcbiAgY29uc3QgY29udGV4dCA9IGdldExDb250ZXh0KHRhcmdldCk7XG4gIGlmIChjb250ZXh0ID09PSBudWxsKSByZXR1cm4ge307XG5cbiAgaWYgKGNvbnRleHQubG9jYWxSZWZzID09PSB1bmRlZmluZWQpIHtcbiAgICBjb25zdCBsVmlldyA9IGNvbnRleHQubFZpZXc7XG4gICAgaWYgKGxWaWV3ID09PSBudWxsKSB7XG4gICAgICByZXR1cm4ge307XG4gICAgfVxuICAgIGNvbnRleHQubG9jYWxSZWZzID0gZGlzY292ZXJMb2NhbFJlZnMobFZpZXcsIGNvbnRleHQubm9kZUluZGV4KTtcbiAgfVxuXG4gIHJldHVybiBjb250ZXh0LmxvY2FsUmVmcyB8fCB7fTtcbn1cblxuLyoqXG4gKiBSZXRyaWV2ZXMgdGhlIGhvc3QgZWxlbWVudCBvZiBhIGNvbXBvbmVudCBvciBkaXJlY3RpdmUgaW5zdGFuY2UuXG4gKiBUaGUgaG9zdCBlbGVtZW50IGlzIHRoZSBET00gZWxlbWVudCB0aGF0IG1hdGNoZWQgdGhlIHNlbGVjdG9yIG9mIHRoZSBkaXJlY3RpdmUuXG4gKlxuICogQHBhcmFtIGNvbXBvbmVudE9yRGlyZWN0aXZlIENvbXBvbmVudCBvciBkaXJlY3RpdmUgaW5zdGFuY2UgZm9yIHdoaWNoIHRoZSBob3N0XG4gKiAgICAgZWxlbWVudCBzaG91bGQgYmUgcmV0cmlldmVkLlxuICogQHJldHVybnMgSG9zdCBlbGVtZW50IG9mIHRoZSB0YXJnZXQuXG4gKlxuICogQHB1YmxpY0FwaVxuICogQGdsb2JhbEFwaSBuZ1xuICovXG5leHBvcnQgZnVuY3Rpb24gZ2V0SG9zdEVsZW1lbnQoY29tcG9uZW50T3JEaXJlY3RpdmU6IHt9KTogRWxlbWVudCB7XG4gIHJldHVybiBnZXRMQ29udGV4dChjb21wb25lbnRPckRpcmVjdGl2ZSkhLm5hdGl2ZSBhcyB1bmtub3duIGFzIEVsZW1lbnQ7XG59XG5cbi8qKlxuICogUmV0cmlldmVzIHRoZSByZW5kZXJlZCB0ZXh0IGZvciBhIGdpdmVuIGNvbXBvbmVudC5cbiAqXG4gKiBUaGlzIGZ1bmN0aW9uIHJldHJpZXZlcyB0aGUgaG9zdCBlbGVtZW50IG9mIGEgY29tcG9uZW50IGFuZFxuICogYW5kIHRoZW4gcmV0dXJucyB0aGUgYHRleHRDb250ZW50YCBmb3IgdGhhdCBlbGVtZW50LiBUaGlzIGltcGxpZXNcbiAqIHRoYXQgdGhlIHRleHQgcmV0dXJuZWQgd2lsbCBpbmNsdWRlIHJlLXByb2plY3RlZCBjb250ZW50IG9mXG4gKiB0aGUgY29tcG9uZW50IGFzIHdlbGwuXG4gKlxuICogQHBhcmFtIGNvbXBvbmVudCBUaGUgY29tcG9uZW50IHRvIHJldHVybiB0aGUgY29udGVudCB0ZXh0IGZvci5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldFJlbmRlcmVkVGV4dChjb21wb25lbnQ6IGFueSk6IHN0cmluZyB7XG4gIGNvbnN0IGhvc3RFbGVtZW50ID0gZ2V0SG9zdEVsZW1lbnQoY29tcG9uZW50KTtcbiAgcmV0dXJuIGhvc3RFbGVtZW50LnRleHRDb250ZW50IHx8ICcnO1xufVxuXG4vKipcbiAqIEV2ZW50IGxpc3RlbmVyIGNvbmZpZ3VyYXRpb24gcmV0dXJuZWQgZnJvbSBgZ2V0TGlzdGVuZXJzYC5cbiAqIEBwdWJsaWNBcGlcbiAqL1xuZXhwb3J0IGludGVyZmFjZSBMaXN0ZW5lciB7XG4gIC8qKiBOYW1lIG9mIHRoZSBldmVudCBsaXN0ZW5lci4gKi9cbiAgbmFtZTogc3RyaW5nO1xuICAvKiogRWxlbWVudCB0aGF0IHRoZSBsaXN0ZW5lciBpcyBib3VuZCB0by4gKi9cbiAgZWxlbWVudDogRWxlbWVudDtcbiAgLyoqIENhbGxiYWNrIHRoYXQgaXMgaW52b2tlZCB3aGVuIHRoZSBldmVudCBpcyB0cmlnZ2VyZWQuICovXG4gIGNhbGxiYWNrOiAodmFsdWU6IGFueSkgPT4gYW55O1xuICAvKiogV2hldGhlciB0aGUgbGlzdGVuZXIgaXMgdXNpbmcgZXZlbnQgY2FwdHVyaW5nLiAqL1xuICB1c2VDYXB0dXJlOiBib29sZWFuO1xuICAvKipcbiAgICogVHlwZSBvZiB0aGUgbGlzdGVuZXIgKGUuZy4gYSBuYXRpdmUgRE9NIGV2ZW50IG9yIGEgY3VzdG9tIEBPdXRwdXQpLlxuICAgKi9cbiAgdHlwZTogJ2RvbSd8J291dHB1dCc7XG59XG5cblxuLyoqXG4gKiBSZXRyaWV2ZXMgYSBsaXN0IG9mIGV2ZW50IGxpc3RlbmVycyBhc3NvY2lhdGVkIHdpdGggYSBET00gZWxlbWVudC4gVGhlIGxpc3QgZG9lcyBpbmNsdWRlIGhvc3RcbiAqIGxpc3RlbmVycywgYnV0IGl0IGRvZXMgbm90IGluY2x1ZGUgZXZlbnQgbGlzdGVuZXJzIGRlZmluZWQgb3V0c2lkZSBvZiB0aGUgQW5ndWxhciBjb250ZXh0XG4gKiAoZS5nLiB0aHJvdWdoIGBhZGRFdmVudExpc3RlbmVyYCkuXG4gKlxuICogQHVzYWdlTm90ZXNcbiAqIEdpdmVuIHRoZSBmb2xsb3dpbmcgRE9NIHN0cnVjdHVyZTpcbiAqXG4gKiBgYGBodG1sXG4gKiA8YXBwLXJvb3Q+XG4gKiAgIDxkaXYgKGNsaWNrKT1cImRvU29tZXRoaW5nKClcIj48L2Rpdj5cbiAqIDwvYXBwLXJvb3Q+XG4gKiBgYGBcbiAqXG4gKiBDYWxsaW5nIGBnZXRMaXN0ZW5lcnNgIG9uIGA8ZGl2PmAgd2lsbCByZXR1cm4gYW4gb2JqZWN0IHRoYXQgbG9va3MgYXMgZm9sbG93czpcbiAqXG4gKiBgYGB0c1xuICoge1xuICogICBuYW1lOiAnY2xpY2snLFxuICogICBlbGVtZW50OiA8ZGl2PixcbiAqICAgY2FsbGJhY2s6ICgpID0+IGRvU29tZXRoaW5nKCksXG4gKiAgIHVzZUNhcHR1cmU6IGZhbHNlXG4gKiB9XG4gKiBgYGBcbiAqXG4gKiBAcGFyYW0gZWxlbWVudCBFbGVtZW50IGZvciB3aGljaCB0aGUgRE9NIGxpc3RlbmVycyBzaG91bGQgYmUgcmV0cmlldmVkLlxuICogQHJldHVybnMgQXJyYXkgb2YgZXZlbnQgbGlzdGVuZXJzIG9uIHRoZSBET00gZWxlbWVudC5cbiAqXG4gKiBAcHVibGljQXBpXG4gKiBAZ2xvYmFsQXBpIG5nXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXRMaXN0ZW5lcnMoZWxlbWVudDogRWxlbWVudCk6IExpc3RlbmVyW10ge1xuICBuZ0Rldk1vZGUgJiYgYXNzZXJ0RG9tRWxlbWVudChlbGVtZW50KTtcbiAgY29uc3QgbENvbnRleHQgPSBnZXRMQ29udGV4dChlbGVtZW50KTtcbiAgY29uc3QgbFZpZXcgPSBsQ29udGV4dCA9PT0gbnVsbCA/IG51bGwgOiBsQ29udGV4dC5sVmlldztcbiAgaWYgKGxWaWV3ID09PSBudWxsKSByZXR1cm4gW107XG5cbiAgY29uc3QgdFZpZXcgPSBsVmlld1tUVklFV107XG4gIGNvbnN0IGxDbGVhbnVwID0gbFZpZXdbQ0xFQU5VUF07XG4gIGNvbnN0IHRDbGVhbnVwID0gdFZpZXcuY2xlYW51cDtcbiAgY29uc3QgbGlzdGVuZXJzOiBMaXN0ZW5lcltdID0gW107XG4gIGlmICh0Q2xlYW51cCAmJiBsQ2xlYW51cCkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgdENsZWFudXAubGVuZ3RoOykge1xuICAgICAgY29uc3QgZmlyc3RQYXJhbSA9IHRDbGVhbnVwW2krK107XG4gICAgICBjb25zdCBzZWNvbmRQYXJhbSA9IHRDbGVhbnVwW2krK107XG4gICAgICBpZiAodHlwZW9mIGZpcnN0UGFyYW0gPT09ICdzdHJpbmcnKSB7XG4gICAgICAgIGNvbnN0IG5hbWU6IHN0cmluZyA9IGZpcnN0UGFyYW07XG4gICAgICAgIGNvbnN0IGxpc3RlbmVyRWxlbWVudCA9IHVud3JhcFJOb2RlKGxWaWV3W3NlY29uZFBhcmFtXSkgYXMgYW55IGFzIEVsZW1lbnQ7XG4gICAgICAgIGNvbnN0IGNhbGxiYWNrOiAodmFsdWU6IGFueSkgPT4gYW55ID0gbENsZWFudXBbdENsZWFudXBbaSsrXV07XG4gICAgICAgIGNvbnN0IHVzZUNhcHR1cmVPckluZHggPSB0Q2xlYW51cFtpKytdO1xuICAgICAgICAvLyBpZiB1c2VDYXB0dXJlT3JJbmR4IGlzIGJvb2xlYW4gdGhlbiByZXBvcnQgaXQgYXMgaXMuXG4gICAgICAgIC8vIGlmIHVzZUNhcHR1cmVPckluZHggaXMgcG9zaXRpdmUgbnVtYmVyIHRoZW4gaXQgaW4gdW5zdWJzY3JpYmUgbWV0aG9kXG4gICAgICAgIC8vIGlmIHVzZUNhcHR1cmVPckluZHggaXMgbmVnYXRpdmUgbnVtYmVyIHRoZW4gaXQgaXMgYSBTdWJzY3JpcHRpb25cbiAgICAgICAgY29uc3QgdHlwZSA9XG4gICAgICAgICAgICAodHlwZW9mIHVzZUNhcHR1cmVPckluZHggPT09ICdib29sZWFuJyB8fCB1c2VDYXB0dXJlT3JJbmR4ID49IDApID8gJ2RvbScgOiAnb3V0cHV0JztcbiAgICAgICAgY29uc3QgdXNlQ2FwdHVyZSA9IHR5cGVvZiB1c2VDYXB0dXJlT3JJbmR4ID09PSAnYm9vbGVhbicgPyB1c2VDYXB0dXJlT3JJbmR4IDogZmFsc2U7XG4gICAgICAgIGlmIChlbGVtZW50ID09IGxpc3RlbmVyRWxlbWVudCkge1xuICAgICAgICAgIGxpc3RlbmVycy5wdXNoKHtlbGVtZW50LCBuYW1lLCBjYWxsYmFjaywgdXNlQ2FwdHVyZSwgdHlwZX0pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG4gIGxpc3RlbmVycy5zb3J0KHNvcnRMaXN0ZW5lcnMpO1xuICByZXR1cm4gbGlzdGVuZXJzO1xufVxuXG5mdW5jdGlvbiBzb3J0TGlzdGVuZXJzKGE6IExpc3RlbmVyLCBiOiBMaXN0ZW5lcikge1xuICBpZiAoYS5uYW1lID09IGIubmFtZSkgcmV0dXJuIDA7XG4gIHJldHVybiBhLm5hbWUgPCBiLm5hbWUgPyAtMSA6IDE7XG59XG5cbi8qKlxuICogVGhpcyBmdW5jdGlvbiBzaG91bGQgbm90IGV4aXN0IGJlY2F1c2UgaXQgaXMgbWVnYW1vcnBoaWMgYW5kIG9ubHkgbW9zdGx5IGNvcnJlY3QuXG4gKlxuICogU2VlIGNhbGwgc2l0ZSBmb3IgbW9yZSBpbmZvLlxuICovXG5mdW5jdGlvbiBpc0RpcmVjdGl2ZURlZkhhY2sob2JqOiBhbnkpOiBvYmogaXMgRGlyZWN0aXZlRGVmPGFueT4ge1xuICByZXR1cm4gb2JqLnR5cGUgIT09IHVuZGVmaW5lZCAmJiBvYmoudGVtcGxhdGUgIT09IHVuZGVmaW5lZCAmJiBvYmouZGVjbGFyZWRJbnB1dHMgIT09IHVuZGVmaW5lZDtcbn1cblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBhdHRhY2hlZCBgRGVidWdOb2RlYCBpbnN0YW5jZSBmb3IgYW4gZWxlbWVudCBpbiB0aGUgRE9NLlxuICpcbiAqIEBwYXJhbSBlbGVtZW50IERPTSBlbGVtZW50IHdoaWNoIGlzIG93bmVkIGJ5IGFuIGV4aXN0aW5nIGNvbXBvbmVudCdzIHZpZXcuXG4gKi9cbmV4cG9ydCBmdW5jdGlvbiBnZXREZWJ1Z05vZGUoZWxlbWVudDogRWxlbWVudCk6IERlYnVnTm9kZXxudWxsIHtcbiAgaWYgKG5nRGV2TW9kZSAmJiAhKGVsZW1lbnQgaW5zdGFuY2VvZiBOb2RlKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignRXhwZWN0aW5nIGluc3RhbmNlIG9mIERPTSBFbGVtZW50Jyk7XG4gIH1cblxuICBjb25zdCBsQ29udGV4dCA9IGdldExDb250ZXh0KGVsZW1lbnQpITtcbiAgY29uc3QgbFZpZXcgPSBsQ29udGV4dCA/IGxDb250ZXh0LmxWaWV3IDogbnVsbDtcblxuICBpZiAobFZpZXcgPT09IG51bGwpIHtcbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIGNvbnN0IG5vZGVJbmRleCA9IGxDb250ZXh0Lm5vZGVJbmRleDtcbiAgaWYgKG5vZGVJbmRleCAhPT0gLTEpIHtcbiAgICBjb25zdCB2YWx1ZUluTFZpZXcgPSBsVmlld1tub2RlSW5kZXhdO1xuICAgIC8vIHRoaXMgbWVhbnMgdGhhdCB2YWx1ZSBpbiB0aGUgbFZpZXcgaXMgYSBjb21wb25lbnQgd2l0aCBpdHMgb3duXG4gICAgLy8gZGF0YS4gSW4gdGhpcyBzaXR1YXRpb24gdGhlIFROb2RlIGlzIG5vdCBhY2Nlc3NlZCBhdCB0aGUgc2FtZSBzcG90LlxuICAgIGNvbnN0IHROb2RlID1cbiAgICAgICAgaXNMVmlldyh2YWx1ZUluTFZpZXcpID8gKHZhbHVlSW5MVmlld1tUX0hPU1RdIGFzIFROb2RlKSA6IGdldFROb2RlKGxWaWV3W1RWSUVXXSwgbm9kZUluZGV4KTtcbiAgICBuZ0Rldk1vZGUgJiZcbiAgICAgICAgYXNzZXJ0RXF1YWwodE5vZGUuaW5kZXgsIG5vZGVJbmRleCwgJ0V4cGVjdGluZyB0aGF0IFROb2RlIGF0IGluZGV4IGlzIHNhbWUgYXMgaW5kZXgnKTtcbiAgICByZXR1cm4gYnVpbGREZWJ1Z05vZGUodE5vZGUsIGxWaWV3KTtcbiAgfVxuXG4gIHJldHVybiBudWxsO1xufVxuXG4vKipcbiAqIFJldHJpZXZlIHRoZSBjb21wb25lbnQgYExWaWV3YCBmcm9tIGNvbXBvbmVudC9lbGVtZW50LlxuICpcbiAqIE5PVEU6IGBMVmlld2AgaXMgYSBwcml2YXRlIGFuZCBzaG91bGQgbm90IGJlIGxlYWtlZCBvdXRzaWRlLlxuICogICAgICAgRG9uJ3QgZXhwb3J0IHRoaXMgbWV0aG9kIHRvIGBuZy4qYCBvbiB3aW5kb3cuXG4gKlxuICogQHBhcmFtIHRhcmdldCBET00gZWxlbWVudCBvciBjb21wb25lbnQgaW5zdGFuY2UgZm9yIHdoaWNoIHRvIHJldHJpZXZlIHRoZSBMVmlldy5cbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGdldENvbXBvbmVudExWaWV3KHRhcmdldDogYW55KTogTFZpZXcge1xuICBjb25zdCBsQ29udGV4dCA9IGdldExDb250ZXh0KHRhcmdldCkhO1xuICBjb25zdCBub2RlSW5keCA9IGxDb250ZXh0Lm5vZGVJbmRleDtcbiAgY29uc3QgbFZpZXcgPSBsQ29udGV4dC5sVmlldyE7XG4gIG5nRGV2TW9kZSAmJiBhc3NlcnRMVmlldyhsVmlldyk7XG4gIGNvbnN0IGNvbXBvbmVudExWaWV3ID0gbFZpZXdbbm9kZUluZHhdO1xuICBuZ0Rldk1vZGUgJiYgYXNzZXJ0TFZpZXcoY29tcG9uZW50TFZpZXcpO1xuICByZXR1cm4gY29tcG9uZW50TFZpZXc7XG59XG5cbi8qKiBBc3NlcnRzIHRoYXQgYSB2YWx1ZSBpcyBhIERPTSBFbGVtZW50LiAqL1xuZnVuY3Rpb24gYXNzZXJ0RG9tRWxlbWVudCh2YWx1ZTogYW55KSB7XG4gIGlmICh0eXBlb2YgRWxlbWVudCAhPT0gJ3VuZGVmaW5lZCcgJiYgISh2YWx1ZSBpbnN0YW5jZW9mIEVsZW1lbnQpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdFeHBlY3RpbmcgaW5zdGFuY2Ugb2YgRE9NIEVsZW1lbnQnKTtcbiAgfVxufVxuIl19