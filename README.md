# WME Base
Base class for Greasy Fork plugins for Waze Map Editor.

**What is it?**

WME Base class is the parent class for your scripts, it works with events from the WME Bootstrap library.

## Requirements

⚠️ [WME Bootstrap Library](https://greasyfork.org/en/scripts/450160-wme-bootstrap) - is required for correct working of this class

## Methods
### Core & Utility
Methods for initialization, logging, and lifecycle management.

| Method                           | Returns | Description                                                            |
|:---------------------------------|:--------|:-----------------------------------------------------------------------|
| **constructor(name, settings?)** | `void`  | Initializes plugin instance, binds listeners, and attaches to WME SDK. |
| **log(message, ...args)**        | `void`  | Logs a formatted message with the plugin prefix.                       |
| **group(message, ...args)**      | `void`  | Starts a collapsed console log group.                                  |
| **groupEnd()**                   | `void`  | Ends the current console group.                                        |
| **onBeforeUnload(event)**        | `void`  | Browser lifecycle hook; useful for saving settings.                    |

### Event Handlers
Override these methods to handle user interactions. All handlers return `void`.

| Method                                   | Description                                      |
|:-----------------------------------------|:-------------------------------------------------|
| **onNone(event)**                        | Triggered when the selection is cleared.         |
| **onSegment(event, element, model)**     | Triggered when a single segment is selected.     |
| **onSegments(event, element, models)**   | Triggered when multiple segments are selected.   |
| **onNode(event, element, model)**        | Triggered when a single node is selected.        |
| **onNodes(event, element, models)**      | Triggered when multiple nodes are selected.      |
| **onVenue(event, element, model)**       | Triggered when a single venue (POI) is selected. |
| **onVenues(event, element, models)**     | Triggered when multiple venues are selected.     |
| **onPlace(event, element, model)**       | Triggered when a place is selected.              |
| **onPoint(event, element, model)**       | Triggered when a point POI is selected.          |
| **onResidential(event, element, model)** | Triggered when a residential POI is selected.    |

### Data Helpers
Helper methods to retrieve WME objects.

| Method                        | Returns           | Description                                    |
|:------------------------------|:------------------|:-----------------------------------------------|
| **getAllSegments(except?)**   | `Segment[]`       | All segments (excluding specified road types). |
| **getSelectedSegment()**      | `Segment \| null` | The first selected segment.                    |
| **getSelectedSegments()**     | `Segment[]`       | All selected segments.                         |
| **getAllNodes()**             | `Node[]`          | All available nodes.                           |
| **getSelectedNode()**         | `Node \| null`    | The first selected node.                       |
| **getSelectedNodes()**        | `Node[]`          | All selected nodes.                            |
| **getAllVenues(except?)**     | `Venue[]`         | All venues (excluding specified categories).   |
| **getSelectedVenue()**        | `Venue \| null`   | The first selected venue.                      |
| **getSelectedVenues()**       | `Venue[]`         | All selected venues.                           |
| **getSelectedVenueAddress()** | `Address \| null` | Address object of the selected venue.          |

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
