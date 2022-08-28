# WME
Helper class for Greasy Fork plugins for Waze Map Editor

## Methods
* `WME.getVenues(except = [])` – return Array of venues, except some categories
* `WME.getSegments(except = [])` – return Array of segments, except some road types
* `WME.getSelected()` – return Array of the selected **models**, which you can edit
* `WME.getSelectedVenues()` – return Array of the selected venues **models**, which you can edit
* `WME.getSelectedVenue()` – return **model** of the selected venue, which you can edit
* `WME.getSelectedSegments()` – return Array of the selected segments **models**, which you can edit
* `WME.getSelectedSegment()` – return **model** of the selected segment, which you can edit
* `WME.getSelectedNodes()` – return Array of the selected nodes **models**, which you can edit, or null
* `WME.getSelectedNode()` – return **model** of the selected node, which you can edit, or null

# WME Base
Base class for Greasy Fork plugins for Waze Map Editor

## Methods

* `log(message)` – `console.log` wrapper
* `onSegment (event, element, model)` – handler for `segment.wme` event
* `onSegments (event, element, models)` – handler for `segments.wme` event
* `onNode (event, element, model)` – handler for `node.wme` event
* `onNodes (event, element, models)` – handler for `nodes.wme` event
* `onVenue (event, element, model)` – handler for `venue.wme` event
* `onVenues (event, element, models)` – handler for `venues.wme` event
* `onPoint (event, element, model)` – handler for `point.wme` event
* `onPlace (event, element, model)` – handler for `place.wme` event
* `onResidential (event, element, model)` – handler for `residential.wme` event

## Links
Author homepage: http://anton.shevchuk.name/  
Script homepage: https://github.com/AntonShevchuk/wme-base  
GreasyFork: https://greasyfork.org/en/scripts/450221-wme-base  
