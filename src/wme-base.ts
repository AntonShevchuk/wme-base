export class WMEBase {
  id: string
  name: string
  wmeSDK: any
  settings: Settings | null

  constructor (name: string, settings: any = null) {
    this.id = name.toLowerCase().replace(' ', '-')
    this.name = name

    this.wmeSDK = getWmeSdk(
      {
        scriptId: this.id,
        scriptName: this.name
      }
    )

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

  log (message: string, ...args: any[]) {
    console.log(
      '%c' + this.name + ': %c' + message,
      'color: #0DAD8D; font-weight: bold',
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

  groupEnd() {
    console.groupEnd()
  }

  onBeforeUnload (event: any) {
    if (this.settings) {
      this.settings.save()
    }
  }

  onNone (event: any) {
  }

  onSegment (event: any, element: any, model: any) {
  }

  onSegments (event: any, element: any, models: any) {
  }

  onNode (event: any, element: any, model: any) {
  }

  onNodes (event: any, element: any, models: any) {
  }

  onVenue (event: any, element: any, model: any) {
  }

  onVenues (event: any, element: any, models: any) {
  }

  onPlace (event: any, element: any, model: any) {
  }

  onPoint (event: any, element: any, model: any) {
  }

  onResidential (event: any, element: any, model: any) {
  }

  getAllVenues (except: string[] = []) {
    let selected = this.wmeSDK.DataModel.Venues.getAll()
    let rank = this.wmeSDK.State.getUserInfo().rank
    // filter by lock rank
    selected = selected.filter((venue: any) => venue.lockRank <= rank)
    // filter by main category
    if (except.length) {
      selected = selected.filter((venue: any) => except.indexOf(venue.categories[0]) === -1)
    }
    return selected
  }

  getSelectedVenue () {
    return this.getSelectedVenues()?.[0] ?? null
  }

  getSelectedVenues () {
    let selection = this.wmeSDK.Editing.getSelection()
    if (!selection || selection.objectType !== 'venue') {
      return []
    }
    return selection.ids.map((id: any) => this.wmeSDK.DataModel.Venues.getById( { venueId: id } ))
  }

  getSelectedVenueAddress () {
    let venue = this.getSelectedVenue()
    if (!venue) {
      return null
    }
    return this.wmeSDK.DataModel.Venues.getAddress({ venueId: venue.id })
  }

  getAllSegments (except: number[] = []) {
    let selected = this.wmeSDK.DataModel.Segments.getAll()
    let rank = this.wmeSDK.State.getUserInfo().rank
    // filter by lock rank
    selected = selected.filter((segment: any) => segment.lockRank <= rank)
    // filter by road type
    if (except.length) {
      selected = selected.filter((segment: any) => except.indexOf(segment.roadType) === -1)
    }
    return selected
  }

  getSelectedSegment () {
    return this.getSelectedSegments()?.[0] ?? null
  }

  getSelectedSegments () {
    let selection = this.wmeSDK.Editing.getSelection()
    if (!selection || selection.objectType !== 'segment') {
      return []
    }
    return selection.ids.map((id: any) => this.wmeSDK.DataModel.Segments.getById( { segmentId: id } ))
  }

  getAllNodes (except: any[] = []) {
    return this.wmeSDK.DataModel.Nodes.getAll()
  }

  getSelectedNode () {
    return this.getSelectedNodes()?.[0] ?? null
  }

  getSelectedNodes () {
    let selection = this.wmeSDK.Editing.getSelection()
    if (!selection || selection.objectType !== 'node') {
      return []
    }
    return selection.ids.map((id: any) => this.wmeSDK.DataModel.Nodes.getById( { nodeId: id } ))
  }
}
