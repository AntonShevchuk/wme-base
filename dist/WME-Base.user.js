// ==UserScript==
// @name         WME Base
// @version      0.3.1
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

(function () {
    'use strict';

    class WMEBase {
        constructor(name, settings = null) {
            this.id = name.toLowerCase().replace(' ', '-');
            this.name = name;
            this.wmeSDK = getWmeSdk({
                scriptId: this.id,
                scriptName: this.name
            });
            if (settings && settings instanceof Settings) {
                this.settings = settings;
            }
            else if (settings) {
                this.settings = new Settings(name, settings);
            }
            else {
                this.settings = null;
            }
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
                .on('residential.wme', (e, el, t) => this.onResidential(e, el, t));
            jQuery(window).on('beforeunload', (e) => this.onBeforeUnload(e));
        }
        log(message, ...args) {
            console.log('%c' + this.name + ': %c' + message, 'color: #0DAD8D; font-weight: bold', 'color: dimgray; font-weight: normal', ...args);
        }
        group(message, ...args) {
            console.groupCollapsed('%c' + this.name + ': %c' + message, 'color: #0DAD8D; font-weight: bold', 'color: dimgray; font-weight: normal', ...args);
        }
        groupEnd() {
            console.groupEnd();
        }
        onBeforeUnload(event) {
            if (this.settings) {
                this.settings.save();
            }
        }
        onNone(event) {
        }
        onSegment(event, element, model) {
        }
        onSegments(event, element, models) {
        }
        onNode(event, element, model) {
        }
        onNodes(event, element, models) {
        }
        onVenue(event, element, model) {
        }
        onVenues(event, element, models) {
        }
        onPlace(event, element, model) {
        }
        onPoint(event, element, model) {
        }
        onResidential(event, element, model) {
        }
        getAllVenues(except = []) {
            let selected = this.wmeSDK.DataModel.Venues.getAll();
            let rank = this.wmeSDK.State.getUserInfo().rank;
            // filter by lock rank
            selected = selected.filter((venue) => venue.lockRank <= rank);
            // filter by main category
            if (except.length) {
                selected = selected.filter((venue) => except.indexOf(venue.categories[0]) === -1);
            }
            return selected;
        }
        getSelectedVenue() {
            return this.getSelectedVenues()?.[0] ?? null;
        }
        getSelectedVenues() {
            let selection = this.wmeSDK.Editing.getSelection();
            if (!selection || selection.objectType !== 'venue') {
                return [];
            }
            return selection.ids.map((id) => this.wmeSDK.DataModel.Venues.getById({ venueId: id }));
        }
        getSelectedVenueAddress() {
            let venue = this.getSelectedVenue();
            if (!venue) {
                return null;
            }
            return this.wmeSDK.DataModel.Venues.getAddress({ venueId: venue.id });
        }
        getAllSegments(except = []) {
            let selected = this.wmeSDK.DataModel.Segments.getAll();
            let rank = this.wmeSDK.State.getUserInfo().rank;
            // filter by lock rank
            selected = selected.filter((segment) => segment.lockRank <= rank);
            // filter by road type
            if (except.length) {
                selected = selected.filter((segment) => except.indexOf(segment.roadType) === -1);
            }
            return selected;
        }
        getSelectedSegment() {
            return this.getSelectedSegments()?.[0] ?? null;
        }
        getSelectedSegments() {
            let selection = this.wmeSDK.Editing.getSelection();
            if (!selection || selection.objectType !== 'segment') {
                return [];
            }
            return selection.ids.map((id) => this.wmeSDK.DataModel.Segments.getById({ segmentId: id }));
        }
        getAllNodes(except = []) {
            return this.wmeSDK.DataModel.Nodes.getAll();
        }
        getSelectedNode() {
            return this.getSelectedNodes()?.[0] ?? null;
        }
        getSelectedNodes() {
            let selection = this.wmeSDK.Editing.getSelection();
            if (!selection || selection.objectType !== 'node') {
                return [];
            }
            return selection.ids.map((id) => this.wmeSDK.DataModel.Nodes.getById({ nodeId: id }));
        }
    }

    Object.assign(window, { WMEBase });

})();
