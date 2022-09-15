// ==UserScript==
// @name         WME Base
// @version      0.0.5
// @description  Base class for Greasy Fork plugins for Waze Map Editor
// @license      MIT License
// @author       Anton Shevchuk
// @namespace    https://greasyfork.org/users/227648-anton-shevchuk
// @supportURL   https://github.com/AntonShevchuk/wme-base/issues
// @match        https://*.waze.com/editor*
// @match        https://*.waze.com/*/editor*
// @exclude      https://*.waze.com/user/editor*
// @icon         https://t3.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&url=https://anton.shevchuk.name&size=64
// @grant        none
// ==/UserScript==

/* jshint esversion: 8 */

/* global jQuery, W */

class WME {
  /**
   * Get all available POI except selected categories
   * @param {Array} except
   * @return {Array}
   */
  static getVenues (except = []) {
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
  static getSegments (except = []) {
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
  static getSelected () {
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
  static getSelectedVenues () {
    return WME.getSelected().filter((el) => el.type === 'venue')
  }

  /**
   * Get selected Area POI
   * @return {Object|null}
   */
  static getSelectedVenue () {
    if (WME.getSelectedVenues().length) {
      return WME.getSelectedVenues()[0]
    }
    return null
  }

  /**
   * Get selected Segments
   * @return {Array}
   */
  static getSelectedSegments () {
    return WME.getSelected().filter((el) => el.type === 'segment')
  }

  /**
   * Get selected Segment
   * @return {Object|null}
   */
  static getSelectedSegment () {
    if (WME.getSelectedSegments().length) {
      return WME.getSelectedSegments()[0]
    }
    return null
  }

  /**
   * Get selected Nodes
   * @return {Object}
   */
  static getSelectedNodes () {
    return WME.getSelected().filter((el) => el.type === 'node')
  }

  /**
   * Get selected Node
   * @return {Object|null}
   */
  static getSelectedNode () {
    if (WME.getSelectedNodes().length) {
      return WME.getSelectedNodes()[0]
    }
    return null
  }
}

class WMEBase {
  constructor (name) {
    this.name = name
    jQuery(document)
      .on('none.wme', (e) => this.onNone(e))
      .on('segment.wme', (e, el, t) => this.onSegment(e, el, t))
      .on('segments.wme', (e, el, t) => this.onSegments(e, el, t))
      .on('node.wme', (e, el, t) => this.onNode(e, el, t))
      .on('nodes.wme', (e, el, t) => this.onNodes(e, el, t))
      .on('venue.wme', (e, el, t) => this.onVenue(e, el, t))
      .on('venues.wme', (e, el, t) => this.onVenues(e, el, t))
      .on('point.wme', (e, el, t) => this.onPoint(e, el, t))
      .on('place.wme', (e, el, t) => this.onPlace(e, el, t))
      .on('residential.wme', (e, el, t) => this.onResidential(e, el, t))

    jQuery(window).on('beforeunload', (e) => this.onBeforeUnload(e))
  }

  /**
   * Log message with prefix
   * @param {String} message
   */
  log (message) {
    console.log(
      '%c' + this.name + ':%c ' + message,
      'color: #0DAD8D; font-weight: bold',
      'color: dimgray; font-weight: normal'
    )
  }

  /**
   * Handler for window `beforeunload` event
   * @param {jQuery.Event} event
   * @return {Null}
   */
  onBeforeUnload (event) {
  }

  /**
   * Handler for `none.wme` event
   * @param {jQuery.Event} event
   * @return {void}
   */
  onNone (event) {
  }

  /**
   * Handler for `segment.wme` event
   * @param {jQuery.Event} event
   * @param {HTMLElement} element
   * @param {W.model} model
   * @return {void}
   */
  onSegment (event, element, model) {
  }

  /**
   * Handler for `segments.wme` event
   * @param {jQuery.Event} event
   * @param {HTMLElement} element
   * @param {Array} models
   * @return {void}
   */
  onSegments (event, element, models) {
  }

  /**
   * Handler for `node.wme` event
   * @param {jQuery.Event} event
   * @param {HTMLElement} element
   * @param {W.model} model
   * @return {void}
   */
  onNode (event, element, model) {
  }

  /**
   * Handler for `nodes.wme` event
   * @param {jQuery.Event} event
   * @param {HTMLElement} element
   * @param {Array} models
   * @return {void}
   */
  onNodes (event, element, models) {
  }

  /**
   * Handler for `venue.wme` event
   * @param {jQuery.Event} event
   * @param {HTMLElement} element
   * @param {W.model} model
   * @return {void}
   */
  onVenue (event, element, model) {
  }

  /**
   * Handler for `venues.wme` event
   * @param {jQuery.Event} event
   * @param {HTMLElement} element
   * @param {Array} models
   * @return {void}
   */
  onVenues (event, element, models) {
  }

  /**
   * Handler for `place.wme` event
   * @param {jQuery.Event} event
   * @param {HTMLElement} element
   * @param {W.model} model
   * @return {void}
   */
  onPlace (event, element, model) {
  }

  /**
   * Handler for `point.wme` event
   * @param {jQuery.Event} event
   * @param {HTMLElement} element
   * @param {W.model} model
   * @return {void}
   */
  onPoint (event, element, model) {
  }

  /**
   * Handler for `residential.wme` event
   * @param {jQuery.Event} event
   * @param {HTMLElement} element
   * @param {W.model} model
   * @return {void}
   */
  onResidential (event, element, model) {
  }
}