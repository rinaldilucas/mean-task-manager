/**
 * NOTE: Smaller ranges have HIGHER priority since the match is more specific
 */
export const DEFAULT_BREAKPOINTS = [
    {
        alias: 'xs',
        mediaQuery: 'screen and (min-width: 0px) and (max-width: 599.98px)',
        priority: 1000,
    },
    {
        alias: 'sm',
        mediaQuery: 'screen and (min-width: 600px) and (max-width: 959.98px)',
        priority: 900,
    },
    {
        alias: 'md',
        mediaQuery: 'screen and (min-width: 960px) and (max-width: 1279.98px)',
        priority: 800,
    },
    {
        alias: 'lg',
        mediaQuery: 'screen and (min-width: 1280px) and (max-width: 1919.98px)',
        priority: 700,
    },
    {
        alias: 'xl',
        mediaQuery: 'screen and (min-width: 1920px) and (max-width: 4999.98px)',
        priority: 600,
    },
    {
        alias: 'lt-sm',
        overlapping: true,
        mediaQuery: 'screen and (max-width: 599.98px)',
        priority: 950,
    },
    {
        alias: 'lt-md',
        overlapping: true,
        mediaQuery: 'screen and (max-width: 959.98px)',
        priority: 850,
    },
    {
        alias: 'lt-lg',
        overlapping: true,
        mediaQuery: 'screen and (max-width: 1279.98px)',
        priority: 750,
    },
    {
        alias: 'lt-xl',
        overlapping: true,
        priority: 650,
        mediaQuery: 'screen and (max-width: 1919.98px)',
    },
    {
        alias: 'gt-xs',
        overlapping: true,
        mediaQuery: 'screen and (min-width: 600px)',
        priority: -950,
    },
    {
        alias: 'gt-sm',
        overlapping: true,
        mediaQuery: 'screen and (min-width: 960px)',
        priority: -850,
    }, {
        alias: 'gt-md',
        overlapping: true,
        mediaQuery: 'screen and (min-width: 1280px)',
        priority: -750,
    },
    {
        alias: 'gt-lg',
        overlapping: true,
        mediaQuery: 'screen and (min-width: 1920px)',
        priority: -650,
    }
];
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiYnJlYWstcG9pbnRzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbGlicy9mbGV4LWxheW91dC9jb3JlL2JyZWFrcG9pbnRzL2RhdGEvYnJlYWstcG9pbnRzLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQVNBOztHQUVHO0FBQ0gsTUFBTSxDQUFDLE1BQU0sbUJBQW1CLEdBQWlCO0lBQy9DO1FBQ0UsS0FBSyxFQUFFLElBQUk7UUFDWCxVQUFVLEVBQUUsdURBQXVEO1FBQ25FLFFBQVEsRUFBRSxJQUFJO0tBQ2Y7SUFDRDtRQUNFLEtBQUssRUFBRSxJQUFJO1FBQ1gsVUFBVSxFQUFFLHlEQUF5RDtRQUNyRSxRQUFRLEVBQUUsR0FBRztLQUNkO0lBQ0Q7UUFDRSxLQUFLLEVBQUUsSUFBSTtRQUNYLFVBQVUsRUFBRSwwREFBMEQ7UUFDdEUsUUFBUSxFQUFFLEdBQUc7S0FDZDtJQUNEO1FBQ0UsS0FBSyxFQUFFLElBQUk7UUFDWCxVQUFVLEVBQUUsMkRBQTJEO1FBQ3ZFLFFBQVEsRUFBRSxHQUFHO0tBQ2Q7SUFDRDtRQUNFLEtBQUssRUFBRSxJQUFJO1FBQ1gsVUFBVSxFQUFFLDJEQUEyRDtRQUN2RSxRQUFRLEVBQUUsR0FBRztLQUNkO0lBQ0Q7UUFDRSxLQUFLLEVBQUUsT0FBTztRQUNkLFdBQVcsRUFBRSxJQUFJO1FBQ2pCLFVBQVUsRUFBRSxrQ0FBa0M7UUFDOUMsUUFBUSxFQUFFLEdBQUc7S0FDZDtJQUNEO1FBQ0UsS0FBSyxFQUFFLE9BQU87UUFDZCxXQUFXLEVBQUUsSUFBSTtRQUNqQixVQUFVLEVBQUUsa0NBQWtDO1FBQzlDLFFBQVEsRUFBRSxHQUFHO0tBQ2Q7SUFDRDtRQUNFLEtBQUssRUFBRSxPQUFPO1FBQ2QsV0FBVyxFQUFFLElBQUk7UUFDakIsVUFBVSxFQUFFLG1DQUFtQztRQUMvQyxRQUFRLEVBQUUsR0FBRztLQUNkO0lBQ0Q7UUFDRSxLQUFLLEVBQUUsT0FBTztRQUNkLFdBQVcsRUFBRSxJQUFJO1FBQ2pCLFFBQVEsRUFBRSxHQUFHO1FBQ2IsVUFBVSxFQUFFLG1DQUFtQztLQUNoRDtJQUNEO1FBQ0UsS0FBSyxFQUFFLE9BQU87UUFDZCxXQUFXLEVBQUUsSUFBSTtRQUNqQixVQUFVLEVBQUUsK0JBQStCO1FBQzNDLFFBQVEsRUFBRSxDQUFDLEdBQUc7S0FDZjtJQUNEO1FBQ0UsS0FBSyxFQUFFLE9BQU87UUFDZCxXQUFXLEVBQUUsSUFBSTtRQUNqQixVQUFVLEVBQUUsK0JBQStCO1FBQzNDLFFBQVEsRUFBRSxDQUFDLEdBQUc7S0FDZixFQUFFO1FBQ0QsS0FBSyxFQUFFLE9BQU87UUFDZCxXQUFXLEVBQUUsSUFBSTtRQUNqQixVQUFVLEVBQUUsZ0NBQWdDO1FBQzVDLFFBQVEsRUFBRSxDQUFDLEdBQUc7S0FDZjtJQUNEO1FBQ0UsS0FBSyxFQUFFLE9BQU87UUFDZCxXQUFXLEVBQUUsSUFBSTtRQUNqQixVQUFVLEVBQUUsZ0NBQWdDO1FBQzVDLFFBQVEsRUFBRSxDQUFDLEdBQUc7S0FDZjtDQUNGLENBQUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmltcG9ydCB7QnJlYWtQb2ludH0gZnJvbSAnLi4vYnJlYWstcG9pbnQnO1xuXG4vKipcbiAqIE5PVEU6IFNtYWxsZXIgcmFuZ2VzIGhhdmUgSElHSEVSIHByaW9yaXR5IHNpbmNlIHRoZSBtYXRjaCBpcyBtb3JlIHNwZWNpZmljXG4gKi9cbmV4cG9ydCBjb25zdCBERUZBVUxUX0JSRUFLUE9JTlRTOiBCcmVha1BvaW50W10gPSBbXG4gIHtcbiAgICBhbGlhczogJ3hzJyxcbiAgICBtZWRpYVF1ZXJ5OiAnc2NyZWVuIGFuZCAobWluLXdpZHRoOiAwcHgpIGFuZCAobWF4LXdpZHRoOiA1OTkuOThweCknLFxuICAgIHByaW9yaXR5OiAxMDAwLFxuICB9LFxuICB7XG4gICAgYWxpYXM6ICdzbScsXG4gICAgbWVkaWFRdWVyeTogJ3NjcmVlbiBhbmQgKG1pbi13aWR0aDogNjAwcHgpIGFuZCAobWF4LXdpZHRoOiA5NTkuOThweCknLFxuICAgIHByaW9yaXR5OiA5MDAsXG4gIH0sXG4gIHtcbiAgICBhbGlhczogJ21kJyxcbiAgICBtZWRpYVF1ZXJ5OiAnc2NyZWVuIGFuZCAobWluLXdpZHRoOiA5NjBweCkgYW5kIChtYXgtd2lkdGg6IDEyNzkuOThweCknLFxuICAgIHByaW9yaXR5OiA4MDAsXG4gIH0sXG4gIHtcbiAgICBhbGlhczogJ2xnJyxcbiAgICBtZWRpYVF1ZXJ5OiAnc2NyZWVuIGFuZCAobWluLXdpZHRoOiAxMjgwcHgpIGFuZCAobWF4LXdpZHRoOiAxOTE5Ljk4cHgpJyxcbiAgICBwcmlvcml0eTogNzAwLFxuICB9LFxuICB7XG4gICAgYWxpYXM6ICd4bCcsXG4gICAgbWVkaWFRdWVyeTogJ3NjcmVlbiBhbmQgKG1pbi13aWR0aDogMTkyMHB4KSBhbmQgKG1heC13aWR0aDogNDk5OS45OHB4KScsXG4gICAgcHJpb3JpdHk6IDYwMCxcbiAgfSxcbiAge1xuICAgIGFsaWFzOiAnbHQtc20nLFxuICAgIG92ZXJsYXBwaW5nOiB0cnVlLFxuICAgIG1lZGlhUXVlcnk6ICdzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDU5OS45OHB4KScsXG4gICAgcHJpb3JpdHk6IDk1MCxcbiAgfSxcbiAge1xuICAgIGFsaWFzOiAnbHQtbWQnLFxuICAgIG92ZXJsYXBwaW5nOiB0cnVlLFxuICAgIG1lZGlhUXVlcnk6ICdzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDk1OS45OHB4KScsXG4gICAgcHJpb3JpdHk6IDg1MCxcbiAgfSxcbiAge1xuICAgIGFsaWFzOiAnbHQtbGcnLFxuICAgIG92ZXJsYXBwaW5nOiB0cnVlLFxuICAgIG1lZGlhUXVlcnk6ICdzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDEyNzkuOThweCknLFxuICAgIHByaW9yaXR5OiA3NTAsXG4gIH0sXG4gIHtcbiAgICBhbGlhczogJ2x0LXhsJyxcbiAgICBvdmVybGFwcGluZzogdHJ1ZSxcbiAgICBwcmlvcml0eTogNjUwLFxuICAgIG1lZGlhUXVlcnk6ICdzY3JlZW4gYW5kIChtYXgtd2lkdGg6IDE5MTkuOThweCknLFxuICB9LFxuICB7XG4gICAgYWxpYXM6ICdndC14cycsXG4gICAgb3ZlcmxhcHBpbmc6IHRydWUsXG4gICAgbWVkaWFRdWVyeTogJ3NjcmVlbiBhbmQgKG1pbi13aWR0aDogNjAwcHgpJyxcbiAgICBwcmlvcml0eTogLTk1MCxcbiAgfSxcbiAge1xuICAgIGFsaWFzOiAnZ3Qtc20nLFxuICAgIG92ZXJsYXBwaW5nOiB0cnVlLFxuICAgIG1lZGlhUXVlcnk6ICdzY3JlZW4gYW5kIChtaW4td2lkdGg6IDk2MHB4KScsXG4gICAgcHJpb3JpdHk6IC04NTAsXG4gIH0sIHtcbiAgICBhbGlhczogJ2d0LW1kJyxcbiAgICBvdmVybGFwcGluZzogdHJ1ZSxcbiAgICBtZWRpYVF1ZXJ5OiAnc2NyZWVuIGFuZCAobWluLXdpZHRoOiAxMjgwcHgpJyxcbiAgICBwcmlvcml0eTogLTc1MCxcbiAgfSxcbiAge1xuICAgIGFsaWFzOiAnZ3QtbGcnLFxuICAgIG92ZXJsYXBwaW5nOiB0cnVlLFxuICAgIG1lZGlhUXVlcnk6ICdzY3JlZW4gYW5kIChtaW4td2lkdGg6IDE5MjBweCknLFxuICAgIHByaW9yaXR5OiAtNjUwLFxuICB9XG5dO1xuXG4iXX0=