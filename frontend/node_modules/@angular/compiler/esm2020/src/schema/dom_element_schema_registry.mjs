/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
import { CUSTOM_ELEMENTS_SCHEMA, NO_ERRORS_SCHEMA, SecurityContext } from '../core';
import { isNgContainer, isNgContent } from '../ml_parser/tags';
import { dashCaseToCamelCase } from '../util';
import { SECURITY_SCHEMA } from './dom_security_schema';
import { ElementSchemaRegistry } from './element_schema_registry';
const EVENT = 'event';
const BOOLEAN = 'boolean';
const NUMBER = 'number';
const STRING = 'string';
const OBJECT = 'object';
/**
 * This array represents the DOM schema. It encodes inheritance, properties, and events.
 *
 * ## Overview
 *
 * Each line represents one kind of element. The `element_inheritance` and properties are joined
 * using `element_inheritance|properties` syntax.
 *
 * ## Element Inheritance
 *
 * The `element_inheritance` can be further subdivided as `element1,element2,...^parentElement`.
 * Here the individual elements are separated by `,` (commas). Every element in the list
 * has identical properties.
 *
 * An `element` may inherit additional properties from `parentElement` If no `^parentElement` is
 * specified then `""` (blank) element is assumed.
 *
 * NOTE: The blank element inherits from root `[Element]` element, the super element of all
 * elements.
 *
 * NOTE an element prefix such as `:svg:` has no special meaning to the schema.
 *
 * ## Properties
 *
 * Each element has a set of properties separated by `,` (commas). Each property can be prefixed
 * by a special character designating its type:
 *
 * - (no prefix): property is a string.
 * - `*`: property represents an event.
 * - `!`: property is a boolean.
 * - `#`: property is a number.
 * - `%`: property is an object.
 *
 * ## Query
 *
 * The class creates an internal squas representation which allows to easily answer the query of
 * if a given property exist on a given element.
 *
 * NOTE: We don't yet support querying for types or events.
 * NOTE: This schema is auto extracted from `schema_extractor.ts` located in the test folder,
 *       see dom_element_schema_registry_spec.ts
 */
// =================================================================================================
// =================================================================================================
// =========== S T O P   -  S T O P   -  S T O P   -  S T O P   -  S T O P   -  S T O P  ===========
// =================================================================================================
// =================================================================================================
//
//                       DO NOT EDIT THIS DOM SCHEMA WITHOUT A SECURITY REVIEW!
//
// Newly added properties must be security reviewed and assigned an appropriate SecurityContext in
// dom_security_schema.ts. Reach out to mprobst & rjamet for details.
//
// =================================================================================================
const SCHEMA = [
    '[Element]|textContent,%classList,className,id,innerHTML,*beforecopy,*beforecut,*beforepaste,*copy,*cut,*paste,*search,*selectstart,*webkitfullscreenchange,*webkitfullscreenerror,*wheel,outerHTML,#scrollLeft,#scrollTop,slot' +
        /* added manually to avoid breaking changes */
        ',*message,*mozfullscreenchange,*mozfullscreenerror,*mozpointerlockchange,*mozpointerlockerror,*webglcontextcreationerror,*webglcontextlost,*webglcontextrestored',
    '[HTMLElement]^[Element]|accessKey,contentEditable,dir,!draggable,!hidden,innerText,lang,*abort,*auxclick,*blur,*cancel,*canplay,*canplaythrough,*change,*click,*close,*contextmenu,*cuechange,*dblclick,*drag,*dragend,*dragenter,*dragleave,*dragover,*dragstart,*drop,*durationchange,*emptied,*ended,*error,*focus,*gotpointercapture,*input,*invalid,*keydown,*keypress,*keyup,*load,*loadeddata,*loadedmetadata,*loadstart,*lostpointercapture,*mousedown,*mouseenter,*mouseleave,*mousemove,*mouseout,*mouseover,*mouseup,*mousewheel,*pause,*play,*playing,*pointercancel,*pointerdown,*pointerenter,*pointerleave,*pointermove,*pointerout,*pointerover,*pointerup,*progress,*ratechange,*reset,*resize,*scroll,*seeked,*seeking,*select,*show,*stalled,*submit,*suspend,*timeupdate,*toggle,*volumechange,*waiting,outerText,!spellcheck,%style,#tabIndex,title,!translate',
    'abbr,address,article,aside,b,bdi,bdo,cite,code,dd,dfn,dt,em,figcaption,figure,footer,header,i,kbd,main,mark,nav,noscript,rb,rp,rt,rtc,ruby,s,samp,section,small,strong,sub,sup,u,var,wbr^[HTMLElement]|accessKey,contentEditable,dir,!draggable,!hidden,innerText,lang,*abort,*auxclick,*blur,*cancel,*canplay,*canplaythrough,*change,*click,*close,*contextmenu,*cuechange,*dblclick,*drag,*dragend,*dragenter,*dragleave,*dragover,*dragstart,*drop,*durationchange,*emptied,*ended,*error,*focus,*gotpointercapture,*input,*invalid,*keydown,*keypress,*keyup,*load,*loadeddata,*loadedmetadata,*loadstart,*lostpointercapture,*mousedown,*mouseenter,*mouseleave,*mousemove,*mouseout,*mouseover,*mouseup,*mousewheel,*pause,*play,*playing,*pointercancel,*pointerdown,*pointerenter,*pointerleave,*pointermove,*pointerout,*pointerover,*pointerup,*progress,*ratechange,*reset,*resize,*scroll,*seeked,*seeking,*select,*show,*stalled,*submit,*suspend,*timeupdate,*toggle,*volumechange,*waiting,outerText,!spellcheck,%style,#tabIndex,title,!translate',
    'media^[HTMLElement]|!autoplay,!controls,%controlsList,%crossOrigin,#currentTime,!defaultMuted,#defaultPlaybackRate,!disableRemotePlayback,!loop,!muted,*encrypted,*waitingforkey,#playbackRate,preload,src,%srcObject,#volume',
    ':svg:^[HTMLElement]|*abort,*auxclick,*blur,*cancel,*canplay,*canplaythrough,*change,*click,*close,*contextmenu,*cuechange,*dblclick,*drag,*dragend,*dragenter,*dragleave,*dragover,*dragstart,*drop,*durationchange,*emptied,*ended,*error,*focus,*gotpointercapture,*input,*invalid,*keydown,*keypress,*keyup,*load,*loadeddata,*loadedmetadata,*loadstart,*lostpointercapture,*mousedown,*mouseenter,*mouseleave,*mousemove,*mouseout,*mouseover,*mouseup,*mousewheel,*pause,*play,*playing,*pointercancel,*pointerdown,*pointerenter,*pointerleave,*pointermove,*pointerout,*pointerover,*pointerup,*progress,*ratechange,*reset,*resize,*scroll,*seeked,*seeking,*select,*show,*stalled,*submit,*suspend,*timeupdate,*toggle,*volumechange,*waiting,%style,#tabIndex',
    ':svg:graphics^:svg:|',
    ':svg:animation^:svg:|*begin,*end,*repeat',
    ':svg:geometry^:svg:|',
    ':svg:componentTransferFunction^:svg:|',
    ':svg:gradient^:svg:|',
    ':svg:textContent^:svg:graphics|',
    ':svg:textPositioning^:svg:textContent|',
    'a^[HTMLElement]|charset,coords,download,hash,host,hostname,href,hreflang,name,password,pathname,ping,port,protocol,referrerPolicy,rel,rev,search,shape,target,text,type,username',
    'area^[HTMLElement]|alt,coords,download,hash,host,hostname,href,!noHref,password,pathname,ping,port,protocol,referrerPolicy,rel,search,shape,target,username',
    'audio^media|',
    'br^[HTMLElement]|clear',
    'base^[HTMLElement]|href,target',
    'body^[HTMLElement]|aLink,background,bgColor,link,*beforeunload,*blur,*error,*focus,*hashchange,*languagechange,*load,*message,*offline,*online,*pagehide,*pageshow,*popstate,*rejectionhandled,*resize,*scroll,*storage,*unhandledrejection,*unload,text,vLink',
    'button^[HTMLElement]|!autofocus,!disabled,formAction,formEnctype,formMethod,!formNoValidate,formTarget,name,type,value',
    'canvas^[HTMLElement]|#height,#width',
    'content^[HTMLElement]|select',
    'dl^[HTMLElement]|!compact',
    'datalist^[HTMLElement]|',
    'details^[HTMLElement]|!open',
    'dialog^[HTMLElement]|!open,returnValue',
    'dir^[HTMLElement]|!compact',
    'div^[HTMLElement]|align',
    'embed^[HTMLElement]|align,height,name,src,type,width',
    'fieldset^[HTMLElement]|!disabled,name',
    'font^[HTMLElement]|color,face,size',
    'form^[HTMLElement]|acceptCharset,action,autocomplete,encoding,enctype,method,name,!noValidate,target',
    'frame^[HTMLElement]|frameBorder,longDesc,marginHeight,marginWidth,name,!noResize,scrolling,src',
    'frameset^[HTMLElement]|cols,*beforeunload,*blur,*error,*focus,*hashchange,*languagechange,*load,*message,*offline,*online,*pagehide,*pageshow,*popstate,*rejectionhandled,*resize,*scroll,*storage,*unhandledrejection,*unload,rows',
    'hr^[HTMLElement]|align,color,!noShade,size,width',
    'head^[HTMLElement]|',
    'h1,h2,h3,h4,h5,h6^[HTMLElement]|align',
    'html^[HTMLElement]|version',
    'iframe^[HTMLElement]|align,!allowFullscreen,frameBorder,height,longDesc,marginHeight,marginWidth,name,referrerPolicy,%sandbox,scrolling,src,srcdoc,width',
    'img^[HTMLElement]|align,alt,border,%crossOrigin,#height,#hspace,!isMap,longDesc,lowsrc,name,referrerPolicy,sizes,src,srcset,useMap,#vspace,#width',
    'input^[HTMLElement]|accept,align,alt,autocapitalize,autocomplete,!autofocus,!checked,!defaultChecked,defaultValue,dirName,!disabled,%files,formAction,formEnctype,formMethod,!formNoValidate,formTarget,#height,!incremental,!indeterminate,max,#maxLength,min,#minLength,!multiple,name,pattern,placeholder,!readOnly,!required,selectionDirection,#selectionEnd,#selectionStart,#size,src,step,type,useMap,value,%valueAsDate,#valueAsNumber,#width',
    'li^[HTMLElement]|type,#value',
    'label^[HTMLElement]|htmlFor',
    'legend^[HTMLElement]|align',
    'link^[HTMLElement]|as,charset,%crossOrigin,!disabled,href,hreflang,integrity,media,referrerPolicy,rel,%relList,rev,%sizes,target,type',
    'map^[HTMLElement]|name',
    'marquee^[HTMLElement]|behavior,bgColor,direction,height,#hspace,#loop,#scrollAmount,#scrollDelay,!trueSpeed,#vspace,width',
    'menu^[HTMLElement]|!compact',
    'meta^[HTMLElement]|content,httpEquiv,name,scheme',
    'meter^[HTMLElement]|#high,#low,#max,#min,#optimum,#value',
    'ins,del^[HTMLElement]|cite,dateTime',
    'ol^[HTMLElement]|!compact,!reversed,#start,type',
    'object^[HTMLElement]|align,archive,border,code,codeBase,codeType,data,!declare,height,#hspace,name,standby,type,useMap,#vspace,width',
    'optgroup^[HTMLElement]|!disabled,label',
    'option^[HTMLElement]|!defaultSelected,!disabled,label,!selected,text,value',
    'output^[HTMLElement]|defaultValue,%htmlFor,name,value',
    'p^[HTMLElement]|align',
    'param^[HTMLElement]|name,type,value,valueType',
    'picture^[HTMLElement]|',
    'pre^[HTMLElement]|#width',
    'progress^[HTMLElement]|#max,#value',
    'q,blockquote,cite^[HTMLElement]|',
    'script^[HTMLElement]|!async,charset,%crossOrigin,!defer,event,htmlFor,integrity,src,text,type',
    'select^[HTMLElement]|autocomplete,!autofocus,!disabled,#length,!multiple,name,!required,#selectedIndex,#size,value',
    'shadow^[HTMLElement]|',
    'slot^[HTMLElement]|name',
    'source^[HTMLElement]|media,sizes,src,srcset,type',
    'span^[HTMLElement]|',
    'style^[HTMLElement]|!disabled,media,type',
    'caption^[HTMLElement]|align',
    'th,td^[HTMLElement]|abbr,align,axis,bgColor,ch,chOff,#colSpan,headers,height,!noWrap,#rowSpan,scope,vAlign,width',
    'col,colgroup^[HTMLElement]|align,ch,chOff,#span,vAlign,width',
    'table^[HTMLElement]|align,bgColor,border,%caption,cellPadding,cellSpacing,frame,rules,summary,%tFoot,%tHead,width',
    'tr^[HTMLElement]|align,bgColor,ch,chOff,vAlign',
    'tfoot,thead,tbody^[HTMLElement]|align,ch,chOff,vAlign',
    'template^[HTMLElement]|',
    'textarea^[HTMLElement]|autocapitalize,autocomplete,!autofocus,#cols,defaultValue,dirName,!disabled,#maxLength,#minLength,name,placeholder,!readOnly,!required,#rows,selectionDirection,#selectionEnd,#selectionStart,value,wrap',
    'title^[HTMLElement]|text',
    'track^[HTMLElement]|!default,kind,label,src,srclang',
    'ul^[HTMLElement]|!compact,type',
    'unknown^[HTMLElement]|',
    'video^media|#height,poster,#width',
    ':svg:a^:svg:graphics|',
    ':svg:animate^:svg:animation|',
    ':svg:animateMotion^:svg:animation|',
    ':svg:animateTransform^:svg:animation|',
    ':svg:circle^:svg:geometry|',
    ':svg:clipPath^:svg:graphics|',
    ':svg:defs^:svg:graphics|',
    ':svg:desc^:svg:|',
    ':svg:discard^:svg:|',
    ':svg:ellipse^:svg:geometry|',
    ':svg:feBlend^:svg:|',
    ':svg:feColorMatrix^:svg:|',
    ':svg:feComponentTransfer^:svg:|',
    ':svg:feComposite^:svg:|',
    ':svg:feConvolveMatrix^:svg:|',
    ':svg:feDiffuseLighting^:svg:|',
    ':svg:feDisplacementMap^:svg:|',
    ':svg:feDistantLight^:svg:|',
    ':svg:feDropShadow^:svg:|',
    ':svg:feFlood^:svg:|',
    ':svg:feFuncA^:svg:componentTransferFunction|',
    ':svg:feFuncB^:svg:componentTransferFunction|',
    ':svg:feFuncG^:svg:componentTransferFunction|',
    ':svg:feFuncR^:svg:componentTransferFunction|',
    ':svg:feGaussianBlur^:svg:|',
    ':svg:feImage^:svg:|',
    ':svg:feMerge^:svg:|',
    ':svg:feMergeNode^:svg:|',
    ':svg:feMorphology^:svg:|',
    ':svg:feOffset^:svg:|',
    ':svg:fePointLight^:svg:|',
    ':svg:feSpecularLighting^:svg:|',
    ':svg:feSpotLight^:svg:|',
    ':svg:feTile^:svg:|',
    ':svg:feTurbulence^:svg:|',
    ':svg:filter^:svg:|',
    ':svg:foreignObject^:svg:graphics|',
    ':svg:g^:svg:graphics|',
    ':svg:image^:svg:graphics|',
    ':svg:line^:svg:geometry|',
    ':svg:linearGradient^:svg:gradient|',
    ':svg:mpath^:svg:|',
    ':svg:marker^:svg:|',
    ':svg:mask^:svg:|',
    ':svg:metadata^:svg:|',
    ':svg:path^:svg:geometry|',
    ':svg:pattern^:svg:|',
    ':svg:polygon^:svg:geometry|',
    ':svg:polyline^:svg:geometry|',
    ':svg:radialGradient^:svg:gradient|',
    ':svg:rect^:svg:geometry|',
    ':svg:svg^:svg:graphics|#currentScale,#zoomAndPan',
    ':svg:script^:svg:|type',
    ':svg:set^:svg:animation|',
    ':svg:stop^:svg:|',
    ':svg:style^:svg:|!disabled,media,title,type',
    ':svg:switch^:svg:graphics|',
    ':svg:symbol^:svg:|',
    ':svg:tspan^:svg:textPositioning|',
    ':svg:text^:svg:textPositioning|',
    ':svg:textPath^:svg:textContent|',
    ':svg:title^:svg:|',
    ':svg:use^:svg:graphics|',
    ':svg:view^:svg:|#zoomAndPan',
    'data^[HTMLElement]|value',
    'keygen^[HTMLElement]|!autofocus,challenge,!disabled,form,keytype,name',
    'menuitem^[HTMLElement]|type,label,icon,!disabled,!checked,radiogroup,!default',
    'summary^[HTMLElement]|',
    'time^[HTMLElement]|dateTime',
    ':svg:cursor^:svg:|',
];
const _ATTR_TO_PROP = new Map(Object.entries({
    'class': 'className',
    'for': 'htmlFor',
    'formaction': 'formAction',
    'innerHtml': 'innerHTML',
    'readonly': 'readOnly',
    'tabindex': 'tabIndex',
}));
// Invert _ATTR_TO_PROP.
const _PROP_TO_ATTR = Array.from(_ATTR_TO_PROP).reduce((inverted, [propertyName, attributeName]) => {
    inverted.set(propertyName, attributeName);
    return inverted;
}, new Map());
export class DomElementSchemaRegistry extends ElementSchemaRegistry {
    constructor() {
        super();
        this._schema = new Map();
        // We don't allow binding to events for security reasons. Allowing event bindings would almost
        // certainly introduce bad XSS vulnerabilities. Instead, we store events in a separate schema.
        this._eventSchema = new Map;
        SCHEMA.forEach(encodedType => {
            const type = new Map();
            const events = new Set();
            const [strType, strProperties] = encodedType.split('|');
            const properties = strProperties.split(',');
            const [typeNames, superName] = strType.split('^');
            typeNames.split(',').forEach(tag => {
                this._schema.set(tag.toLowerCase(), type);
                this._eventSchema.set(tag.toLowerCase(), events);
            });
            const superType = superName && this._schema.get(superName.toLowerCase());
            if (superType) {
                for (const [prop, value] of superType) {
                    type.set(prop, value);
                }
                for (const superEvent of this._eventSchema.get(superName.toLowerCase())) {
                    events.add(superEvent);
                }
            }
            properties.forEach((property) => {
                if (property.length > 0) {
                    switch (property[0]) {
                        case '*':
                            events.add(property.substring(1));
                            break;
                        case '!':
                            type.set(property.substring(1), BOOLEAN);
                            break;
                        case '#':
                            type.set(property.substring(1), NUMBER);
                            break;
                        case '%':
                            type.set(property.substring(1), OBJECT);
                            break;
                        default:
                            type.set(property, STRING);
                    }
                }
            });
        });
    }
    hasProperty(tagName, propName, schemaMetas) {
        if (schemaMetas.some((schema) => schema.name === NO_ERRORS_SCHEMA.name)) {
            return true;
        }
        if (tagName.indexOf('-') > -1) {
            if (isNgContainer(tagName) || isNgContent(tagName)) {
                return false;
            }
            if (schemaMetas.some((schema) => schema.name === CUSTOM_ELEMENTS_SCHEMA.name)) {
                // Can't tell now as we don't know which properties a custom element will get
                // once it is instantiated
                return true;
            }
        }
        const elementProperties = this._schema.get(tagName.toLowerCase()) || this._schema.get('unknown');
        return elementProperties.has(propName);
    }
    hasElement(tagName, schemaMetas) {
        if (schemaMetas.some((schema) => schema.name === NO_ERRORS_SCHEMA.name)) {
            return true;
        }
        if (tagName.indexOf('-') > -1) {
            if (isNgContainer(tagName) || isNgContent(tagName)) {
                return true;
            }
            if (schemaMetas.some((schema) => schema.name === CUSTOM_ELEMENTS_SCHEMA.name)) {
                // Allow any custom elements
                return true;
            }
        }
        return this._schema.has(tagName.toLowerCase());
    }
    /**
     * securityContext returns the security context for the given property on the given DOM tag.
     *
     * Tag and property name are statically known and cannot change at runtime, i.e. it is not
     * possible to bind a value into a changing attribute or tag name.
     *
     * The filtering is based on a list of allowed tags|attributes. All attributes in the schema
     * above are assumed to have the 'NONE' security context, i.e. that they are safe inert
     * string values. Only specific well known attack vectors are assigned their appropriate context.
     */
    securityContext(tagName, propName, isAttribute) {
        if (isAttribute) {
            // NB: For security purposes, use the mapped property name, not the attribute name.
            propName = this.getMappedPropName(propName);
        }
        // Make sure comparisons are case insensitive, so that case differences between attribute and
        // property names do not have a security impact.
        tagName = tagName.toLowerCase();
        propName = propName.toLowerCase();
        let ctx = SECURITY_SCHEMA()[tagName + '|' + propName];
        if (ctx) {
            return ctx;
        }
        ctx = SECURITY_SCHEMA()['*|' + propName];
        return ctx ? ctx : SecurityContext.NONE;
    }
    getMappedPropName(propName) {
        return _ATTR_TO_PROP.get(propName) ?? propName;
    }
    getDefaultComponentElementName() {
        return 'ng-component';
    }
    validateProperty(name) {
        if (name.toLowerCase().startsWith('on')) {
            const msg = `Binding to event property '${name}' is disallowed for security reasons, ` +
                `please use (${name.slice(2)})=...` +
                `\nIf '${name}' is a directive input, make sure the directive is imported by the` +
                ` current module.`;
            return { error: true, msg: msg };
        }
        else {
            return { error: false };
        }
    }
    validateAttribute(name) {
        if (name.toLowerCase().startsWith('on')) {
            const msg = `Binding to event attribute '${name}' is disallowed for security reasons, ` +
                `please use (${name.slice(2)})=...`;
            return { error: true, msg: msg };
        }
        else {
            return { error: false };
        }
    }
    allKnownElementNames() {
        return Array.from(this._schema.keys());
    }
    allKnownAttributesOfElement(tagName) {
        const elementProperties = this._schema.get(tagName.toLowerCase()) || this._schema.get('unknown');
        // Convert properties to attributes.
        return Array.from(elementProperties.keys()).map(prop => _PROP_TO_ATTR.get(prop) ?? prop);
    }
    allKnownEventsOfElement(tagName) {
        return Array.from(this._eventSchema.get(tagName.toLowerCase()) ?? []);
    }
    normalizeAnimationStyleProperty(propName) {
        return dashCaseToCamelCase(propName);
    }
    normalizeAnimationStyleValue(camelCaseProp, userProvidedProp, val) {
        let unit = '';
        const strVal = val.toString().trim();
        let errorMsg = null;
        if (_isPixelDimensionStyle(camelCaseProp) && val !== 0 && val !== '0') {
            if (typeof val === 'number') {
                unit = 'px';
            }
            else {
                const valAndSuffixMatch = val.match(/^[+-]?[\d\.]+([a-z]*)$/);
                if (valAndSuffixMatch && valAndSuffixMatch[1].length == 0) {
                    errorMsg = `Please provide a CSS unit value for ${userProvidedProp}:${val}`;
                }
            }
        }
        return { error: errorMsg, value: strVal + unit };
    }
}
function _isPixelDimensionStyle(prop) {
    switch (prop) {
        case 'width':
        case 'height':
        case 'minWidth':
        case 'minHeight':
        case 'maxWidth':
        case 'maxHeight':
        case 'left':
        case 'top':
        case 'bottom':
        case 'right':
        case 'fontSize':
        case 'outlineWidth':
        case 'outlineOffset':
        case 'paddingTop':
        case 'paddingLeft':
        case 'paddingBottom':
        case 'paddingRight':
        case 'marginTop':
        case 'marginLeft':
        case 'marginBottom':
        case 'marginRight':
        case 'borderRadius':
        case 'borderWidth':
        case 'borderTopWidth':
        case 'borderLeftWidth':
        case 'borderRightWidth':
        case 'borderBottomWidth':
        case 'textIndent':
            return true;
        default:
            return false;
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZG9tX2VsZW1lbnRfc2NoZW1hX3JlZ2lzdHJ5LmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcGFja2FnZXMvY29tcGlsZXIvc3JjL3NjaGVtYS9kb21fZWxlbWVudF9zY2hlbWFfcmVnaXN0cnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7OztHQU1HO0FBRUgsT0FBTyxFQUFDLHNCQUFzQixFQUFFLGdCQUFnQixFQUFrQixlQUFlLEVBQUMsTUFBTSxTQUFTLENBQUM7QUFDbEcsT0FBTyxFQUFDLGFBQWEsRUFBRSxXQUFXLEVBQUMsTUFBTSxtQkFBbUIsQ0FBQztBQUM3RCxPQUFPLEVBQUMsbUJBQW1CLEVBQUMsTUFBTSxTQUFTLENBQUM7QUFFNUMsT0FBTyxFQUFDLGVBQWUsRUFBQyxNQUFNLHVCQUF1QixDQUFDO0FBQ3RELE9BQU8sRUFBQyxxQkFBcUIsRUFBQyxNQUFNLDJCQUEyQixDQUFDO0FBRWhFLE1BQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQztBQUN0QixNQUFNLE9BQU8sR0FBRyxTQUFTLENBQUM7QUFDMUIsTUFBTSxNQUFNLEdBQUcsUUFBUSxDQUFDO0FBQ3hCLE1BQU0sTUFBTSxHQUFHLFFBQVEsQ0FBQztBQUN4QixNQUFNLE1BQU0sR0FBRyxRQUFRLENBQUM7QUFFeEI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0dBeUNHO0FBRUgsb0dBQW9HO0FBQ3BHLG9HQUFvRztBQUNwRyxvR0FBb0c7QUFDcEcsb0dBQW9HO0FBQ3BHLG9HQUFvRztBQUNwRyxFQUFFO0FBQ0YsK0VBQStFO0FBQy9FLEVBQUU7QUFDRixrR0FBa0c7QUFDbEcscUVBQXFFO0FBQ3JFLEVBQUU7QUFDRixvR0FBb0c7QUFFcEcsTUFBTSxNQUFNLEdBQWE7SUFDdkIsZ09BQWdPO1FBQzVOLDhDQUE4QztRQUM5QyxrS0FBa0s7SUFDdEsscTFCQUFxMUI7SUFDcjFCLG9nQ0FBb2dDO0lBQ3BnQywrTkFBK047SUFDL04sMHVCQUEwdUI7SUFDMXVCLHNCQUFzQjtJQUN0QiwwQ0FBMEM7SUFDMUMsc0JBQXNCO0lBQ3RCLHVDQUF1QztJQUN2QyxzQkFBc0I7SUFDdEIsaUNBQWlDO0lBQ2pDLHdDQUF3QztJQUN4QyxrTEFBa0w7SUFDbEwsNkpBQTZKO0lBQzdKLGNBQWM7SUFDZCx3QkFBd0I7SUFDeEIsZ0NBQWdDO0lBQ2hDLGdRQUFnUTtJQUNoUSx3SEFBd0g7SUFDeEgscUNBQXFDO0lBQ3JDLDhCQUE4QjtJQUM5QiwyQkFBMkI7SUFDM0IseUJBQXlCO0lBQ3pCLDZCQUE2QjtJQUM3Qix3Q0FBd0M7SUFDeEMsNEJBQTRCO0lBQzVCLHlCQUF5QjtJQUN6QixzREFBc0Q7SUFDdEQsdUNBQXVDO0lBQ3ZDLG9DQUFvQztJQUNwQyxzR0FBc0c7SUFDdEcsZ0dBQWdHO0lBQ2hHLHFPQUFxTztJQUNyTyxrREFBa0Q7SUFDbEQscUJBQXFCO0lBQ3JCLHVDQUF1QztJQUN2Qyw0QkFBNEI7SUFDNUIsMEpBQTBKO0lBQzFKLG1KQUFtSjtJQUNuSix1YkFBdWI7SUFDdmIsOEJBQThCO0lBQzlCLDZCQUE2QjtJQUM3Qiw0QkFBNEI7SUFDNUIsdUlBQXVJO0lBQ3ZJLHdCQUF3QjtJQUN4QiwySEFBMkg7SUFDM0gsNkJBQTZCO0lBQzdCLGtEQUFrRDtJQUNsRCwwREFBMEQ7SUFDMUQscUNBQXFDO0lBQ3JDLGlEQUFpRDtJQUNqRCxzSUFBc0k7SUFDdEksd0NBQXdDO0lBQ3hDLDRFQUE0RTtJQUM1RSx1REFBdUQ7SUFDdkQsdUJBQXVCO0lBQ3ZCLCtDQUErQztJQUMvQyx3QkFBd0I7SUFDeEIsMEJBQTBCO0lBQzFCLG9DQUFvQztJQUNwQyxrQ0FBa0M7SUFDbEMsK0ZBQStGO0lBQy9GLG9IQUFvSDtJQUNwSCx1QkFBdUI7SUFDdkIseUJBQXlCO0lBQ3pCLGtEQUFrRDtJQUNsRCxxQkFBcUI7SUFDckIsMENBQTBDO0lBQzFDLDZCQUE2QjtJQUM3QixrSEFBa0g7SUFDbEgsOERBQThEO0lBQzlELG1IQUFtSDtJQUNuSCxnREFBZ0Q7SUFDaEQsdURBQXVEO0lBQ3ZELHlCQUF5QjtJQUN6QixpT0FBaU87SUFDak8sMEJBQTBCO0lBQzFCLHFEQUFxRDtJQUNyRCxnQ0FBZ0M7SUFDaEMsd0JBQXdCO0lBQ3hCLG1DQUFtQztJQUNuQyx1QkFBdUI7SUFDdkIsOEJBQThCO0lBQzlCLG9DQUFvQztJQUNwQyx1Q0FBdUM7SUFDdkMsNEJBQTRCO0lBQzVCLDhCQUE4QjtJQUM5QiwwQkFBMEI7SUFDMUIsa0JBQWtCO0lBQ2xCLHFCQUFxQjtJQUNyQiw2QkFBNkI7SUFDN0IscUJBQXFCO0lBQ3JCLDJCQUEyQjtJQUMzQixpQ0FBaUM7SUFDakMseUJBQXlCO0lBQ3pCLDhCQUE4QjtJQUM5QiwrQkFBK0I7SUFDL0IsK0JBQStCO0lBQy9CLDRCQUE0QjtJQUM1QiwwQkFBMEI7SUFDMUIscUJBQXFCO0lBQ3JCLDhDQUE4QztJQUM5Qyw4Q0FBOEM7SUFDOUMsOENBQThDO0lBQzlDLDhDQUE4QztJQUM5Qyw0QkFBNEI7SUFDNUIscUJBQXFCO0lBQ3JCLHFCQUFxQjtJQUNyQix5QkFBeUI7SUFDekIsMEJBQTBCO0lBQzFCLHNCQUFzQjtJQUN0QiwwQkFBMEI7SUFDMUIsZ0NBQWdDO0lBQ2hDLHlCQUF5QjtJQUN6QixvQkFBb0I7SUFDcEIsMEJBQTBCO0lBQzFCLG9CQUFvQjtJQUNwQixtQ0FBbUM7SUFDbkMsdUJBQXVCO0lBQ3ZCLDJCQUEyQjtJQUMzQiwwQkFBMEI7SUFDMUIsb0NBQW9DO0lBQ3BDLG1CQUFtQjtJQUNuQixvQkFBb0I7SUFDcEIsa0JBQWtCO0lBQ2xCLHNCQUFzQjtJQUN0QiwwQkFBMEI7SUFDMUIscUJBQXFCO0lBQ3JCLDZCQUE2QjtJQUM3Qiw4QkFBOEI7SUFDOUIsb0NBQW9DO0lBQ3BDLDBCQUEwQjtJQUMxQixrREFBa0Q7SUFDbEQsd0JBQXdCO0lBQ3hCLDBCQUEwQjtJQUMxQixrQkFBa0I7SUFDbEIsNkNBQTZDO0lBQzdDLDRCQUE0QjtJQUM1QixvQkFBb0I7SUFDcEIsa0NBQWtDO0lBQ2xDLGlDQUFpQztJQUNqQyxpQ0FBaUM7SUFDakMsbUJBQW1CO0lBQ25CLHlCQUF5QjtJQUN6Qiw2QkFBNkI7SUFDN0IsMEJBQTBCO0lBQzFCLHVFQUF1RTtJQUN2RSwrRUFBK0U7SUFDL0Usd0JBQXdCO0lBQ3hCLDZCQUE2QjtJQUM3QixvQkFBb0I7Q0FDckIsQ0FBQztBQUVGLE1BQU0sYUFBYSxHQUFHLElBQUksR0FBRyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7SUFDM0MsT0FBTyxFQUFFLFdBQVc7SUFDcEIsS0FBSyxFQUFFLFNBQVM7SUFDaEIsWUFBWSxFQUFFLFlBQVk7SUFDMUIsV0FBVyxFQUFFLFdBQVc7SUFDeEIsVUFBVSxFQUFFLFVBQVU7SUFDdEIsVUFBVSxFQUFFLFVBQVU7Q0FDdkIsQ0FBQyxDQUFDLENBQUM7QUFFSix3QkFBd0I7QUFDeEIsTUFBTSxhQUFhLEdBQ2YsS0FBSyxDQUFDLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxZQUFZLEVBQUUsYUFBYSxDQUFDLEVBQUUsRUFBRTtJQUMzRSxRQUFRLENBQUMsR0FBRyxDQUFDLFlBQVksRUFBRSxhQUFhLENBQUMsQ0FBQztJQUMxQyxPQUFPLFFBQVEsQ0FBQztBQUNsQixDQUFDLEVBQUUsSUFBSSxHQUFHLEVBQWtCLENBQUMsQ0FBQztBQUVsQyxNQUFNLE9BQU8sd0JBQXlCLFNBQVEscUJBQXFCO0lBTWpFO1FBQ0UsS0FBSyxFQUFFLENBQUM7UUFORixZQUFPLEdBQUcsSUFBSSxHQUFHLEVBQStCLENBQUM7UUFDekQsOEZBQThGO1FBQzlGLDhGQUE4RjtRQUN0RixpQkFBWSxHQUFHLElBQUksR0FBd0IsQ0FBQztRQUlsRCxNQUFNLENBQUMsT0FBTyxDQUFDLFdBQVcsQ0FBQyxFQUFFO1lBQzNCLE1BQU0sSUFBSSxHQUFHLElBQUksR0FBRyxFQUFrQixDQUFDO1lBQ3ZDLE1BQU0sTUFBTSxHQUFnQixJQUFJLEdBQUcsRUFBRSxDQUFDO1lBQ3RDLE1BQU0sQ0FBQyxPQUFPLEVBQUUsYUFBYSxDQUFDLEdBQUcsV0FBVyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUN4RCxNQUFNLFVBQVUsR0FBRyxhQUFhLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1lBQzVDLE1BQU0sQ0FBQyxTQUFTLEVBQUUsU0FBUyxDQUFDLEdBQUcsT0FBTyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztZQUNsRCxTQUFTLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsRUFBRTtnQkFDakMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLFdBQVcsRUFBRSxFQUFFLElBQUksQ0FBQyxDQUFDO2dCQUMxQyxJQUFJLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsV0FBVyxFQUFFLEVBQUUsTUFBTSxDQUFDLENBQUM7WUFDbkQsQ0FBQyxDQUFDLENBQUM7WUFDSCxNQUFNLFNBQVMsR0FBRyxTQUFTLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxDQUFDLENBQUM7WUFDekUsSUFBSSxTQUFTLEVBQUU7Z0JBQ2IsS0FBSyxNQUFNLENBQUMsSUFBSSxFQUFFLEtBQUssQ0FBQyxJQUFJLFNBQVMsRUFBRTtvQkFDckMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxJQUFJLEVBQUUsS0FBSyxDQUFDLENBQUM7aUJBQ3ZCO2dCQUNELEtBQUssTUFBTSxVQUFVLElBQUksSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxDQUFFLEVBQUU7b0JBQ3hFLE1BQU0sQ0FBQyxHQUFHLENBQUMsVUFBVSxDQUFDLENBQUM7aUJBQ3hCO2FBQ0Y7WUFDRCxVQUFVLENBQUMsT0FBTyxDQUFDLENBQUMsUUFBZ0IsRUFBRSxFQUFFO2dCQUN0QyxJQUFJLFFBQVEsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO29CQUN2QixRQUFRLFFBQVEsQ0FBQyxDQUFDLENBQUMsRUFBRTt3QkFDbkIsS0FBSyxHQUFHOzRCQUNOLE1BQU0sQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDOzRCQUNsQyxNQUFNO3dCQUNSLEtBQUssR0FBRzs0QkFDTixJQUFJLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDLEVBQUUsT0FBTyxDQUFDLENBQUM7NEJBQ3pDLE1BQU07d0JBQ1IsS0FBSyxHQUFHOzRCQUNOLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsRUFBRSxNQUFNLENBQUMsQ0FBQzs0QkFDeEMsTUFBTTt3QkFDUixLQUFLLEdBQUc7NEJBQ04sSUFBSSxDQUFDLEdBQUcsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxFQUFFLE1BQU0sQ0FBQyxDQUFDOzRCQUN4QyxNQUFNO3dCQUNSOzRCQUNFLElBQUksQ0FBQyxHQUFHLENBQUMsUUFBUSxFQUFFLE1BQU0sQ0FBQyxDQUFDO3FCQUM5QjtpQkFDRjtZQUNILENBQUMsQ0FBQyxDQUFDO1FBQ0wsQ0FBQyxDQUFDLENBQUM7SUFDTCxDQUFDO0lBRVEsV0FBVyxDQUFDLE9BQWUsRUFBRSxRQUFnQixFQUFFLFdBQTZCO1FBQ25GLElBQUksV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUN2RSxPQUFPLElBQUksQ0FBQztTQUNiO1FBRUQsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFO1lBQzdCLElBQUksYUFBYSxDQUFDLE9BQU8sQ0FBQyxJQUFJLFdBQVcsQ0FBQyxPQUFPLENBQUMsRUFBRTtnQkFDbEQsT0FBTyxLQUFLLENBQUM7YUFDZDtZQUVELElBQUksV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDN0UsNkVBQTZFO2dCQUM3RSwwQkFBMEI7Z0JBQzFCLE9BQU8sSUFBSSxDQUFDO2FBQ2I7U0FDRjtRQUVELE1BQU0saUJBQWlCLEdBQ25CLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxJQUFJLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLFNBQVMsQ0FBRSxDQUFDO1FBQzVFLE9BQU8saUJBQWlCLENBQUMsR0FBRyxDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3pDLENBQUM7SUFFUSxVQUFVLENBQUMsT0FBZSxFQUFFLFdBQTZCO1FBQ2hFLElBQUksV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxnQkFBZ0IsQ0FBQyxJQUFJLENBQUMsRUFBRTtZQUN2RSxPQUFPLElBQUksQ0FBQztTQUNiO1FBRUQsSUFBSSxPQUFPLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxFQUFFO1lBQzdCLElBQUksYUFBYSxDQUFDLE9BQU8sQ0FBQyxJQUFJLFdBQVcsQ0FBQyxPQUFPLENBQUMsRUFBRTtnQkFDbEQsT0FBTyxJQUFJLENBQUM7YUFDYjtZQUVELElBQUksV0FBVyxDQUFDLElBQUksQ0FBQyxDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsTUFBTSxDQUFDLElBQUksS0FBSyxzQkFBc0IsQ0FBQyxJQUFJLENBQUMsRUFBRTtnQkFDN0UsNEJBQTRCO2dCQUM1QixPQUFPLElBQUksQ0FBQzthQUNiO1NBQ0Y7UUFFRCxPQUFPLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxDQUFDO0lBQ2pELENBQUM7SUFFRDs7Ozs7Ozs7O09BU0c7SUFDTSxlQUFlLENBQUMsT0FBZSxFQUFFLFFBQWdCLEVBQUUsV0FBb0I7UUFFOUUsSUFBSSxXQUFXLEVBQUU7WUFDZixtRkFBbUY7WUFDbkYsUUFBUSxHQUFHLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxRQUFRLENBQUMsQ0FBQztTQUM3QztRQUVELDZGQUE2RjtRQUM3RixnREFBZ0Q7UUFDaEQsT0FBTyxHQUFHLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQztRQUNoQyxRQUFRLEdBQUcsUUFBUSxDQUFDLFdBQVcsRUFBRSxDQUFDO1FBQ2xDLElBQUksR0FBRyxHQUFHLGVBQWUsRUFBRSxDQUFDLE9BQU8sR0FBRyxHQUFHLEdBQUcsUUFBUSxDQUFDLENBQUM7UUFDdEQsSUFBSSxHQUFHLEVBQUU7WUFDUCxPQUFPLEdBQUcsQ0FBQztTQUNaO1FBQ0QsR0FBRyxHQUFHLGVBQWUsRUFBRSxDQUFDLElBQUksR0FBRyxRQUFRLENBQUMsQ0FBQztRQUN6QyxPQUFPLEdBQUcsQ0FBQyxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDO0lBQzFDLENBQUM7SUFFUSxpQkFBaUIsQ0FBQyxRQUFnQjtRQUN6QyxPQUFPLGFBQWEsQ0FBQyxHQUFHLENBQUMsUUFBUSxDQUFDLElBQUksUUFBUSxDQUFDO0lBQ2pELENBQUM7SUFFUSw4QkFBOEI7UUFDckMsT0FBTyxjQUFjLENBQUM7SUFDeEIsQ0FBQztJQUVRLGdCQUFnQixDQUFDLElBQVk7UUFDcEMsSUFBSSxJQUFJLENBQUMsV0FBVyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxFQUFFO1lBQ3ZDLE1BQU0sR0FBRyxHQUFHLDhCQUE4QixJQUFJLHdDQUF3QztnQkFDbEYsZUFBZSxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxPQUFPO2dCQUNuQyxTQUFTLElBQUksb0VBQW9FO2dCQUNqRixrQkFBa0IsQ0FBQztZQUN2QixPQUFPLEVBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFDLENBQUM7U0FDaEM7YUFBTTtZQUNMLE9BQU8sRUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFDLENBQUM7U0FDdkI7SUFDSCxDQUFDO0lBRVEsaUJBQWlCLENBQUMsSUFBWTtRQUNyQyxJQUFJLElBQUksQ0FBQyxXQUFXLEVBQUUsQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLEVBQUU7WUFDdkMsTUFBTSxHQUFHLEdBQUcsK0JBQStCLElBQUksd0NBQXdDO2dCQUNuRixlQUFlLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE9BQU8sQ0FBQztZQUN4QyxPQUFPLEVBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxHQUFHLEVBQUUsR0FBRyxFQUFDLENBQUM7U0FDaEM7YUFBTTtZQUNMLE9BQU8sRUFBQyxLQUFLLEVBQUUsS0FBSyxFQUFDLENBQUM7U0FDdkI7SUFDSCxDQUFDO0lBRVEsb0JBQW9CO1FBQzNCLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFDekMsQ0FBQztJQUVELDJCQUEyQixDQUFDLE9BQWU7UUFDekMsTUFBTSxpQkFBaUIsR0FDbkIsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFdBQVcsRUFBRSxDQUFDLElBQUksSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsU0FBUyxDQUFFLENBQUM7UUFDNUUsb0NBQW9DO1FBQ3BDLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsRUFBRSxDQUFDLGFBQWEsQ0FBQyxHQUFHLENBQUMsSUFBSSxDQUFDLElBQUksSUFBSSxDQUFDLENBQUM7SUFDM0YsQ0FBQztJQUVELHVCQUF1QixDQUFDLE9BQWU7UUFDckMsT0FBTyxLQUFLLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxZQUFZLENBQUMsR0FBRyxDQUFDLE9BQU8sQ0FBQyxXQUFXLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ3hFLENBQUM7SUFFUSwrQkFBK0IsQ0FBQyxRQUFnQjtRQUN2RCxPQUFPLG1CQUFtQixDQUFDLFFBQVEsQ0FBQyxDQUFDO0lBQ3ZDLENBQUM7SUFFUSw0QkFBNEIsQ0FDakMsYUFBcUIsRUFBRSxnQkFBd0IsRUFDL0MsR0FBa0I7UUFDcEIsSUFBSSxJQUFJLEdBQVcsRUFBRSxDQUFDO1FBQ3RCLE1BQU0sTUFBTSxHQUFHLEdBQUcsQ0FBQyxRQUFRLEVBQUUsQ0FBQyxJQUFJLEVBQUUsQ0FBQztRQUNyQyxJQUFJLFFBQVEsR0FBVyxJQUFLLENBQUM7UUFFN0IsSUFBSSxzQkFBc0IsQ0FBQyxhQUFhLENBQUMsSUFBSSxHQUFHLEtBQUssQ0FBQyxJQUFJLEdBQUcsS0FBSyxHQUFHLEVBQUU7WUFDckUsSUFBSSxPQUFPLEdBQUcsS0FBSyxRQUFRLEVBQUU7Z0JBQzNCLElBQUksR0FBRyxJQUFJLENBQUM7YUFDYjtpQkFBTTtnQkFDTCxNQUFNLGlCQUFpQixHQUFHLEdBQUcsQ0FBQyxLQUFLLENBQUMsd0JBQXdCLENBQUMsQ0FBQztnQkFDOUQsSUFBSSxpQkFBaUIsSUFBSSxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLElBQUksQ0FBQyxFQUFFO29CQUN6RCxRQUFRLEdBQUcsdUNBQXVDLGdCQUFnQixJQUFJLEdBQUcsRUFBRSxDQUFDO2lCQUM3RTthQUNGO1NBQ0Y7UUFDRCxPQUFPLEVBQUMsS0FBSyxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsTUFBTSxHQUFHLElBQUksRUFBQyxDQUFDO0lBQ2pELENBQUM7Q0FDRjtBQUVELFNBQVMsc0JBQXNCLENBQUMsSUFBWTtJQUMxQyxRQUFRLElBQUksRUFBRTtRQUNaLEtBQUssT0FBTyxDQUFDO1FBQ2IsS0FBSyxRQUFRLENBQUM7UUFDZCxLQUFLLFVBQVUsQ0FBQztRQUNoQixLQUFLLFdBQVcsQ0FBQztRQUNqQixLQUFLLFVBQVUsQ0FBQztRQUNoQixLQUFLLFdBQVcsQ0FBQztRQUNqQixLQUFLLE1BQU0sQ0FBQztRQUNaLEtBQUssS0FBSyxDQUFDO1FBQ1gsS0FBSyxRQUFRLENBQUM7UUFDZCxLQUFLLE9BQU8sQ0FBQztRQUNiLEtBQUssVUFBVSxDQUFDO1FBQ2hCLEtBQUssY0FBYyxDQUFDO1FBQ3BCLEtBQUssZUFBZSxDQUFDO1FBQ3JCLEtBQUssWUFBWSxDQUFDO1FBQ2xCLEtBQUssYUFBYSxDQUFDO1FBQ25CLEtBQUssZUFBZSxDQUFDO1FBQ3JCLEtBQUssY0FBYyxDQUFDO1FBQ3BCLEtBQUssV0FBVyxDQUFDO1FBQ2pCLEtBQUssWUFBWSxDQUFDO1FBQ2xCLEtBQUssY0FBYyxDQUFDO1FBQ3BCLEtBQUssYUFBYSxDQUFDO1FBQ25CLEtBQUssY0FBYyxDQUFDO1FBQ3BCLEtBQUssYUFBYSxDQUFDO1FBQ25CLEtBQUssZ0JBQWdCLENBQUM7UUFDdEIsS0FBSyxpQkFBaUIsQ0FBQztRQUN2QixLQUFLLGtCQUFrQixDQUFDO1FBQ3hCLEtBQUssbUJBQW1CLENBQUM7UUFDekIsS0FBSyxZQUFZO1lBQ2YsT0FBTyxJQUFJLENBQUM7UUFFZDtZQUNFLE9BQU8sS0FBSyxDQUFDO0tBQ2hCO0FBQ0gsQ0FBQyIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQGxpY2Vuc2VcbiAqIENvcHlyaWdodCBHb29nbGUgTExDIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuXG5pbXBvcnQge0NVU1RPTV9FTEVNRU5UU19TQ0hFTUEsIE5PX0VSUk9SU19TQ0hFTUEsIFNjaGVtYU1ldGFkYXRhLCBTZWN1cml0eUNvbnRleHR9IGZyb20gJy4uL2NvcmUnO1xuaW1wb3J0IHtpc05nQ29udGFpbmVyLCBpc05nQ29udGVudH0gZnJvbSAnLi4vbWxfcGFyc2VyL3RhZ3MnO1xuaW1wb3J0IHtkYXNoQ2FzZVRvQ2FtZWxDYXNlfSBmcm9tICcuLi91dGlsJztcblxuaW1wb3J0IHtTRUNVUklUWV9TQ0hFTUF9IGZyb20gJy4vZG9tX3NlY3VyaXR5X3NjaGVtYSc7XG5pbXBvcnQge0VsZW1lbnRTY2hlbWFSZWdpc3RyeX0gZnJvbSAnLi9lbGVtZW50X3NjaGVtYV9yZWdpc3RyeSc7XG5cbmNvbnN0IEVWRU5UID0gJ2V2ZW50JztcbmNvbnN0IEJPT0xFQU4gPSAnYm9vbGVhbic7XG5jb25zdCBOVU1CRVIgPSAnbnVtYmVyJztcbmNvbnN0IFNUUklORyA9ICdzdHJpbmcnO1xuY29uc3QgT0JKRUNUID0gJ29iamVjdCc7XG5cbi8qKlxuICogVGhpcyBhcnJheSByZXByZXNlbnRzIHRoZSBET00gc2NoZW1hLiBJdCBlbmNvZGVzIGluaGVyaXRhbmNlLCBwcm9wZXJ0aWVzLCBhbmQgZXZlbnRzLlxuICpcbiAqICMjIE92ZXJ2aWV3XG4gKlxuICogRWFjaCBsaW5lIHJlcHJlc2VudHMgb25lIGtpbmQgb2YgZWxlbWVudC4gVGhlIGBlbGVtZW50X2luaGVyaXRhbmNlYCBhbmQgcHJvcGVydGllcyBhcmUgam9pbmVkXG4gKiB1c2luZyBgZWxlbWVudF9pbmhlcml0YW5jZXxwcm9wZXJ0aWVzYCBzeW50YXguXG4gKlxuICogIyMgRWxlbWVudCBJbmhlcml0YW5jZVxuICpcbiAqIFRoZSBgZWxlbWVudF9pbmhlcml0YW5jZWAgY2FuIGJlIGZ1cnRoZXIgc3ViZGl2aWRlZCBhcyBgZWxlbWVudDEsZWxlbWVudDIsLi4uXnBhcmVudEVsZW1lbnRgLlxuICogSGVyZSB0aGUgaW5kaXZpZHVhbCBlbGVtZW50cyBhcmUgc2VwYXJhdGVkIGJ5IGAsYCAoY29tbWFzKS4gRXZlcnkgZWxlbWVudCBpbiB0aGUgbGlzdFxuICogaGFzIGlkZW50aWNhbCBwcm9wZXJ0aWVzLlxuICpcbiAqIEFuIGBlbGVtZW50YCBtYXkgaW5oZXJpdCBhZGRpdGlvbmFsIHByb3BlcnRpZXMgZnJvbSBgcGFyZW50RWxlbWVudGAgSWYgbm8gYF5wYXJlbnRFbGVtZW50YCBpc1xuICogc3BlY2lmaWVkIHRoZW4gYFwiXCJgIChibGFuaykgZWxlbWVudCBpcyBhc3N1bWVkLlxuICpcbiAqIE5PVEU6IFRoZSBibGFuayBlbGVtZW50IGluaGVyaXRzIGZyb20gcm9vdCBgW0VsZW1lbnRdYCBlbGVtZW50LCB0aGUgc3VwZXIgZWxlbWVudCBvZiBhbGxcbiAqIGVsZW1lbnRzLlxuICpcbiAqIE5PVEUgYW4gZWxlbWVudCBwcmVmaXggc3VjaCBhcyBgOnN2ZzpgIGhhcyBubyBzcGVjaWFsIG1lYW5pbmcgdG8gdGhlIHNjaGVtYS5cbiAqXG4gKiAjIyBQcm9wZXJ0aWVzXG4gKlxuICogRWFjaCBlbGVtZW50IGhhcyBhIHNldCBvZiBwcm9wZXJ0aWVzIHNlcGFyYXRlZCBieSBgLGAgKGNvbW1hcykuIEVhY2ggcHJvcGVydHkgY2FuIGJlIHByZWZpeGVkXG4gKiBieSBhIHNwZWNpYWwgY2hhcmFjdGVyIGRlc2lnbmF0aW5nIGl0cyB0eXBlOlxuICpcbiAqIC0gKG5vIHByZWZpeCk6IHByb3BlcnR5IGlzIGEgc3RyaW5nLlxuICogLSBgKmA6IHByb3BlcnR5IHJlcHJlc2VudHMgYW4gZXZlbnQuXG4gKiAtIGAhYDogcHJvcGVydHkgaXMgYSBib29sZWFuLlxuICogLSBgI2A6IHByb3BlcnR5IGlzIGEgbnVtYmVyLlxuICogLSBgJWA6IHByb3BlcnR5IGlzIGFuIG9iamVjdC5cbiAqXG4gKiAjIyBRdWVyeVxuICpcbiAqIFRoZSBjbGFzcyBjcmVhdGVzIGFuIGludGVybmFsIHNxdWFzIHJlcHJlc2VudGF0aW9uIHdoaWNoIGFsbG93cyB0byBlYXNpbHkgYW5zd2VyIHRoZSBxdWVyeSBvZlxuICogaWYgYSBnaXZlbiBwcm9wZXJ0eSBleGlzdCBvbiBhIGdpdmVuIGVsZW1lbnQuXG4gKlxuICogTk9URTogV2UgZG9uJ3QgeWV0IHN1cHBvcnQgcXVlcnlpbmcgZm9yIHR5cGVzIG9yIGV2ZW50cy5cbiAqIE5PVEU6IFRoaXMgc2NoZW1hIGlzIGF1dG8gZXh0cmFjdGVkIGZyb20gYHNjaGVtYV9leHRyYWN0b3IudHNgIGxvY2F0ZWQgaW4gdGhlIHRlc3QgZm9sZGVyLFxuICogICAgICAgc2VlIGRvbV9lbGVtZW50X3NjaGVtYV9yZWdpc3RyeV9zcGVjLnRzXG4gKi9cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gPT09PT09PT09PT0gUyBUIE8gUCAgIC0gIFMgVCBPIFAgICAtICBTIFQgTyBQICAgLSAgUyBUIE8gUCAgIC0gIFMgVCBPIFAgICAtICBTIFQgTyBQICA9PT09PT09PT09PVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuLy9cbi8vICAgICAgICAgICAgICAgICAgICAgICBETyBOT1QgRURJVCBUSElTIERPTSBTQ0hFTUEgV0lUSE9VVCBBIFNFQ1VSSVRZIFJFVklFVyFcbi8vXG4vLyBOZXdseSBhZGRlZCBwcm9wZXJ0aWVzIG11c3QgYmUgc2VjdXJpdHkgcmV2aWV3ZWQgYW5kIGFzc2lnbmVkIGFuIGFwcHJvcHJpYXRlIFNlY3VyaXR5Q29udGV4dCBpblxuLy8gZG9tX3NlY3VyaXR5X3NjaGVtYS50cy4gUmVhY2ggb3V0IHRvIG1wcm9ic3QgJiByamFtZXQgZm9yIGRldGFpbHMuXG4vL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PVxuXG5jb25zdCBTQ0hFTUE6IHN0cmluZ1tdID0gW1xuICAnW0VsZW1lbnRdfHRleHRDb250ZW50LCVjbGFzc0xpc3QsY2xhc3NOYW1lLGlkLGlubmVySFRNTCwqYmVmb3JlY29weSwqYmVmb3JlY3V0LCpiZWZvcmVwYXN0ZSwqY29weSwqY3V0LCpwYXN0ZSwqc2VhcmNoLCpzZWxlY3RzdGFydCwqd2Via2l0ZnVsbHNjcmVlbmNoYW5nZSwqd2Via2l0ZnVsbHNjcmVlbmVycm9yLCp3aGVlbCxvdXRlckhUTUwsI3Njcm9sbExlZnQsI3Njcm9sbFRvcCxzbG90JyArXG4gICAgICAvKiBhZGRlZCBtYW51YWxseSB0byBhdm9pZCBicmVha2luZyBjaGFuZ2VzICovXG4gICAgICAnLCptZXNzYWdlLCptb3pmdWxsc2NyZWVuY2hhbmdlLCptb3pmdWxsc2NyZWVuZXJyb3IsKm1venBvaW50ZXJsb2NrY2hhbmdlLCptb3pwb2ludGVybG9ja2Vycm9yLCp3ZWJnbGNvbnRleHRjcmVhdGlvbmVycm9yLCp3ZWJnbGNvbnRleHRsb3N0LCp3ZWJnbGNvbnRleHRyZXN0b3JlZCcsXG4gICdbSFRNTEVsZW1lbnRdXltFbGVtZW50XXxhY2Nlc3NLZXksY29udGVudEVkaXRhYmxlLGRpciwhZHJhZ2dhYmxlLCFoaWRkZW4saW5uZXJUZXh0LGxhbmcsKmFib3J0LCphdXhjbGljaywqYmx1ciwqY2FuY2VsLCpjYW5wbGF5LCpjYW5wbGF5dGhyb3VnaCwqY2hhbmdlLCpjbGljaywqY2xvc2UsKmNvbnRleHRtZW51LCpjdWVjaGFuZ2UsKmRibGNsaWNrLCpkcmFnLCpkcmFnZW5kLCpkcmFnZW50ZXIsKmRyYWdsZWF2ZSwqZHJhZ292ZXIsKmRyYWdzdGFydCwqZHJvcCwqZHVyYXRpb25jaGFuZ2UsKmVtcHRpZWQsKmVuZGVkLCplcnJvciwqZm9jdXMsKmdvdHBvaW50ZXJjYXB0dXJlLCppbnB1dCwqaW52YWxpZCwqa2V5ZG93biwqa2V5cHJlc3MsKmtleXVwLCpsb2FkLCpsb2FkZWRkYXRhLCpsb2FkZWRtZXRhZGF0YSwqbG9hZHN0YXJ0LCpsb3N0cG9pbnRlcmNhcHR1cmUsKm1vdXNlZG93biwqbW91c2VlbnRlciwqbW91c2VsZWF2ZSwqbW91c2Vtb3ZlLCptb3VzZW91dCwqbW91c2VvdmVyLCptb3VzZXVwLCptb3VzZXdoZWVsLCpwYXVzZSwqcGxheSwqcGxheWluZywqcG9pbnRlcmNhbmNlbCwqcG9pbnRlcmRvd24sKnBvaW50ZXJlbnRlciwqcG9pbnRlcmxlYXZlLCpwb2ludGVybW92ZSwqcG9pbnRlcm91dCwqcG9pbnRlcm92ZXIsKnBvaW50ZXJ1cCwqcHJvZ3Jlc3MsKnJhdGVjaGFuZ2UsKnJlc2V0LCpyZXNpemUsKnNjcm9sbCwqc2Vla2VkLCpzZWVraW5nLCpzZWxlY3QsKnNob3csKnN0YWxsZWQsKnN1Ym1pdCwqc3VzcGVuZCwqdGltZXVwZGF0ZSwqdG9nZ2xlLCp2b2x1bWVjaGFuZ2UsKndhaXRpbmcsb3V0ZXJUZXh0LCFzcGVsbGNoZWNrLCVzdHlsZSwjdGFiSW5kZXgsdGl0bGUsIXRyYW5zbGF0ZScsXG4gICdhYmJyLGFkZHJlc3MsYXJ0aWNsZSxhc2lkZSxiLGJkaSxiZG8sY2l0ZSxjb2RlLGRkLGRmbixkdCxlbSxmaWdjYXB0aW9uLGZpZ3VyZSxmb290ZXIsaGVhZGVyLGksa2JkLG1haW4sbWFyayxuYXYsbm9zY3JpcHQscmIscnAscnQscnRjLHJ1YnkscyxzYW1wLHNlY3Rpb24sc21hbGwsc3Ryb25nLHN1YixzdXAsdSx2YXIsd2JyXltIVE1MRWxlbWVudF18YWNjZXNzS2V5LGNvbnRlbnRFZGl0YWJsZSxkaXIsIWRyYWdnYWJsZSwhaGlkZGVuLGlubmVyVGV4dCxsYW5nLCphYm9ydCwqYXV4Y2xpY2ssKmJsdXIsKmNhbmNlbCwqY2FucGxheSwqY2FucGxheXRocm91Z2gsKmNoYW5nZSwqY2xpY2ssKmNsb3NlLCpjb250ZXh0bWVudSwqY3VlY2hhbmdlLCpkYmxjbGljaywqZHJhZywqZHJhZ2VuZCwqZHJhZ2VudGVyLCpkcmFnbGVhdmUsKmRyYWdvdmVyLCpkcmFnc3RhcnQsKmRyb3AsKmR1cmF0aW9uY2hhbmdlLCplbXB0aWVkLCplbmRlZCwqZXJyb3IsKmZvY3VzLCpnb3Rwb2ludGVyY2FwdHVyZSwqaW5wdXQsKmludmFsaWQsKmtleWRvd24sKmtleXByZXNzLCprZXl1cCwqbG9hZCwqbG9hZGVkZGF0YSwqbG9hZGVkbWV0YWRhdGEsKmxvYWRzdGFydCwqbG9zdHBvaW50ZXJjYXB0dXJlLCptb3VzZWRvd24sKm1vdXNlZW50ZXIsKm1vdXNlbGVhdmUsKm1vdXNlbW92ZSwqbW91c2VvdXQsKm1vdXNlb3ZlciwqbW91c2V1cCwqbW91c2V3aGVlbCwqcGF1c2UsKnBsYXksKnBsYXlpbmcsKnBvaW50ZXJjYW5jZWwsKnBvaW50ZXJkb3duLCpwb2ludGVyZW50ZXIsKnBvaW50ZXJsZWF2ZSwqcG9pbnRlcm1vdmUsKnBvaW50ZXJvdXQsKnBvaW50ZXJvdmVyLCpwb2ludGVydXAsKnByb2dyZXNzLCpyYXRlY2hhbmdlLCpyZXNldCwqcmVzaXplLCpzY3JvbGwsKnNlZWtlZCwqc2Vla2luZywqc2VsZWN0LCpzaG93LCpzdGFsbGVkLCpzdWJtaXQsKnN1c3BlbmQsKnRpbWV1cGRhdGUsKnRvZ2dsZSwqdm9sdW1lY2hhbmdlLCp3YWl0aW5nLG91dGVyVGV4dCwhc3BlbGxjaGVjaywlc3R5bGUsI3RhYkluZGV4LHRpdGxlLCF0cmFuc2xhdGUnLFxuICAnbWVkaWFeW0hUTUxFbGVtZW50XXwhYXV0b3BsYXksIWNvbnRyb2xzLCVjb250cm9sc0xpc3QsJWNyb3NzT3JpZ2luLCNjdXJyZW50VGltZSwhZGVmYXVsdE11dGVkLCNkZWZhdWx0UGxheWJhY2tSYXRlLCFkaXNhYmxlUmVtb3RlUGxheWJhY2ssIWxvb3AsIW11dGVkLCplbmNyeXB0ZWQsKndhaXRpbmdmb3JrZXksI3BsYXliYWNrUmF0ZSxwcmVsb2FkLHNyYywlc3JjT2JqZWN0LCN2b2x1bWUnLFxuICAnOnN2ZzpeW0hUTUxFbGVtZW50XXwqYWJvcnQsKmF1eGNsaWNrLCpibHVyLCpjYW5jZWwsKmNhbnBsYXksKmNhbnBsYXl0aHJvdWdoLCpjaGFuZ2UsKmNsaWNrLCpjbG9zZSwqY29udGV4dG1lbnUsKmN1ZWNoYW5nZSwqZGJsY2xpY2ssKmRyYWcsKmRyYWdlbmQsKmRyYWdlbnRlciwqZHJhZ2xlYXZlLCpkcmFnb3ZlciwqZHJhZ3N0YXJ0LCpkcm9wLCpkdXJhdGlvbmNoYW5nZSwqZW1wdGllZCwqZW5kZWQsKmVycm9yLCpmb2N1cywqZ290cG9pbnRlcmNhcHR1cmUsKmlucHV0LCppbnZhbGlkLCprZXlkb3duLCprZXlwcmVzcywqa2V5dXAsKmxvYWQsKmxvYWRlZGRhdGEsKmxvYWRlZG1ldGFkYXRhLCpsb2Fkc3RhcnQsKmxvc3Rwb2ludGVyY2FwdHVyZSwqbW91c2Vkb3duLCptb3VzZWVudGVyLCptb3VzZWxlYXZlLCptb3VzZW1vdmUsKm1vdXNlb3V0LCptb3VzZW92ZXIsKm1vdXNldXAsKm1vdXNld2hlZWwsKnBhdXNlLCpwbGF5LCpwbGF5aW5nLCpwb2ludGVyY2FuY2VsLCpwb2ludGVyZG93biwqcG9pbnRlcmVudGVyLCpwb2ludGVybGVhdmUsKnBvaW50ZXJtb3ZlLCpwb2ludGVyb3V0LCpwb2ludGVyb3ZlciwqcG9pbnRlcnVwLCpwcm9ncmVzcywqcmF0ZWNoYW5nZSwqcmVzZXQsKnJlc2l6ZSwqc2Nyb2xsLCpzZWVrZWQsKnNlZWtpbmcsKnNlbGVjdCwqc2hvdywqc3RhbGxlZCwqc3VibWl0LCpzdXNwZW5kLCp0aW1ldXBkYXRlLCp0b2dnbGUsKnZvbHVtZWNoYW5nZSwqd2FpdGluZywlc3R5bGUsI3RhYkluZGV4JyxcbiAgJzpzdmc6Z3JhcGhpY3NeOnN2Zzp8JyxcbiAgJzpzdmc6YW5pbWF0aW9uXjpzdmc6fCpiZWdpbiwqZW5kLCpyZXBlYXQnLFxuICAnOnN2ZzpnZW9tZXRyeV46c3ZnOnwnLFxuICAnOnN2Zzpjb21wb25lbnRUcmFuc2ZlckZ1bmN0aW9uXjpzdmc6fCcsXG4gICc6c3ZnOmdyYWRpZW50Xjpzdmc6fCcsXG4gICc6c3ZnOnRleHRDb250ZW50Xjpzdmc6Z3JhcGhpY3N8JyxcbiAgJzpzdmc6dGV4dFBvc2l0aW9uaW5nXjpzdmc6dGV4dENvbnRlbnR8JyxcbiAgJ2FeW0hUTUxFbGVtZW50XXxjaGFyc2V0LGNvb3Jkcyxkb3dubG9hZCxoYXNoLGhvc3QsaG9zdG5hbWUsaHJlZixocmVmbGFuZyxuYW1lLHBhc3N3b3JkLHBhdGhuYW1lLHBpbmcscG9ydCxwcm90b2NvbCxyZWZlcnJlclBvbGljeSxyZWwscmV2LHNlYXJjaCxzaGFwZSx0YXJnZXQsdGV4dCx0eXBlLHVzZXJuYW1lJyxcbiAgJ2FyZWFeW0hUTUxFbGVtZW50XXxhbHQsY29vcmRzLGRvd25sb2FkLGhhc2gsaG9zdCxob3N0bmFtZSxocmVmLCFub0hyZWYscGFzc3dvcmQscGF0aG5hbWUscGluZyxwb3J0LHByb3RvY29sLHJlZmVycmVyUG9saWN5LHJlbCxzZWFyY2gsc2hhcGUsdGFyZ2V0LHVzZXJuYW1lJyxcbiAgJ2F1ZGlvXm1lZGlhfCcsXG4gICdicl5bSFRNTEVsZW1lbnRdfGNsZWFyJyxcbiAgJ2Jhc2VeW0hUTUxFbGVtZW50XXxocmVmLHRhcmdldCcsXG4gICdib2R5XltIVE1MRWxlbWVudF18YUxpbmssYmFja2dyb3VuZCxiZ0NvbG9yLGxpbmssKmJlZm9yZXVubG9hZCwqYmx1ciwqZXJyb3IsKmZvY3VzLCpoYXNoY2hhbmdlLCpsYW5ndWFnZWNoYW5nZSwqbG9hZCwqbWVzc2FnZSwqb2ZmbGluZSwqb25saW5lLCpwYWdlaGlkZSwqcGFnZXNob3csKnBvcHN0YXRlLCpyZWplY3Rpb25oYW5kbGVkLCpyZXNpemUsKnNjcm9sbCwqc3RvcmFnZSwqdW5oYW5kbGVkcmVqZWN0aW9uLCp1bmxvYWQsdGV4dCx2TGluaycsXG4gICdidXR0b25eW0hUTUxFbGVtZW50XXwhYXV0b2ZvY3VzLCFkaXNhYmxlZCxmb3JtQWN0aW9uLGZvcm1FbmN0eXBlLGZvcm1NZXRob2QsIWZvcm1Ob1ZhbGlkYXRlLGZvcm1UYXJnZXQsbmFtZSx0eXBlLHZhbHVlJyxcbiAgJ2NhbnZhc15bSFRNTEVsZW1lbnRdfCNoZWlnaHQsI3dpZHRoJyxcbiAgJ2NvbnRlbnReW0hUTUxFbGVtZW50XXxzZWxlY3QnLFxuICAnZGxeW0hUTUxFbGVtZW50XXwhY29tcGFjdCcsXG4gICdkYXRhbGlzdF5bSFRNTEVsZW1lbnRdfCcsXG4gICdkZXRhaWxzXltIVE1MRWxlbWVudF18IW9wZW4nLFxuICAnZGlhbG9nXltIVE1MRWxlbWVudF18IW9wZW4scmV0dXJuVmFsdWUnLFxuICAnZGlyXltIVE1MRWxlbWVudF18IWNvbXBhY3QnLFxuICAnZGl2XltIVE1MRWxlbWVudF18YWxpZ24nLFxuICAnZW1iZWReW0hUTUxFbGVtZW50XXxhbGlnbixoZWlnaHQsbmFtZSxzcmMsdHlwZSx3aWR0aCcsXG4gICdmaWVsZHNldF5bSFRNTEVsZW1lbnRdfCFkaXNhYmxlZCxuYW1lJyxcbiAgJ2ZvbnReW0hUTUxFbGVtZW50XXxjb2xvcixmYWNlLHNpemUnLFxuICAnZm9ybV5bSFRNTEVsZW1lbnRdfGFjY2VwdENoYXJzZXQsYWN0aW9uLGF1dG9jb21wbGV0ZSxlbmNvZGluZyxlbmN0eXBlLG1ldGhvZCxuYW1lLCFub1ZhbGlkYXRlLHRhcmdldCcsXG4gICdmcmFtZV5bSFRNTEVsZW1lbnRdfGZyYW1lQm9yZGVyLGxvbmdEZXNjLG1hcmdpbkhlaWdodCxtYXJnaW5XaWR0aCxuYW1lLCFub1Jlc2l6ZSxzY3JvbGxpbmcsc3JjJyxcbiAgJ2ZyYW1lc2V0XltIVE1MRWxlbWVudF18Y29scywqYmVmb3JldW5sb2FkLCpibHVyLCplcnJvciwqZm9jdXMsKmhhc2hjaGFuZ2UsKmxhbmd1YWdlY2hhbmdlLCpsb2FkLCptZXNzYWdlLCpvZmZsaW5lLCpvbmxpbmUsKnBhZ2VoaWRlLCpwYWdlc2hvdywqcG9wc3RhdGUsKnJlamVjdGlvbmhhbmRsZWQsKnJlc2l6ZSwqc2Nyb2xsLCpzdG9yYWdlLCp1bmhhbmRsZWRyZWplY3Rpb24sKnVubG9hZCxyb3dzJyxcbiAgJ2hyXltIVE1MRWxlbWVudF18YWxpZ24sY29sb3IsIW5vU2hhZGUsc2l6ZSx3aWR0aCcsXG4gICdoZWFkXltIVE1MRWxlbWVudF18JyxcbiAgJ2gxLGgyLGgzLGg0LGg1LGg2XltIVE1MRWxlbWVudF18YWxpZ24nLFxuICAnaHRtbF5bSFRNTEVsZW1lbnRdfHZlcnNpb24nLFxuICAnaWZyYW1lXltIVE1MRWxlbWVudF18YWxpZ24sIWFsbG93RnVsbHNjcmVlbixmcmFtZUJvcmRlcixoZWlnaHQsbG9uZ0Rlc2MsbWFyZ2luSGVpZ2h0LG1hcmdpbldpZHRoLG5hbWUscmVmZXJyZXJQb2xpY3ksJXNhbmRib3gsc2Nyb2xsaW5nLHNyYyxzcmNkb2Msd2lkdGgnLFxuICAnaW1nXltIVE1MRWxlbWVudF18YWxpZ24sYWx0LGJvcmRlciwlY3Jvc3NPcmlnaW4sI2hlaWdodCwjaHNwYWNlLCFpc01hcCxsb25nRGVzYyxsb3dzcmMsbmFtZSxyZWZlcnJlclBvbGljeSxzaXplcyxzcmMsc3Jjc2V0LHVzZU1hcCwjdnNwYWNlLCN3aWR0aCcsXG4gICdpbnB1dF5bSFRNTEVsZW1lbnRdfGFjY2VwdCxhbGlnbixhbHQsYXV0b2NhcGl0YWxpemUsYXV0b2NvbXBsZXRlLCFhdXRvZm9jdXMsIWNoZWNrZWQsIWRlZmF1bHRDaGVja2VkLGRlZmF1bHRWYWx1ZSxkaXJOYW1lLCFkaXNhYmxlZCwlZmlsZXMsZm9ybUFjdGlvbixmb3JtRW5jdHlwZSxmb3JtTWV0aG9kLCFmb3JtTm9WYWxpZGF0ZSxmb3JtVGFyZ2V0LCNoZWlnaHQsIWluY3JlbWVudGFsLCFpbmRldGVybWluYXRlLG1heCwjbWF4TGVuZ3RoLG1pbiwjbWluTGVuZ3RoLCFtdWx0aXBsZSxuYW1lLHBhdHRlcm4scGxhY2Vob2xkZXIsIXJlYWRPbmx5LCFyZXF1aXJlZCxzZWxlY3Rpb25EaXJlY3Rpb24sI3NlbGVjdGlvbkVuZCwjc2VsZWN0aW9uU3RhcnQsI3NpemUsc3JjLHN0ZXAsdHlwZSx1c2VNYXAsdmFsdWUsJXZhbHVlQXNEYXRlLCN2YWx1ZUFzTnVtYmVyLCN3aWR0aCcsXG4gICdsaV5bSFRNTEVsZW1lbnRdfHR5cGUsI3ZhbHVlJyxcbiAgJ2xhYmVsXltIVE1MRWxlbWVudF18aHRtbEZvcicsXG4gICdsZWdlbmReW0hUTUxFbGVtZW50XXxhbGlnbicsXG4gICdsaW5rXltIVE1MRWxlbWVudF18YXMsY2hhcnNldCwlY3Jvc3NPcmlnaW4sIWRpc2FibGVkLGhyZWYsaHJlZmxhbmcsaW50ZWdyaXR5LG1lZGlhLHJlZmVycmVyUG9saWN5LHJlbCwlcmVsTGlzdCxyZXYsJXNpemVzLHRhcmdldCx0eXBlJyxcbiAgJ21hcF5bSFRNTEVsZW1lbnRdfG5hbWUnLFxuICAnbWFycXVlZV5bSFRNTEVsZW1lbnRdfGJlaGF2aW9yLGJnQ29sb3IsZGlyZWN0aW9uLGhlaWdodCwjaHNwYWNlLCNsb29wLCNzY3JvbGxBbW91bnQsI3Njcm9sbERlbGF5LCF0cnVlU3BlZWQsI3ZzcGFjZSx3aWR0aCcsXG4gICdtZW51XltIVE1MRWxlbWVudF18IWNvbXBhY3QnLFxuICAnbWV0YV5bSFRNTEVsZW1lbnRdfGNvbnRlbnQsaHR0cEVxdWl2LG5hbWUsc2NoZW1lJyxcbiAgJ21ldGVyXltIVE1MRWxlbWVudF18I2hpZ2gsI2xvdywjbWF4LCNtaW4sI29wdGltdW0sI3ZhbHVlJyxcbiAgJ2lucyxkZWxeW0hUTUxFbGVtZW50XXxjaXRlLGRhdGVUaW1lJyxcbiAgJ29sXltIVE1MRWxlbWVudF18IWNvbXBhY3QsIXJldmVyc2VkLCNzdGFydCx0eXBlJyxcbiAgJ29iamVjdF5bSFRNTEVsZW1lbnRdfGFsaWduLGFyY2hpdmUsYm9yZGVyLGNvZGUsY29kZUJhc2UsY29kZVR5cGUsZGF0YSwhZGVjbGFyZSxoZWlnaHQsI2hzcGFjZSxuYW1lLHN0YW5kYnksdHlwZSx1c2VNYXAsI3ZzcGFjZSx3aWR0aCcsXG4gICdvcHRncm91cF5bSFRNTEVsZW1lbnRdfCFkaXNhYmxlZCxsYWJlbCcsXG4gICdvcHRpb25eW0hUTUxFbGVtZW50XXwhZGVmYXVsdFNlbGVjdGVkLCFkaXNhYmxlZCxsYWJlbCwhc2VsZWN0ZWQsdGV4dCx2YWx1ZScsXG4gICdvdXRwdXReW0hUTUxFbGVtZW50XXxkZWZhdWx0VmFsdWUsJWh0bWxGb3IsbmFtZSx2YWx1ZScsXG4gICdwXltIVE1MRWxlbWVudF18YWxpZ24nLFxuICAncGFyYW1eW0hUTUxFbGVtZW50XXxuYW1lLHR5cGUsdmFsdWUsdmFsdWVUeXBlJyxcbiAgJ3BpY3R1cmVeW0hUTUxFbGVtZW50XXwnLFxuICAncHJlXltIVE1MRWxlbWVudF18I3dpZHRoJyxcbiAgJ3Byb2dyZXNzXltIVE1MRWxlbWVudF18I21heCwjdmFsdWUnLFxuICAncSxibG9ja3F1b3RlLGNpdGVeW0hUTUxFbGVtZW50XXwnLFxuICAnc2NyaXB0XltIVE1MRWxlbWVudF18IWFzeW5jLGNoYXJzZXQsJWNyb3NzT3JpZ2luLCFkZWZlcixldmVudCxodG1sRm9yLGludGVncml0eSxzcmMsdGV4dCx0eXBlJyxcbiAgJ3NlbGVjdF5bSFRNTEVsZW1lbnRdfGF1dG9jb21wbGV0ZSwhYXV0b2ZvY3VzLCFkaXNhYmxlZCwjbGVuZ3RoLCFtdWx0aXBsZSxuYW1lLCFyZXF1aXJlZCwjc2VsZWN0ZWRJbmRleCwjc2l6ZSx2YWx1ZScsXG4gICdzaGFkb3deW0hUTUxFbGVtZW50XXwnLFxuICAnc2xvdF5bSFRNTEVsZW1lbnRdfG5hbWUnLFxuICAnc291cmNlXltIVE1MRWxlbWVudF18bWVkaWEsc2l6ZXMsc3JjLHNyY3NldCx0eXBlJyxcbiAgJ3NwYW5eW0hUTUxFbGVtZW50XXwnLFxuICAnc3R5bGVeW0hUTUxFbGVtZW50XXwhZGlzYWJsZWQsbWVkaWEsdHlwZScsXG4gICdjYXB0aW9uXltIVE1MRWxlbWVudF18YWxpZ24nLFxuICAndGgsdGReW0hUTUxFbGVtZW50XXxhYmJyLGFsaWduLGF4aXMsYmdDb2xvcixjaCxjaE9mZiwjY29sU3BhbixoZWFkZXJzLGhlaWdodCwhbm9XcmFwLCNyb3dTcGFuLHNjb3BlLHZBbGlnbix3aWR0aCcsXG4gICdjb2wsY29sZ3JvdXBeW0hUTUxFbGVtZW50XXxhbGlnbixjaCxjaE9mZiwjc3Bhbix2QWxpZ24sd2lkdGgnLFxuICAndGFibGVeW0hUTUxFbGVtZW50XXxhbGlnbixiZ0NvbG9yLGJvcmRlciwlY2FwdGlvbixjZWxsUGFkZGluZyxjZWxsU3BhY2luZyxmcmFtZSxydWxlcyxzdW1tYXJ5LCV0Rm9vdCwldEhlYWQsd2lkdGgnLFxuICAndHJeW0hUTUxFbGVtZW50XXxhbGlnbixiZ0NvbG9yLGNoLGNoT2ZmLHZBbGlnbicsXG4gICd0Zm9vdCx0aGVhZCx0Ym9keV5bSFRNTEVsZW1lbnRdfGFsaWduLGNoLGNoT2ZmLHZBbGlnbicsXG4gICd0ZW1wbGF0ZV5bSFRNTEVsZW1lbnRdfCcsXG4gICd0ZXh0YXJlYV5bSFRNTEVsZW1lbnRdfGF1dG9jYXBpdGFsaXplLGF1dG9jb21wbGV0ZSwhYXV0b2ZvY3VzLCNjb2xzLGRlZmF1bHRWYWx1ZSxkaXJOYW1lLCFkaXNhYmxlZCwjbWF4TGVuZ3RoLCNtaW5MZW5ndGgsbmFtZSxwbGFjZWhvbGRlciwhcmVhZE9ubHksIXJlcXVpcmVkLCNyb3dzLHNlbGVjdGlvbkRpcmVjdGlvbiwjc2VsZWN0aW9uRW5kLCNzZWxlY3Rpb25TdGFydCx2YWx1ZSx3cmFwJyxcbiAgJ3RpdGxlXltIVE1MRWxlbWVudF18dGV4dCcsXG4gICd0cmFja15bSFRNTEVsZW1lbnRdfCFkZWZhdWx0LGtpbmQsbGFiZWwsc3JjLHNyY2xhbmcnLFxuICAndWxeW0hUTUxFbGVtZW50XXwhY29tcGFjdCx0eXBlJyxcbiAgJ3Vua25vd25eW0hUTUxFbGVtZW50XXwnLFxuICAndmlkZW9ebWVkaWF8I2hlaWdodCxwb3N0ZXIsI3dpZHRoJyxcbiAgJzpzdmc6YV46c3ZnOmdyYXBoaWNzfCcsXG4gICc6c3ZnOmFuaW1hdGVeOnN2ZzphbmltYXRpb258JyxcbiAgJzpzdmc6YW5pbWF0ZU1vdGlvbl46c3ZnOmFuaW1hdGlvbnwnLFxuICAnOnN2ZzphbmltYXRlVHJhbnNmb3JtXjpzdmc6YW5pbWF0aW9ufCcsXG4gICc6c3ZnOmNpcmNsZV46c3ZnOmdlb21ldHJ5fCcsXG4gICc6c3ZnOmNsaXBQYXRoXjpzdmc6Z3JhcGhpY3N8JyxcbiAgJzpzdmc6ZGVmc146c3ZnOmdyYXBoaWNzfCcsXG4gICc6c3ZnOmRlc2NeOnN2Zzp8JyxcbiAgJzpzdmc6ZGlzY2FyZF46c3ZnOnwnLFxuICAnOnN2ZzplbGxpcHNlXjpzdmc6Z2VvbWV0cnl8JyxcbiAgJzpzdmc6ZmVCbGVuZF46c3ZnOnwnLFxuICAnOnN2ZzpmZUNvbG9yTWF0cml4Xjpzdmc6fCcsXG4gICc6c3ZnOmZlQ29tcG9uZW50VHJhbnNmZXJeOnN2Zzp8JyxcbiAgJzpzdmc6ZmVDb21wb3NpdGVeOnN2Zzp8JyxcbiAgJzpzdmc6ZmVDb252b2x2ZU1hdHJpeF46c3ZnOnwnLFxuICAnOnN2ZzpmZURpZmZ1c2VMaWdodGluZ146c3ZnOnwnLFxuICAnOnN2ZzpmZURpc3BsYWNlbWVudE1hcF46c3ZnOnwnLFxuICAnOnN2ZzpmZURpc3RhbnRMaWdodF46c3ZnOnwnLFxuICAnOnN2ZzpmZURyb3BTaGFkb3deOnN2Zzp8JyxcbiAgJzpzdmc6ZmVGbG9vZF46c3ZnOnwnLFxuICAnOnN2ZzpmZUZ1bmNBXjpzdmc6Y29tcG9uZW50VHJhbnNmZXJGdW5jdGlvbnwnLFxuICAnOnN2ZzpmZUZ1bmNCXjpzdmc6Y29tcG9uZW50VHJhbnNmZXJGdW5jdGlvbnwnLFxuICAnOnN2ZzpmZUZ1bmNHXjpzdmc6Y29tcG9uZW50VHJhbnNmZXJGdW5jdGlvbnwnLFxuICAnOnN2ZzpmZUZ1bmNSXjpzdmc6Y29tcG9uZW50VHJhbnNmZXJGdW5jdGlvbnwnLFxuICAnOnN2ZzpmZUdhdXNzaWFuQmx1cl46c3ZnOnwnLFxuICAnOnN2ZzpmZUltYWdlXjpzdmc6fCcsXG4gICc6c3ZnOmZlTWVyZ2VeOnN2Zzp8JyxcbiAgJzpzdmc6ZmVNZXJnZU5vZGVeOnN2Zzp8JyxcbiAgJzpzdmc6ZmVNb3JwaG9sb2d5Xjpzdmc6fCcsXG4gICc6c3ZnOmZlT2Zmc2V0Xjpzdmc6fCcsXG4gICc6c3ZnOmZlUG9pbnRMaWdodF46c3ZnOnwnLFxuICAnOnN2ZzpmZVNwZWN1bGFyTGlnaHRpbmdeOnN2Zzp8JyxcbiAgJzpzdmc6ZmVTcG90TGlnaHReOnN2Zzp8JyxcbiAgJzpzdmc6ZmVUaWxlXjpzdmc6fCcsXG4gICc6c3ZnOmZlVHVyYnVsZW5jZV46c3ZnOnwnLFxuICAnOnN2ZzpmaWx0ZXJeOnN2Zzp8JyxcbiAgJzpzdmc6Zm9yZWlnbk9iamVjdF46c3ZnOmdyYXBoaWNzfCcsXG4gICc6c3ZnOmdeOnN2ZzpncmFwaGljc3wnLFxuICAnOnN2ZzppbWFnZV46c3ZnOmdyYXBoaWNzfCcsXG4gICc6c3ZnOmxpbmVeOnN2ZzpnZW9tZXRyeXwnLFxuICAnOnN2ZzpsaW5lYXJHcmFkaWVudF46c3ZnOmdyYWRpZW50fCcsXG4gICc6c3ZnOm1wYXRoXjpzdmc6fCcsXG4gICc6c3ZnOm1hcmtlcl46c3ZnOnwnLFxuICAnOnN2ZzptYXNrXjpzdmc6fCcsXG4gICc6c3ZnOm1ldGFkYXRhXjpzdmc6fCcsXG4gICc6c3ZnOnBhdGheOnN2ZzpnZW9tZXRyeXwnLFxuICAnOnN2ZzpwYXR0ZXJuXjpzdmc6fCcsXG4gICc6c3ZnOnBvbHlnb25eOnN2ZzpnZW9tZXRyeXwnLFxuICAnOnN2Zzpwb2x5bGluZV46c3ZnOmdlb21ldHJ5fCcsXG4gICc6c3ZnOnJhZGlhbEdyYWRpZW50Xjpzdmc6Z3JhZGllbnR8JyxcbiAgJzpzdmc6cmVjdF46c3ZnOmdlb21ldHJ5fCcsXG4gICc6c3ZnOnN2Z146c3ZnOmdyYXBoaWNzfCNjdXJyZW50U2NhbGUsI3pvb21BbmRQYW4nLFxuICAnOnN2ZzpzY3JpcHReOnN2Zzp8dHlwZScsXG4gICc6c3ZnOnNldF46c3ZnOmFuaW1hdGlvbnwnLFxuICAnOnN2ZzpzdG9wXjpzdmc6fCcsXG4gICc6c3ZnOnN0eWxlXjpzdmc6fCFkaXNhYmxlZCxtZWRpYSx0aXRsZSx0eXBlJyxcbiAgJzpzdmc6c3dpdGNoXjpzdmc6Z3JhcGhpY3N8JyxcbiAgJzpzdmc6c3ltYm9sXjpzdmc6fCcsXG4gICc6c3ZnOnRzcGFuXjpzdmc6dGV4dFBvc2l0aW9uaW5nfCcsXG4gICc6c3ZnOnRleHReOnN2Zzp0ZXh0UG9zaXRpb25pbmd8JyxcbiAgJzpzdmc6dGV4dFBhdGheOnN2Zzp0ZXh0Q29udGVudHwnLFxuICAnOnN2Zzp0aXRsZV46c3ZnOnwnLFxuICAnOnN2Zzp1c2VeOnN2ZzpncmFwaGljc3wnLFxuICAnOnN2Zzp2aWV3Xjpzdmc6fCN6b29tQW5kUGFuJyxcbiAgJ2RhdGFeW0hUTUxFbGVtZW50XXx2YWx1ZScsXG4gICdrZXlnZW5eW0hUTUxFbGVtZW50XXwhYXV0b2ZvY3VzLGNoYWxsZW5nZSwhZGlzYWJsZWQsZm9ybSxrZXl0eXBlLG5hbWUnLFxuICAnbWVudWl0ZW1eW0hUTUxFbGVtZW50XXx0eXBlLGxhYmVsLGljb24sIWRpc2FibGVkLCFjaGVja2VkLHJhZGlvZ3JvdXAsIWRlZmF1bHQnLFxuICAnc3VtbWFyeV5bSFRNTEVsZW1lbnRdfCcsXG4gICd0aW1lXltIVE1MRWxlbWVudF18ZGF0ZVRpbWUnLFxuICAnOnN2ZzpjdXJzb3JeOnN2Zzp8Jyxcbl07XG5cbmNvbnN0IF9BVFRSX1RPX1BST1AgPSBuZXcgTWFwKE9iamVjdC5lbnRyaWVzKHtcbiAgJ2NsYXNzJzogJ2NsYXNzTmFtZScsXG4gICdmb3InOiAnaHRtbEZvcicsXG4gICdmb3JtYWN0aW9uJzogJ2Zvcm1BY3Rpb24nLFxuICAnaW5uZXJIdG1sJzogJ2lubmVySFRNTCcsXG4gICdyZWFkb25seSc6ICdyZWFkT25seScsXG4gICd0YWJpbmRleCc6ICd0YWJJbmRleCcsXG59KSk7XG5cbi8vIEludmVydCBfQVRUUl9UT19QUk9QLlxuY29uc3QgX1BST1BfVE9fQVRUUiA9XG4gICAgQXJyYXkuZnJvbShfQVRUUl9UT19QUk9QKS5yZWR1Y2UoKGludmVydGVkLCBbcHJvcGVydHlOYW1lLCBhdHRyaWJ1dGVOYW1lXSkgPT4ge1xuICAgICAgaW52ZXJ0ZWQuc2V0KHByb3BlcnR5TmFtZSwgYXR0cmlidXRlTmFtZSk7XG4gICAgICByZXR1cm4gaW52ZXJ0ZWQ7XG4gICAgfSwgbmV3IE1hcDxzdHJpbmcsIHN0cmluZz4oKSk7XG5cbmV4cG9ydCBjbGFzcyBEb21FbGVtZW50U2NoZW1hUmVnaXN0cnkgZXh0ZW5kcyBFbGVtZW50U2NoZW1hUmVnaXN0cnkge1xuICBwcml2YXRlIF9zY2hlbWEgPSBuZXcgTWFwPHN0cmluZywgTWFwPHN0cmluZywgc3RyaW5nPj4oKTtcbiAgLy8gV2UgZG9uJ3QgYWxsb3cgYmluZGluZyB0byBldmVudHMgZm9yIHNlY3VyaXR5IHJlYXNvbnMuIEFsbG93aW5nIGV2ZW50IGJpbmRpbmdzIHdvdWxkIGFsbW9zdFxuICAvLyBjZXJ0YWlubHkgaW50cm9kdWNlIGJhZCBYU1MgdnVsbmVyYWJpbGl0aWVzLiBJbnN0ZWFkLCB3ZSBzdG9yZSBldmVudHMgaW4gYSBzZXBhcmF0ZSBzY2hlbWEuXG4gIHByaXZhdGUgX2V2ZW50U2NoZW1hID0gbmV3IE1hcDxzdHJpbmcsIFNldDxzdHJpbmc+PjtcblxuICBjb25zdHJ1Y3RvcigpIHtcbiAgICBzdXBlcigpO1xuICAgIFNDSEVNQS5mb3JFYWNoKGVuY29kZWRUeXBlID0+IHtcbiAgICAgIGNvbnN0IHR5cGUgPSBuZXcgTWFwPHN0cmluZywgc3RyaW5nPigpO1xuICAgICAgY29uc3QgZXZlbnRzOiBTZXQ8c3RyaW5nPiA9IG5ldyBTZXQoKTtcbiAgICAgIGNvbnN0IFtzdHJUeXBlLCBzdHJQcm9wZXJ0aWVzXSA9IGVuY29kZWRUeXBlLnNwbGl0KCd8Jyk7XG4gICAgICBjb25zdCBwcm9wZXJ0aWVzID0gc3RyUHJvcGVydGllcy5zcGxpdCgnLCcpO1xuICAgICAgY29uc3QgW3R5cGVOYW1lcywgc3VwZXJOYW1lXSA9IHN0clR5cGUuc3BsaXQoJ14nKTtcbiAgICAgIHR5cGVOYW1lcy5zcGxpdCgnLCcpLmZvckVhY2godGFnID0+IHtcbiAgICAgICAgdGhpcy5fc2NoZW1hLnNldCh0YWcudG9Mb3dlckNhc2UoKSwgdHlwZSk7XG4gICAgICAgIHRoaXMuX2V2ZW50U2NoZW1hLnNldCh0YWcudG9Mb3dlckNhc2UoKSwgZXZlbnRzKTtcbiAgICAgIH0pO1xuICAgICAgY29uc3Qgc3VwZXJUeXBlID0gc3VwZXJOYW1lICYmIHRoaXMuX3NjaGVtYS5nZXQoc3VwZXJOYW1lLnRvTG93ZXJDYXNlKCkpO1xuICAgICAgaWYgKHN1cGVyVHlwZSkge1xuICAgICAgICBmb3IgKGNvbnN0IFtwcm9wLCB2YWx1ZV0gb2Ygc3VwZXJUeXBlKSB7XG4gICAgICAgICAgdHlwZS5zZXQocHJvcCwgdmFsdWUpO1xuICAgICAgICB9XG4gICAgICAgIGZvciAoY29uc3Qgc3VwZXJFdmVudCBvZiB0aGlzLl9ldmVudFNjaGVtYS5nZXQoc3VwZXJOYW1lLnRvTG93ZXJDYXNlKCkpISkge1xuICAgICAgICAgIGV2ZW50cy5hZGQoc3VwZXJFdmVudCk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHByb3BlcnRpZXMuZm9yRWFjaCgocHJvcGVydHk6IHN0cmluZykgPT4ge1xuICAgICAgICBpZiAocHJvcGVydHkubGVuZ3RoID4gMCkge1xuICAgICAgICAgIHN3aXRjaCAocHJvcGVydHlbMF0pIHtcbiAgICAgICAgICAgIGNhc2UgJyonOlxuICAgICAgICAgICAgICBldmVudHMuYWRkKHByb3BlcnR5LnN1YnN0cmluZygxKSk7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnISc6XG4gICAgICAgICAgICAgIHR5cGUuc2V0KHByb3BlcnR5LnN1YnN0cmluZygxKSwgQk9PTEVBTik7XG4gICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgY2FzZSAnIyc6XG4gICAgICAgICAgICAgIHR5cGUuc2V0KHByb3BlcnR5LnN1YnN0cmluZygxKSwgTlVNQkVSKTtcbiAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICBjYXNlICclJzpcbiAgICAgICAgICAgICAgdHlwZS5zZXQocHJvcGVydHkuc3Vic3RyaW5nKDEpLCBPQkpFQ1QpO1xuICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIGRlZmF1bHQ6XG4gICAgICAgICAgICAgIHR5cGUuc2V0KHByb3BlcnR5LCBTVFJJTkcpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH1cblxuICBvdmVycmlkZSBoYXNQcm9wZXJ0eSh0YWdOYW1lOiBzdHJpbmcsIHByb3BOYW1lOiBzdHJpbmcsIHNjaGVtYU1ldGFzOiBTY2hlbWFNZXRhZGF0YVtdKTogYm9vbGVhbiB7XG4gICAgaWYgKHNjaGVtYU1ldGFzLnNvbWUoKHNjaGVtYSkgPT4gc2NoZW1hLm5hbWUgPT09IE5PX0VSUk9SU19TQ0hFTUEubmFtZSkpIHtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIGlmICh0YWdOYW1lLmluZGV4T2YoJy0nKSA+IC0xKSB7XG4gICAgICBpZiAoaXNOZ0NvbnRhaW5lcih0YWdOYW1lKSB8fCBpc05nQ29udGVudCh0YWdOYW1lKSkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIGlmIChzY2hlbWFNZXRhcy5zb21lKChzY2hlbWEpID0+IHNjaGVtYS5uYW1lID09PSBDVVNUT01fRUxFTUVOVFNfU0NIRU1BLm5hbWUpKSB7XG4gICAgICAgIC8vIENhbid0IHRlbGwgbm93IGFzIHdlIGRvbid0IGtub3cgd2hpY2ggcHJvcGVydGllcyBhIGN1c3RvbSBlbGVtZW50IHdpbGwgZ2V0XG4gICAgICAgIC8vIG9uY2UgaXQgaXMgaW5zdGFudGlhdGVkXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIGNvbnN0IGVsZW1lbnRQcm9wZXJ0aWVzID1cbiAgICAgICAgdGhpcy5fc2NoZW1hLmdldCh0YWdOYW1lLnRvTG93ZXJDYXNlKCkpIHx8IHRoaXMuX3NjaGVtYS5nZXQoJ3Vua25vd24nKSE7XG4gICAgcmV0dXJuIGVsZW1lbnRQcm9wZXJ0aWVzLmhhcyhwcm9wTmFtZSk7XG4gIH1cblxuICBvdmVycmlkZSBoYXNFbGVtZW50KHRhZ05hbWU6IHN0cmluZywgc2NoZW1hTWV0YXM6IFNjaGVtYU1ldGFkYXRhW10pOiBib29sZWFuIHtcbiAgICBpZiAoc2NoZW1hTWV0YXMuc29tZSgoc2NoZW1hKSA9PiBzY2hlbWEubmFtZSA9PT0gTk9fRVJST1JTX1NDSEVNQS5uYW1lKSkge1xuICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgaWYgKHRhZ05hbWUuaW5kZXhPZignLScpID4gLTEpIHtcbiAgICAgIGlmIChpc05nQ29udGFpbmVyKHRhZ05hbWUpIHx8IGlzTmdDb250ZW50KHRhZ05hbWUpKSB7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuXG4gICAgICBpZiAoc2NoZW1hTWV0YXMuc29tZSgoc2NoZW1hKSA9PiBzY2hlbWEubmFtZSA9PT0gQ1VTVE9NX0VMRU1FTlRTX1NDSEVNQS5uYW1lKSkge1xuICAgICAgICAvLyBBbGxvdyBhbnkgY3VzdG9tIGVsZW1lbnRzXG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiB0aGlzLl9zY2hlbWEuaGFzKHRhZ05hbWUudG9Mb3dlckNhc2UoKSk7XG4gIH1cblxuICAvKipcbiAgICogc2VjdXJpdHlDb250ZXh0IHJldHVybnMgdGhlIHNlY3VyaXR5IGNvbnRleHQgZm9yIHRoZSBnaXZlbiBwcm9wZXJ0eSBvbiB0aGUgZ2l2ZW4gRE9NIHRhZy5cbiAgICpcbiAgICogVGFnIGFuZCBwcm9wZXJ0eSBuYW1lIGFyZSBzdGF0aWNhbGx5IGtub3duIGFuZCBjYW5ub3QgY2hhbmdlIGF0IHJ1bnRpbWUsIGkuZS4gaXQgaXMgbm90XG4gICAqIHBvc3NpYmxlIHRvIGJpbmQgYSB2YWx1ZSBpbnRvIGEgY2hhbmdpbmcgYXR0cmlidXRlIG9yIHRhZyBuYW1lLlxuICAgKlxuICAgKiBUaGUgZmlsdGVyaW5nIGlzIGJhc2VkIG9uIGEgbGlzdCBvZiBhbGxvd2VkIHRhZ3N8YXR0cmlidXRlcy4gQWxsIGF0dHJpYnV0ZXMgaW4gdGhlIHNjaGVtYVxuICAgKiBhYm92ZSBhcmUgYXNzdW1lZCB0byBoYXZlIHRoZSAnTk9ORScgc2VjdXJpdHkgY29udGV4dCwgaS5lLiB0aGF0IHRoZXkgYXJlIHNhZmUgaW5lcnRcbiAgICogc3RyaW5nIHZhbHVlcy4gT25seSBzcGVjaWZpYyB3ZWxsIGtub3duIGF0dGFjayB2ZWN0b3JzIGFyZSBhc3NpZ25lZCB0aGVpciBhcHByb3ByaWF0ZSBjb250ZXh0LlxuICAgKi9cbiAgb3ZlcnJpZGUgc2VjdXJpdHlDb250ZXh0KHRhZ05hbWU6IHN0cmluZywgcHJvcE5hbWU6IHN0cmluZywgaXNBdHRyaWJ1dGU6IGJvb2xlYW4pOlxuICAgICAgU2VjdXJpdHlDb250ZXh0IHtcbiAgICBpZiAoaXNBdHRyaWJ1dGUpIHtcbiAgICAgIC8vIE5COiBGb3Igc2VjdXJpdHkgcHVycG9zZXMsIHVzZSB0aGUgbWFwcGVkIHByb3BlcnR5IG5hbWUsIG5vdCB0aGUgYXR0cmlidXRlIG5hbWUuXG4gICAgICBwcm9wTmFtZSA9IHRoaXMuZ2V0TWFwcGVkUHJvcE5hbWUocHJvcE5hbWUpO1xuICAgIH1cblxuICAgIC8vIE1ha2Ugc3VyZSBjb21wYXJpc29ucyBhcmUgY2FzZSBpbnNlbnNpdGl2ZSwgc28gdGhhdCBjYXNlIGRpZmZlcmVuY2VzIGJldHdlZW4gYXR0cmlidXRlIGFuZFxuICAgIC8vIHByb3BlcnR5IG5hbWVzIGRvIG5vdCBoYXZlIGEgc2VjdXJpdHkgaW1wYWN0LlxuICAgIHRhZ05hbWUgPSB0YWdOYW1lLnRvTG93ZXJDYXNlKCk7XG4gICAgcHJvcE5hbWUgPSBwcm9wTmFtZS50b0xvd2VyQ2FzZSgpO1xuICAgIGxldCBjdHggPSBTRUNVUklUWV9TQ0hFTUEoKVt0YWdOYW1lICsgJ3wnICsgcHJvcE5hbWVdO1xuICAgIGlmIChjdHgpIHtcbiAgICAgIHJldHVybiBjdHg7XG4gICAgfVxuICAgIGN0eCA9IFNFQ1VSSVRZX1NDSEVNQSgpWycqfCcgKyBwcm9wTmFtZV07XG4gICAgcmV0dXJuIGN0eCA/IGN0eCA6IFNlY3VyaXR5Q29udGV4dC5OT05FO1xuICB9XG5cbiAgb3ZlcnJpZGUgZ2V0TWFwcGVkUHJvcE5hbWUocHJvcE5hbWU6IHN0cmluZyk6IHN0cmluZyB7XG4gICAgcmV0dXJuIF9BVFRSX1RPX1BST1AuZ2V0KHByb3BOYW1lKSA/PyBwcm9wTmFtZTtcbiAgfVxuXG4gIG92ZXJyaWRlIGdldERlZmF1bHRDb21wb25lbnRFbGVtZW50TmFtZSgpOiBzdHJpbmcge1xuICAgIHJldHVybiAnbmctY29tcG9uZW50JztcbiAgfVxuXG4gIG92ZXJyaWRlIHZhbGlkYXRlUHJvcGVydHkobmFtZTogc3RyaW5nKToge2Vycm9yOiBib29sZWFuLCBtc2c/OiBzdHJpbmd9IHtcbiAgICBpZiAobmFtZS50b0xvd2VyQ2FzZSgpLnN0YXJ0c1dpdGgoJ29uJykpIHtcbiAgICAgIGNvbnN0IG1zZyA9IGBCaW5kaW5nIHRvIGV2ZW50IHByb3BlcnR5ICcke25hbWV9JyBpcyBkaXNhbGxvd2VkIGZvciBzZWN1cml0eSByZWFzb25zLCBgICtcbiAgICAgICAgICBgcGxlYXNlIHVzZSAoJHtuYW1lLnNsaWNlKDIpfSk9Li4uYCArXG4gICAgICAgICAgYFxcbklmICcke25hbWV9JyBpcyBhIGRpcmVjdGl2ZSBpbnB1dCwgbWFrZSBzdXJlIHRoZSBkaXJlY3RpdmUgaXMgaW1wb3J0ZWQgYnkgdGhlYCArXG4gICAgICAgICAgYCBjdXJyZW50IG1vZHVsZS5gO1xuICAgICAgcmV0dXJuIHtlcnJvcjogdHJ1ZSwgbXNnOiBtc2d9O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4ge2Vycm9yOiBmYWxzZX07XG4gICAgfVxuICB9XG5cbiAgb3ZlcnJpZGUgdmFsaWRhdGVBdHRyaWJ1dGUobmFtZTogc3RyaW5nKToge2Vycm9yOiBib29sZWFuLCBtc2c/OiBzdHJpbmd9IHtcbiAgICBpZiAobmFtZS50b0xvd2VyQ2FzZSgpLnN0YXJ0c1dpdGgoJ29uJykpIHtcbiAgICAgIGNvbnN0IG1zZyA9IGBCaW5kaW5nIHRvIGV2ZW50IGF0dHJpYnV0ZSAnJHtuYW1lfScgaXMgZGlzYWxsb3dlZCBmb3Igc2VjdXJpdHkgcmVhc29ucywgYCArXG4gICAgICAgICAgYHBsZWFzZSB1c2UgKCR7bmFtZS5zbGljZSgyKX0pPS4uLmA7XG4gICAgICByZXR1cm4ge2Vycm9yOiB0cnVlLCBtc2c6IG1zZ307XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiB7ZXJyb3I6IGZhbHNlfTtcbiAgICB9XG4gIH1cblxuICBvdmVycmlkZSBhbGxLbm93bkVsZW1lbnROYW1lcygpOiBzdHJpbmdbXSB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20odGhpcy5fc2NoZW1hLmtleXMoKSk7XG4gIH1cblxuICBhbGxLbm93bkF0dHJpYnV0ZXNPZkVsZW1lbnQodGFnTmFtZTogc3RyaW5nKTogc3RyaW5nW10ge1xuICAgIGNvbnN0IGVsZW1lbnRQcm9wZXJ0aWVzID1cbiAgICAgICAgdGhpcy5fc2NoZW1hLmdldCh0YWdOYW1lLnRvTG93ZXJDYXNlKCkpIHx8IHRoaXMuX3NjaGVtYS5nZXQoJ3Vua25vd24nKSE7XG4gICAgLy8gQ29udmVydCBwcm9wZXJ0aWVzIHRvIGF0dHJpYnV0ZXMuXG4gICAgcmV0dXJuIEFycmF5LmZyb20oZWxlbWVudFByb3BlcnRpZXMua2V5cygpKS5tYXAocHJvcCA9PiBfUFJPUF9UT19BVFRSLmdldChwcm9wKSA/PyBwcm9wKTtcbiAgfVxuXG4gIGFsbEtub3duRXZlbnRzT2ZFbGVtZW50KHRhZ05hbWU6IHN0cmluZyk6IHN0cmluZ1tdIHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbSh0aGlzLl9ldmVudFNjaGVtYS5nZXQodGFnTmFtZS50b0xvd2VyQ2FzZSgpKSA/PyBbXSk7XG4gIH1cblxuICBvdmVycmlkZSBub3JtYWxpemVBbmltYXRpb25TdHlsZVByb3BlcnR5KHByb3BOYW1lOiBzdHJpbmcpOiBzdHJpbmcge1xuICAgIHJldHVybiBkYXNoQ2FzZVRvQ2FtZWxDYXNlKHByb3BOYW1lKTtcbiAgfVxuXG4gIG92ZXJyaWRlIG5vcm1hbGl6ZUFuaW1hdGlvblN0eWxlVmFsdWUoXG4gICAgICBjYW1lbENhc2VQcm9wOiBzdHJpbmcsIHVzZXJQcm92aWRlZFByb3A6IHN0cmluZyxcbiAgICAgIHZhbDogc3RyaW5nfG51bWJlcik6IHtlcnJvcjogc3RyaW5nLCB2YWx1ZTogc3RyaW5nfSB7XG4gICAgbGV0IHVuaXQ6IHN0cmluZyA9ICcnO1xuICAgIGNvbnN0IHN0clZhbCA9IHZhbC50b1N0cmluZygpLnRyaW0oKTtcbiAgICBsZXQgZXJyb3JNc2c6IHN0cmluZyA9IG51bGwhO1xuXG4gICAgaWYgKF9pc1BpeGVsRGltZW5zaW9uU3R5bGUoY2FtZWxDYXNlUHJvcCkgJiYgdmFsICE9PSAwICYmIHZhbCAhPT0gJzAnKSB7XG4gICAgICBpZiAodHlwZW9mIHZhbCA9PT0gJ251bWJlcicpIHtcbiAgICAgICAgdW5pdCA9ICdweCc7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBjb25zdCB2YWxBbmRTdWZmaXhNYXRjaCA9IHZhbC5tYXRjaCgvXlsrLV0/W1xcZFxcLl0rKFthLXpdKikkLyk7XG4gICAgICAgIGlmICh2YWxBbmRTdWZmaXhNYXRjaCAmJiB2YWxBbmRTdWZmaXhNYXRjaFsxXS5sZW5ndGggPT0gMCkge1xuICAgICAgICAgIGVycm9yTXNnID0gYFBsZWFzZSBwcm92aWRlIGEgQ1NTIHVuaXQgdmFsdWUgZm9yICR7dXNlclByb3ZpZGVkUHJvcH06JHt2YWx9YDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4ge2Vycm9yOiBlcnJvck1zZywgdmFsdWU6IHN0clZhbCArIHVuaXR9O1xuICB9XG59XG5cbmZ1bmN0aW9uIF9pc1BpeGVsRGltZW5zaW9uU3R5bGUocHJvcDogc3RyaW5nKTogYm9vbGVhbiB7XG4gIHN3aXRjaCAocHJvcCkge1xuICAgIGNhc2UgJ3dpZHRoJzpcbiAgICBjYXNlICdoZWlnaHQnOlxuICAgIGNhc2UgJ21pbldpZHRoJzpcbiAgICBjYXNlICdtaW5IZWlnaHQnOlxuICAgIGNhc2UgJ21heFdpZHRoJzpcbiAgICBjYXNlICdtYXhIZWlnaHQnOlxuICAgIGNhc2UgJ2xlZnQnOlxuICAgIGNhc2UgJ3RvcCc6XG4gICAgY2FzZSAnYm90dG9tJzpcbiAgICBjYXNlICdyaWdodCc6XG4gICAgY2FzZSAnZm9udFNpemUnOlxuICAgIGNhc2UgJ291dGxpbmVXaWR0aCc6XG4gICAgY2FzZSAnb3V0bGluZU9mZnNldCc6XG4gICAgY2FzZSAncGFkZGluZ1RvcCc6XG4gICAgY2FzZSAncGFkZGluZ0xlZnQnOlxuICAgIGNhc2UgJ3BhZGRpbmdCb3R0b20nOlxuICAgIGNhc2UgJ3BhZGRpbmdSaWdodCc6XG4gICAgY2FzZSAnbWFyZ2luVG9wJzpcbiAgICBjYXNlICdtYXJnaW5MZWZ0JzpcbiAgICBjYXNlICdtYXJnaW5Cb3R0b20nOlxuICAgIGNhc2UgJ21hcmdpblJpZ2h0JzpcbiAgICBjYXNlICdib3JkZXJSYWRpdXMnOlxuICAgIGNhc2UgJ2JvcmRlcldpZHRoJzpcbiAgICBjYXNlICdib3JkZXJUb3BXaWR0aCc6XG4gICAgY2FzZSAnYm9yZGVyTGVmdFdpZHRoJzpcbiAgICBjYXNlICdib3JkZXJSaWdodFdpZHRoJzpcbiAgICBjYXNlICdib3JkZXJCb3R0b21XaWR0aCc6XG4gICAgY2FzZSAndGV4dEluZGVudCc6XG4gICAgICByZXR1cm4gdHJ1ZTtcblxuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cbiJdfQ==