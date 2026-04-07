export class WMEBase {
  id: string
  name: string
  wmeSDK: any
  settings: Settings | null
  private _settingsDirty: boolean = false

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

  // --- Event handlers ---

  onBeforeUnload (event: any) {
    if (this.settings && this._settingsDirty) {
      this.settings.save()
      this._settingsDirty = false
    }
  }

  /**
   * Mark settings as changed (will be saved on beforeunload)
   */
  markSettingsDirty () {
    this._settingsDirty = true
  }

  onNone (event: any) {}
  onSegment (event: any, element: any, model: any) {}
  onSegments (event: any, element: any, models: any) {}
  onNode (event: any, element: any, model: any) {}
  onNodes (event: any, element: any, models: any) {}
  onVenue (event: any, element: any, model: any) {}
  onVenues (event: any, element: any, models: any) {}
  onPlace (event: any, element: any, model: any) {}
  onPoint (event: any, element: any, model: any) {}
  onResidential (event: any, element: any, model: any) {}

  // --- Selection helpers ---

  /**
   * Get the current selection or null
   */
  getSelection (): any {
    return this.wmeSDK.Editing.getSelection() || null
  }

  // --- Venues ---

  getAllVenues (except: string[] = []) {
    const venues = this.wmeSDK.DataModel.Venues.getAll()
    const rank = this.wmeSDK.State.getUserInfo().rank
    return venues
      .filter((venue: any) => venue.lockRank <= rank)
      .filter((venue: any) => !except.length || except.indexOf(venue.categories[0]) === -1)
  }

  getSelectedVenue () {
    return this.getSelectedVenues()?.[0] ?? null
  }

  getSelectedVenues () {
    const selection = this.getSelection()
    if (!selection || selection.objectType !== 'venue') {
      return []
    }
    return selection.ids.map((id: any) => this.wmeSDK.DataModel.Venues.getById({ venueId: id }))
  }

  getSelectedVenueAddress () {
    const venue = this.getSelectedVenue()
    if (!venue) return null
    return this.wmeSDK.DataModel.Venues.getAddress({ venueId: venue.id })
  }

  // --- Segments ---

  getAllSegments (except: number[] = []) {
    const segments = this.wmeSDK.DataModel.Segments.getAll()
    const rank = this.wmeSDK.State.getUserInfo().rank
    return segments
      .filter((segment: any) => segment.lockRank <= rank)
      .filter((segment: any) => !except.length || except.indexOf(segment.roadType) === -1)
  }

  getSelectedSegment () {
    return this.getSelectedSegments()?.[0] ?? null
  }

  getSelectedSegments () {
    const selection = this.getSelection()
    if (!selection || selection.objectType !== 'segment') {
      return []
    }
    return selection.ids.map((id: any) => this.wmeSDK.DataModel.Segments.getById({ segmentId: id }))
  }

  getSelectedSegmentAddress () {
    const segment = this.getSelectedSegment()
    if (!segment) return null
    return this.wmeSDK.DataModel.Segments.getAddress({ segmentId: segment.id })
  }

  // --- Nodes ---

  getAllNodes (except: number[] = []) {
    const nodes = this.wmeSDK.DataModel.Nodes.getAll()
    if (!except.length) return nodes
    return nodes.filter((node: any) => except.indexOf(node.id) === -1)
  }

  getSelectedNode () {
    return this.getSelectedNodes()?.[0] ?? null
  }

  getSelectedNodes () {
    const selection = this.getSelection()
    if (!selection || selection.objectType !== 'node') {
      return []
    }
    return selection.ids.map((id: any) => this.wmeSDK.DataModel.Nodes.getById({ nodeId: id }))
  }
}
