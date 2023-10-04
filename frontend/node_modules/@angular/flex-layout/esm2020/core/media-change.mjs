/**
 * Class instances emitted [to observers] for each mql notification
 */
export class MediaChange {
    /**
     * @param matches whether the mediaQuery is currently activated
     * @param mediaQuery e.g. (min-width: 600px) and (max-width: 959px)
     * @param mqAlias e.g. gt-sm, md, gt-lg
     * @param suffix e.g. GtSM, Md, GtLg
     * @param priority the priority of activation for the given breakpoint
     */
    constructor(matches = false, mediaQuery = 'all', mqAlias = '', suffix = '', priority = 0) {
        this.matches = matches;
        this.mediaQuery = mediaQuery;
        this.mqAlias = mqAlias;
        this.suffix = suffix;
        this.priority = priority;
        this.property = '';
    }
    /** Create an exact copy of the MediaChange */
    clone() {
        return new MediaChange(this.matches, this.mediaQuery, this.mqAlias, this.suffix);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWVkaWEtY2hhbmdlLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vLi4vLi4vLi4vLi4vcHJvamVjdHMvbGlicy9mbGV4LWxheW91dC9jb3JlL21lZGlhLWNoYW5nZS50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFTQTs7R0FFRztBQUNILE1BQU0sT0FBTyxXQUFXO0lBSXRCOzs7Ozs7T0FNRztJQUNILFlBQW1CLFVBQVUsS0FBSyxFQUNmLGFBQWEsS0FBSyxFQUNsQixVQUFVLEVBQUUsRUFDWixTQUFTLEVBQUUsRUFDWCxXQUFXLENBQUM7UUFKWixZQUFPLEdBQVAsT0FBTyxDQUFRO1FBQ2YsZUFBVSxHQUFWLFVBQVUsQ0FBUTtRQUNsQixZQUFPLEdBQVAsT0FBTyxDQUFLO1FBQ1osV0FBTSxHQUFOLE1BQU0sQ0FBSztRQUNYLGFBQVEsR0FBUixRQUFRLENBQUk7UUFkL0IsYUFBUSxHQUFXLEVBQUUsQ0FBQztJQWV0QixDQUFDO0lBRUQsOENBQThDO0lBQzlDLEtBQUs7UUFDSCxPQUFPLElBQUksV0FBVyxDQUFDLElBQUksQ0FBQyxPQUFPLEVBQUUsSUFBSSxDQUFDLFVBQVUsRUFBRSxJQUFJLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxNQUFNLENBQUMsQ0FBQztJQUNuRixDQUFDO0NBQ0YiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIExMQyBBbGwgUmlnaHRzIFJlc2VydmVkLlxuICpcbiAqIFVzZSBvZiB0aGlzIHNvdXJjZSBjb2RlIGlzIGdvdmVybmVkIGJ5IGFuIE1JVC1zdHlsZSBsaWNlbnNlIHRoYXQgY2FuIGJlXG4gKiBmb3VuZCBpbiB0aGUgTElDRU5TRSBmaWxlIGF0IGh0dHBzOi8vYW5ndWxhci5pby9saWNlbnNlXG4gKi9cbmV4cG9ydCB0eXBlIE1lZGlhUXVlcnlTdWJzY3JpYmVyID0gKGNoYW5nZXM6IE1lZGlhQ2hhbmdlKSA9PiB2b2lkO1xuXG4vKipcbiAqIENsYXNzIGluc3RhbmNlcyBlbWl0dGVkIFt0byBvYnNlcnZlcnNdIGZvciBlYWNoIG1xbCBub3RpZmljYXRpb25cbiAqL1xuZXhwb3J0IGNsYXNzIE1lZGlhQ2hhbmdlIHtcbiAgcHJvcGVydHk6IHN0cmluZyA9ICcnO1xuICB2YWx1ZTogYW55O1xuXG4gIC8qKlxuICAgKiBAcGFyYW0gbWF0Y2hlcyB3aGV0aGVyIHRoZSBtZWRpYVF1ZXJ5IGlzIGN1cnJlbnRseSBhY3RpdmF0ZWRcbiAgICogQHBhcmFtIG1lZGlhUXVlcnkgZS5nLiAobWluLXdpZHRoOiA2MDBweCkgYW5kIChtYXgtd2lkdGg6IDk1OXB4KVxuICAgKiBAcGFyYW0gbXFBbGlhcyBlLmcuIGd0LXNtLCBtZCwgZ3QtbGdcbiAgICogQHBhcmFtIHN1ZmZpeCBlLmcuIEd0U00sIE1kLCBHdExnXG4gICAqIEBwYXJhbSBwcmlvcml0eSB0aGUgcHJpb3JpdHkgb2YgYWN0aXZhdGlvbiBmb3IgdGhlIGdpdmVuIGJyZWFrcG9pbnRcbiAgICovXG4gIGNvbnN0cnVjdG9yKHB1YmxpYyBtYXRjaGVzID0gZmFsc2UsXG4gICAgICAgICAgICAgIHB1YmxpYyBtZWRpYVF1ZXJ5ID0gJ2FsbCcsXG4gICAgICAgICAgICAgIHB1YmxpYyBtcUFsaWFzID0gJycsXG4gICAgICAgICAgICAgIHB1YmxpYyBzdWZmaXggPSAnJyxcbiAgICAgICAgICAgICAgcHVibGljIHByaW9yaXR5ID0gMCkge1xuICB9XG5cbiAgLyoqIENyZWF0ZSBhbiBleGFjdCBjb3B5IG9mIHRoZSBNZWRpYUNoYW5nZSAqL1xuICBjbG9uZSgpOiBNZWRpYUNoYW5nZSB7XG4gICAgcmV0dXJuIG5ldyBNZWRpYUNoYW5nZSh0aGlzLm1hdGNoZXMsIHRoaXMubWVkaWFRdWVyeSwgdGhpcy5tcUFsaWFzLCB0aGlzLnN1ZmZpeCk7XG4gIH1cbn1cblxuXG4iXX0=