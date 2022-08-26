// ==UserScript==
// @name         WME Base
// @namespace    https://greasyfork.org/users/227648-anton-shevchuk
// @version      0.0.1
// @description  Base class for Greasy Fork plugins for Waze Map Editor
// @license      MIT License
// @match        https://www.waze.com/editor*
// @match        https://www.waze.com/*/editor*
// @match        https://beta.waze.com/editor*
// @match        https://beta.waze.com/*/editor*
// @exclude      https://www.waze.com/user/editor*
// @exclude      https://beta.waze.com/user/editor*
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://anton.shevchuk.name&size=64
// @grant        none
// ==/UserScript==

/* jshint esversion: 6 */

/* global jQuery, W */

class WMEBase {
  constructor () {
    jQuery(document)
      .on('boostrap.wme', this.onBoostrap)
      .on('segment.wme', this.onSegment)
      .on('segments.wme', this.onSegments)
      .on('node.wme',this.onNode)
      .on('nodes.wme', this.onNodes)
      .on('venue.wme', this.onVenue)
      .on('venues.wme', this.onVenues)
      .on('point.wme', this.onPoint)
      .on('residential.wme', this.onResidential)
  }

  /**
   * Handler for `boostrap.wme` event
   * @return {Null}
   */
  onBoostrap() {
  }

  /**
   * Handler for `segment.wme` event
   * @param {jQuery.Event} event
   * @param {HTMLElement} element
   * @param {W.model} model
   * @return {Null}
   */
  onSegment(event, element, model) {
  }

  /**
   * Handler for `segments.wme` event
   * @param {jQuery.Event} event
   * @param {HTMLElement} element
   * @param {Array} models
   * @return {Null}
   */
  onSegments(event, element, models) {
  }

  /**
   * Handler for `node.wme` event
   * @param {jQuery.Event} event
   * @param {HTMLElement} element
   * @param {W.model} model
   * @return {Null}
   */
  onNode(event, element, model) {
  }

  /**
   * Handler for `nodes.wme` event
   * @param {jQuery.Event} event
   * @param {HTMLElement} element
   * @param {Array} models
   * @return {Null}
   */
  onNodes(event, element, models) {
  }

  /**
   * Handler for `venue.wme` event
   * @param {jQuery.Event} event
   * @param {HTMLElement} element
   * @param {W.model} model
   * @return {Null}
   */
  onVenue(event, element, model) {
  }

  /**
   * Handler for `venues.wme` event
   * @param {jQuery.Event} event
   * @param {HTMLElement} element
   * @param {Array} models
   * @return {Null}
   */
  onVenues(event, element, models) {
  }

  /**
   * Handler for `point.wme` event
   * @param {jQuery.Event} event
   * @param {HTMLElement} element
   * @param {W.model} model
   * @return {Null}
   */
  onPoint(event, element, model) {
  }

  /**
   * Handler for `residential.wme` event
   * @param {jQuery.Event} event
   * @param {HTMLElement} element
   * @param {W.model} model
   * @return {Null}
   */
  onResidential(event, element, model) {
  }

  /**
   * Get all available POI except selected categories
   * @param {Array} except
   * @return {Array}
   */
  getVenues (except = []) {
    let selected = W.model.venues.getObjectArray()
    selected = selected.filter((el) => el.isGeometryEditable())
    // filter by main category
    if (except.length) {
      selected = selected.filter(model => except.indexOf(model.getMainCategory()) === -1)
    }
    return selected
  }

  /**
   * Get all available segments except selected road types
   * @param {Array} except
   * @return {Array}
   */
  getSegments (except = []) {
    let selected = W.model.segments.getObjectArray()
    selected = selected.filter((el) => el.isGeometryEditable())
    // filter by road type
    if (except.length) {
      selected = selected.filter(segment => except.indexOf(segment.getRoadType()) === -1)
    }
    return selected
  }

  /**
   * Get selected features which you can(!) edit
   * @returns {Array}
   */
  getSelected () {
    if (!W.selectionManager.hasSelectedFeatures()) {
      return []
    }
    let selected
    selected = W.selectionManager.getSelectedFeatures().map((x) => x.model)
    selected = selected.filter((el) => el.isGeometryEditable())
    return selected
  }

  /**
   * Get selected Area POI(s)
   * @return {Array}
   */
  getSelectedVenues () {
    return this.getSelected().filter((el) => el.type === 'venue')
  }

  /**
   * Get selected Area POI
   * @return {Object|null}
   */
  getSelectedVenue () {
    if (this.getSelectedVenues().length) {
      return this.getSelectedVenues()[0]
    }
    return null
  }

  /**
   * Get selected Segments
   * @return {Array}
   */
  getSelectedSegments () {
    return this.getSelected().filter((el) => el.type === 'segment')
  }

  /**
   * Get selected Segment
   * @return {Object|null}
   */
  getSelectedSegment () {
    if (this.getSelectedSegments().length) {
      return this.getSelectedSegments()[0]
    }
    return null
  }

  /**
   * Get selected Nodes
   * @return {Object}
   */
  getSelectedNodes () {
    return this.getSelected().filter((el) => el.type === 'node')
  }

  /**
   * Get selected Node
   * @return {Object|null}
   */
  getSelectedNode () {
    if (this.getSelectedNodes().length) {
      return this.getSelectedNodes()[0]
    }
    return null
  }
}