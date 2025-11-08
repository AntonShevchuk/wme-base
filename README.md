# WME Base
Base class for Greasy Fork plugins for Waze Map Editor.

**What is it?**

WME Base class is parent class for your scripts, it works with events from the WME Bootstrap library.

## Requirements

⚠️ [WME Bootstrap Library](https://greasyfork.org/en/scripts/450160-wme-bootstrap) - is required for correct working of this class

## Methods


| Method                                   | Description                                                                      | Returns                |
| ---------------------------------------- | -------------------------------------------------------------------------------- | ---------------------- |
| **constructor(name, settings?)**         | Initializes plugin instance, binds WME event listeners, and attaches to WME SDK. | `void`                 |
| **log(message, ...args)**                | Logs a formatted message with plugin prefix.                                     | `void`                 |
| **group(message, ...args)**              | Starts a collapsed console log group.                                            | `void`                 |
| **groupEnd()**                           | Ends the current console group.                                                  | `void`                 |
| **onBeforeUnload(event)**                | Handles `beforeunload` — saves settings if available.                            | `void`                 |
| **onNone(event)**                        | Triggered when no object is selected.                                            | `void`                 |
| **onSegment(event, element, model)**     | Triggered when a single segment is selected.                                     | `void`                 |
| **onSegments(event, element, models)**   | Triggered when multiple segments are selected.                                   | `void`                 |
| **onNode(event, element, model)**        | Triggered when a single node is selected.                                        | `void`                 |
| **onNodes(event, element, models)**      | Triggered when multiple nodes are selected.                                      | `void`                 |
| **onVenue(event, element, model)**       | Triggered when a single venue (POI) is selected.                                 | `void`                 |
| **onVenues(event, element, models)**     | Triggered when multiple venues are selected.                                     | `void`                 |
| **onPlace(event, element, model)**       | Triggered when a place is selected.                                              | `void`                 |
| **onPoint(event, element, model)**       | Triggered when a point POI is selected.                                          | `void`                 |
| **onResidential(event, element, model)** | Triggered when a residential POI is selected.                                    | `void`                 |
| **getAllVenues(except?)**                | Returns all venues excluding specified categories.                               | `Venue[]`              |
| **getSelectedVenue()**                   | Returns the first selected venue.                                                | `Venue \| null`        |
| **getSelectedVenues()**                  | Returns all selected venues.                                                     | `Venue[]`              |
| **getSelectedVenueAddress()**            | Returns the address of the selected venue.                                       | `VenueAddress \| null` |
| **getAllSegments(except?)**              | Returns all segments excluding specified road types.                             | `Segment[]`            |
| **getSelectedSegment()**                 | Returns the first selected segment.                                              | `Segment \| null`      |
| **getSelectedSegments()**                | Returns all selected segments.                                                   | `Segment[]`            |
| **getAllNodes()**                        | Returns all available nodes.                                                     | `Node[]`               |
| **getSelectedNode()**                    | Returns the first selected node.                                                 | `Node \| null`         |
| **getSelectedNodes()**                   | Returns all selected nodes.                                                      | `Node[]`               |

## Example

```javascript
class MySuperScript extends WMEBase {
  /**
   * Example of the constructor
   * @param {String} name
   * @param {Settings} settings
   */
  constructor (name, settings = null) {
    super(name, settings)
  }

  /**
   * Handler for `none.wme` event
   * @param {jQuery.Event} event
   * @return {void}
   */
  onNone (event) {
    this.log('No select')
  }

  /**
   * Handler for `segment.wme` event
   * @param {jQuery.Event} event
   * @param {HTMLElement} element
   * @param {Segment} model
   * @return {void}
   */
  onSegment (event, element, model) {
    this.log('Selected one segment')
  }

  /**
   * Handler for `segments.wme` event
   * @param {jQuery.Event} event
   * @param {HTMLElement} element
   * @param {Segment[]} models
   * @return {void}
   */
  onSegments (event, element, models) {
    this.log('Selected some segments')
  }

  /**
   * Handler for `node.wme` event
   * @param {jQuery.Event} event
   * @param {HTMLElement} element
   * @param {Node$1} model
   * @return {void}
   */
  onNode (event, element, model) {
    this.log('Selected one node')
  }

  /**
   * Handler for `nodes.wme` event
   * @param {jQuery.Event} event
   * @param {HTMLElement} element
   * @param {Node$1[]} models
   * @return {void}
   */
  onNodes (event, element, models) {
    this.log('Selected some nodes, doesn\'t work')
  }

  /**
   * Handler for `venue.wme` event
   * @param {jQuery.Event} event
   * @param {HTMLElement} element
   * @param {Venue} model
   * @return {void}
   */
  onVenue (event, element, model) {
    this.log('Selected one venue')
  }

  /**
   * Handler for `venues.wme` event
   * @param {jQuery.Event} event
   * @param {HTMLElement} element
   * @param {Venue[]} models
   * @return {void}
   */
  onVenues (event, element, models) {
    this.log('Selected some venues')
  }

  /**
   * Handler for `point.wme` event
   * @param {jQuery.Event} event
   * @param {HTMLElement} element
   * @param {Venue} model
   * @return {void}
   */
  onPoint (event, element, model) {
    this.log('Selected a point')
  }

  /**
   * Handler for `place.wme` event
   * @param {jQuery.Event} event
   * @param {HTMLElement} element
   * @param {Venue} model
   * @return {void}
   */
  onPlace (event, element, model) {
    this.log('Selected a place')
  }

  /**
   * Handler for `residential.wme` event
   * @param {jQuery.Event} event
   * @param {HTMLElement} element
   * @param {Venue} model
   * @return {void}
   */
  onResidential (event, element, model) {
    this.log('Selected a residential')
  }

  /**
   * Handler for window `beforeunload` event
   * @param {jQuery.Event} event
   * @return {Null}
   */
  onBeforeUnload (event) {
    this.log('Can be use for save or check settings')
    if (this.settings) {
      this.settings.save()
    }
  }
}
```

## Links

Author homepage: https://anton.shevchuk.name/  
Author pet projects: https://hohli.com/  
Support author: https://donate.hohli.com/  
Script homepage: https://github.com/AntonShevchuk/wme-base  
GreasyFork: https://greasyfork.org/en/scripts/450221-wme-base  
