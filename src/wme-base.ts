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
      this.settings = new Settings(name, {})
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
    const shortcutId = this.id + '-' + id
    let effective: string | null
    if (this.settings && this.settings.has('shortcuts', shortcutId)) {
      // getAllShortcuts() returns numeric format "mod,keyCode" (e.g. "4,56");
      // createShortcut() requires combo format "A+8". Convert on read-back.
      effective = this.normalizeShortcutKeys(this.settings.get('shortcuts', shortcutId))
    } else {
      effective = keys
    }

    // The SDK requires the prior registration to be removed before
    // re-creating with the same id. isShortcutRegistered is unreliable,
    // so try delete unconditionally and swallow the "not found" error.
    try {
      this.wmeSDK.Shortcuts.deleteShortcut({ shortcutId })
    } catch (e) {
      // expected on first load
    }

    const shortcut: any = {
      callback: callback,
      description: description,
      shortcutId: shortcutId,
      shortcutKeys: effective,
    }

    if (effective && this.wmeSDK.Shortcuts.areShortcutKeysInUse({ shortcutKeys: effective })) {
      this.warn('Shortcut "' + effective + '" already in use')
      shortcut.shortcutKeys = null
    }

    this.wmeSDK.Shortcuts.createShortcut(shortcut)
  }

  // Convert WME's stored numeric format ("4,56" = Alt+8) to the combo
  // format createShortcut expects ("A+8"). Pass through combo strings and
  // null unchanged.
  protected normalizeShortcutKeys (keys: any): string | null {
    if (keys == null) return null
    const str = String(keys)
    if (!/^\d+,-?\d+$/.test(str)) return str
    const [modStr, codeStr] = str.split(',')
    const mod = parseInt(modStr, 10)
    const code = parseInt(codeStr, 10)
    if (isNaN(mod) || isNaN(code) || code < 0) return null
    let mods = ''
    if (mod & 4) mods += 'A'
    if (mod & 1) mods += 'C'
    if (mod & 2) mods += 'S'
    let char: string
    if (code >= 48 && code <= 57) char = String.fromCharCode(code)
    else if (code >= 65 && code <= 90) char = String.fromCharCode(code).toLowerCase()
    else char = String(code)
    return mods ? mods + '+' + char : char
  }

  // --- Event handlers ---

  onBeforeUnload (event: JQuery.Event) {
    if (!this.settings) return
    try {
      const prefix = this.id + '-'
      const all = this.wmeSDK.Shortcuts.getAllShortcuts() || []
      for (const sc of all) {
        if (!sc.shortcutId || !sc.shortcutId.startsWith(prefix)) continue
        this.settings.set(['shortcuts', sc.shortcutId], sc.shortcutKeys)
      }
    } catch (e) {
      this.warn('Failed to persist shortcuts', e)
    }
    this.settings.save()
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
