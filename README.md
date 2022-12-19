# WME Base
Base class for Greasy Fork plugins for Waze Map Editor.

**What is it?**

WME Base class is parent class for your scripts, it works with events from the WME Bootstrap library.

## Requirements

⚠️ [WME Bootstrap Library](https://greasyfork.org/en/scripts/450160-wme-bootstrap) - is required for correct working of this class

## Methods

* `log(message)` – `console.log` wrapper
* `onBeforeUnload (event)` - handler for `window` `beforeunload` event
* `onNone (event)` – handler for `none.wme` event
* `onSegment (event, element, model)` – handler for `segment.wme` event
* `onSegments (event, element, models)` – handler for `segments.wme` event
* `onNode (event, element, model)` – handler for `node.wme` event
* `onNodes (event, element, models)` – handler for `nodes.wme` event
* `onVenue (event, element, model)` – handler for `venue.wme` event
* `onVenues (event, element, models)` – handler for `venues.wme` event
* `onPoint (event, element, model)` – handler for `point.wme` event
* `onPlace (event, element, model)` – handler for `place.wme` event
* `onResidential (event, element, model)` – handler for `residential.wme` event

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
   * @param {W.model} model
   * @return {void}
   */
  onSegment (event, element, model) {
    this.log('Selected one segment')
  }

  /**
   * Handler for `segments.wme` event
   * @param {jQuery.Event} event
   * @param {HTMLElement} element
   * @param {Array} models
   * @return {void}
   */
  onSegments (event, element, models) {
    this.log('Selected some segments')
  }

  /**
   * Handler for `node.wme` event
   * @param {jQuery.Event} event
   * @param {HTMLElement} element
   * @param {W.model} model
   * @return {void}
   */
  onNode (event, element, model) {
    this.log('Selected one node')
  }

  /**
   * Handler for `nodes.wme` event
   * @param {jQuery.Event} event
   * @param {HTMLElement} element
   * @param {Array} models
   * @return {void}
   */
  onNodes (event, element, models) {
    this.log('Selected some nodes, doesn\'t work')
  }

  /**
   * Handler for `venue.wme` event
   * @param {jQuery.Event} event
   * @param {HTMLElement} element
   * @param {W.model} model
   * @return {void}
   */
  onVenue (event, element, model) {
    this.log('Selected one venue')
  }

  /**
   * Handler for `venues.wme` event
   * @param {jQuery.Event} event
   * @param {HTMLElement} element
   * @param {Array} models
   * @return {void}
   */
  onVenues (event, element, models) {
    this.log('Selected some venues')
  }

  /**
   * Handler for `point.wme` event
   * @param {jQuery.Event} event
   * @param {HTMLElement} element
   * @param {W.model} model
   * @return {void}
   */
  onPoint (event, element, model) {
    this.log('Selected a point')
  }

  /**
   * Handler for `place.wme` event
   * @param {jQuery.Event} event
   * @param {HTMLElement} element
   * @param {W.model} model
   * @return {void}
   */
  onPlace (event, element, model) {
    this.log('Selected a place')
  }

  /**
   * Handler for `residential.wme` event
   * @param {jQuery.Event} event
   * @param {HTMLElement} element
   * @param {W.model} model
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
Author homepage: http://anton.shevchuk.name/  
Script homepage: https://github.com/AntonShevchuk/wme-base  
GreasyFork: https://greasyfork.org/en/scripts/450221-wme-base  
