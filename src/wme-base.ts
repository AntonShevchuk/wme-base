import type { Segment, SegmentAddress, Venue, VenueAddress, Node as WMENode } from 'wme-sdk-typings'

export class WMEBase {
  id: string
  name: string
  wmeSDK: any
  settings: Settings | null
  private _helper: any = null

  constructor (name: string, settings: any = null) {
    this.id = name.toLowerCase().replace(/\s+/g, '-')
    this.name = name

    this.wmeSDK = getWmeSdk({
      scriptId: this.id,
      scriptName: this.name,
    })

    if (settings && settings instanceof Settings) {
      this.settings = settings
    } else if (settings) {
      this.settings = new Settings(name, settings)
    } else {
      this.settings = null
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
      .on('residential.wme', (e, el, t) => this.onResidential(e, el, t))

    jQuery(window).on('beforeunload', (e) => this.onBeforeUnload(e))
  }

  // --- WMEUIHelper (lazy) ---

  get helper (): any {
    if (!this._helper) {
      this._helper = new WMEUIHelper(this.name)
    }
    return this._helper
  }

  // --- Logging ---

  log (message: string, ...args: any[]) {
    console.log(
      '%c' + this.name + ': %c' + message,
      'color: #0DAD8D; font-weight: bold',
      'color: dimgray; font-weight: normal',
      ...args
    )
  }

  warn (message: string, ...args: any[]) {
    console.warn(
      '%c' + this.name + ': %c' + message,
      'color: #DAA520; font-weight: bold',
      'color: dimgray; font-weight: normal',
      ...args
    )
  }

  error (message: string, ...args: any[]) {
    console.error(
      '%c' + this.name + ': %c' + message,
      'color: #FF4444; font-weight: bold',
      'color: dimgray; font-weight: normal',
      ...args
    )
  }

  group (message: string, ...args: any[]) {
    console.groupCollapsed(
      '%c' + this.name + ': %c' + message,
      'color: #0DAD8D; font-weight: bold',
      'color: dimgray; font-weight: normal',
      ...args
    )
  }

  groupEnd () {
    console.groupEnd()
  }

  // --- Shortcuts ---

  createShortcut (id: string, description: string, keys: string | null, callback: Function) {
    const shortcut: any = {
      callback: callback,
      description: description,
      shortcutId: this.id + '-' + id,
      shortcutKeys: keys,
    }

    if (keys && this.wmeSDK.Shortcuts.areShortcutKeysInUse({ shortcutKeys: keys })) {
      this.warn('Shortcut "' + keys + '" already in use')
      shortcut.shortcutKeys = null
    }

    this.wmeSDK.Shortcuts.createShortcut(shortcut)
  }

  // --- Event handlers ---

  onBeforeUnload (event: JQuery.Event) {
    if (this.settings) {
      this.settings.save()
    }
  }

  onNone (event: JQuery.Event) {}
  onSegment (event: JQuery.Event, element: HTMLElement, model: Segment) {}
  onSegments (event: JQuery.Event, element: HTMLElement, models: Segment[]) {}
  onNode (event: JQuery.Event, element: HTMLElement, model: WMENode) {}
  onNodes (event: JQuery.Event, element: HTMLElement, models: WMENode[]) {}
  onVenue (event: JQuery.Event, element: HTMLElement, model: Venue) {}
  onVenues (event: JQuery.Event, element: HTMLElement, models: Venue[]) {}
  onPlace (event: JQuery.Event, element: HTMLElement, model: Venue) {}
  onPoint (event: JQuery.Event, element: HTMLElement, model: Venue) {}
  onResidential (event: JQuery.Event, element: HTMLElement, model: Venue) {}

  // --- Permissions ---

  canEditSegment (model: Segment): boolean {
    return this.wmeSDK.DataModel.Segments.isRoadTypeDrivable({ roadType: model.roadType })
      && this.wmeSDK.DataModel.Segments.hasPermissions({ segmentId: model.id })
  }

  canEditVenue (model: Venue): boolean {
    return this.wmeSDK.DataModel.Venues.hasPermissions({ venueId: model.id })
  }

  // --- Selection ---

  getSelection (): any {
    return this.wmeSDK.Editing.getSelection() || null
  }

  // --- Venues ---

  getAllVenues (except: string[] = []): Venue[] {
    const venues = this.wmeSDK.DataModel.Venues.getAll()
    const rank = this.wmeSDK.State.getUserInfo().rank
    return venues
      .filter((venue: Venue) => venue.lockRank <= rank)
      .filter((venue: Venue) => !except.length || except.indexOf(venue.categories[0]) === -1)
  }

  getSelectedVenue (): Venue | null {
    return this.getSelectedVenues()?.[0] ?? null
  }

  getSelectedVenues (): Venue[] {
    const selection = this.getSelection()
    if (!selection || selection.objectType !== 'venue') {
      return []
    }
    return selection.ids.map((id: number) => this.wmeSDK.DataModel.Venues.getById({ venueId: id }))
  }

  getSelectedVenueAddress (): VenueAddress | null {
    const venue = this.getSelectedVenue()
    if (!venue) return null
    return this.wmeSDK.DataModel.Venues.getAddress({ venueId: venue.id })
  }

  // --- Segments ---

  getAllSegments (except: number[] = []): Segment[] {
    const segments = this.wmeSDK.DataModel.Segments.getAll()
    const rank = this.wmeSDK.State.getUserInfo().rank
    return segments
      .filter((segment: Segment) => segment.lockRank <= rank)
      .filter((segment: Segment) => !except.length || except.indexOf(segment.roadType) === -1)
  }

  getSelectedSegment (): Segment | null {
    return this.getSelectedSegments()?.[0] ?? null
  }

  getSelectedSegments (): Segment[] {
    const selection = this.getSelection()
    if (!selection || selection.objectType !== 'segment') {
      return []
    }
    return selection.ids.map((id: number) => this.wmeSDK.DataModel.Segments.getById({ segmentId: id }))
  }

  getSelectedSegmentAddress (): SegmentAddress | null {
    const segment = this.getSelectedSegment()
    if (!segment) return null
    return this.wmeSDK.DataModel.Segments.getAddress({ segmentId: segment.id })
  }

  // --- Nodes ---

  getAllNodes (except: number[] = []): WMENode[] {
    const nodes = this.wmeSDK.DataModel.Nodes.getAll()
    if (!except.length) return nodes
    return nodes.filter((node: WMENode) => except.indexOf(node.id) === -1)
  }

  getSelectedNode (): WMENode | null {
    return this.getSelectedNodes()?.[0] ?? null
  }

  getSelectedNodes (): WMENode[] {
    const selection = this.getSelection()
    if (!selection || selection.objectType !== 'node') {
      return []
    }
    return selection.ids.map((id: number) => this.wmeSDK.DataModel.Nodes.getById({ nodeId: id }))
  }
}
