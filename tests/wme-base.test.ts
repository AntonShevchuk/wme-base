import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock globals before importing
const mockSave = vi.fn()
const mockGetAll = vi.fn()
const mockGetById = vi.fn()
const mockGetSelection = vi.fn()
const mockGetUserInfo = vi.fn(() => ({ rank: 3 }))
const mockGetAddress = vi.fn()
const mockCreateShortcut = vi.fn()
const mockAreShortcutKeysInUse = vi.fn(() => false)
const mockGetAllShortcuts = vi.fn(() => [])
const mockIsShortcutRegistered = vi.fn(() => false)
const mockDeleteShortcut = vi.fn()

const mockWmeSDK = {
  DataModel: {
    Venues: {
      getAll: mockGetAll,
      getById: mockGetById,
      getAddress: mockGetAddress,
    },
    Segments: {
      getAll: mockGetAll,
      getById: mockGetById,
    },
    Nodes: {
      getAll: mockGetAll,
      getById: mockGetById,
    },
  },
  Editing: {
    getSelection: mockGetSelection,
  },
  State: {
    getUserInfo: mockGetUserInfo,
  },
  Shortcuts: {
    createShortcut: mockCreateShortcut,
    areShortcutKeysInUse: mockAreShortcutKeysInUse,
    getAllShortcuts: mockGetAllShortcuts,
    isShortcutRegistered: mockIsShortcutRegistered,
    deleteShortcut: mockDeleteShortcut,
  },
}

// Mock jQuery
const mockOn = vi.fn().mockReturnThis()
const mockJQuery: any = vi.fn(() => ({ on: mockOn }))

// @ts-ignore
globalThis.jQuery = mockJQuery
// @ts-ignore
globalThis.getWmeSdk = vi.fn(() => mockWmeSDK)

// Mock Settings class — walks `container` like the real one does
class MockSettings {
  name: string
  defaults: any
  container: any
  constructor(name: string, defaults: any) {
    this.name = name
    this.defaults = defaults
    this.container = {}
  }
  get(...keys: string[]): any {
    if (keys.length === 0) return this.container
    let target: any = this.container
    for (const k of keys) {
      if (typeof target[k] === 'undefined') return null
      target = target[k]
    }
    return target
  }
  set(path: any[], value: any) {
    let target: any = this.container
    for (let i = 0; i < path.length - 1; i++) {
      if (typeof target[path[i]] === 'undefined') target[path[i]] = {}
      target = target[path[i]]
    }
    target[path[path.length - 1]] = value
  }
  has(...keys: string[]): boolean {
    let target: any = this.container
    for (const k of keys) {
      if (typeof target[k] === 'undefined') return false
      target = target[k]
    }
    return true
  }
  save() { mockSave() }
}
// @ts-ignore
globalThis.Settings = MockSettings

// Now import the class
import { WMEBase } from '../src/wme-base'

describe('WMEBase', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockGetUserInfo.mockReturnValue({ rank: 3 })
  })

  describe('constructor', () => {
    it('should generate id from name (lowercase, spaces to hyphens)', () => {
      const base = new WMEBase('My Script')
      expect(base.id).toBe('my-script')
      expect(base.name).toBe('My Script')
    })

    it('should create an empty Settings when none is provided', () => {
      const base = new WMEBase('Test')
      expect(base.settings).toBeInstanceOf(MockSettings)
    })

    it('should use Settings instance directly', () => {
      const settings = new MockSettings('Test', {})
      const base = new WMEBase('Test', settings)
      expect(base.settings).toBe(settings)
    })

    it('should create Settings from plain object', () => {
      const base = new WMEBase('Test', { foo: 'bar' })
      expect(base.settings).toBeInstanceOf(MockSettings)
      expect((base.settings as any).name).toBe('Test')
    })
  })

  describe('getAllVenues', () => {
    it('should filter venues by rank', () => {
      mockGetAll.mockReturnValue([
        { lockRank: 1, categories: ['GAS_STATION'] },
        { lockRank: 5, categories: ['PARKING_LOT'] },
        { lockRank: 3, categories: ['RESTAURANT'] },
      ])
      const base = new WMEBase('Test')
      const result = base.getAllVenues()
      expect(result).toHaveLength(2)
      expect(result[0].categories[0]).toBe('GAS_STATION')
      expect(result[1].categories[0]).toBe('RESTAURANT')
    })

    it('should filter venues by categories', () => {
      mockGetAll.mockReturnValue([
        { lockRank: 1, categories: ['GAS_STATION'] },
        { lockRank: 1, categories: ['PARKING_LOT'] },
        { lockRank: 1, categories: ['RESTAURANT'] },
      ])
      const base = new WMEBase('Test')
      const result = base.getAllVenues(['PARKING_LOT'])
      expect(result).toHaveLength(2)
      expect(result.every((v: any) => v.categories[0] !== 'PARKING_LOT')).toBe(true)
    })
  })

  describe('getSelectedVenues', () => {
    it('should return empty array for non-venue selection', () => {
      mockGetSelection.mockReturnValue({ objectType: 'segment', ids: [1] })
      const base = new WMEBase('Test')
      expect(base.getSelectedVenues()).toEqual([])
    })

    it('should return empty array when nothing is selected', () => {
      mockGetSelection.mockReturnValue(null)
      const base = new WMEBase('Test')
      expect(base.getSelectedVenues()).toEqual([])
    })
  })

  describe('getAllSegments', () => {
    it('should filter segments by rank', () => {
      mockGetAll.mockReturnValue([
        { lockRank: 1, roadType: 1 },
        { lockRank: 5, roadType: 2 },
        { lockRank: 2, roadType: 3 },
      ])
      const base = new WMEBase('Test')
      const result = base.getAllSegments()
      expect(result).toHaveLength(2)
    })

    it('should filter segments by road types', () => {
      mockGetAll.mockReturnValue([
        { lockRank: 1, roadType: 1 },
        { lockRank: 1, roadType: 2 },
        { lockRank: 1, roadType: 3 },
      ])
      const base = new WMEBase('Test')
      const result = base.getAllSegments([2])
      expect(result).toHaveLength(2)
      expect(result.every((s: any) => s.roadType !== 2)).toBe(true)
    })
  })

  describe('getSelectedSegments', () => {
    it('should return empty array for non-segment selection', () => {
      mockGetSelection.mockReturnValue({ objectType: 'venue', ids: [1] })
      const base = new WMEBase('Test')
      expect(base.getSelectedSegments()).toEqual([])
    })

    it('should return empty array when nothing is selected', () => {
      mockGetSelection.mockReturnValue(null)
      const base = new WMEBase('Test')
      expect(base.getSelectedSegments()).toEqual([])
    })
  })

  describe('log/group/groupEnd', () => {
    it('should call console.log with formatted message', () => {
      const spy = vi.spyOn(console, 'log').mockImplementation(() => {})
      const base = new WMEBase('Test')
      base.log('hello', 42)
      expect(spy).toHaveBeenCalledWith(
        '%cTest: %chello',
        'color: #0DAD8D; font-weight: bold',
        'color: dimgray; font-weight: normal',
        42
      )
      spy.mockRestore()
    })

    it('should call console.groupCollapsed with formatted message', () => {
      const spy = vi.spyOn(console, 'groupCollapsed').mockImplementation(() => {})
      const base = new WMEBase('Test')
      base.group('section', 'extra')
      expect(spy).toHaveBeenCalledWith(
        '%cTest: %csection',
        'color: #0DAD8D; font-weight: bold',
        'color: dimgray; font-weight: normal',
        'extra'
      )
      spy.mockRestore()
    })

    it('should call console.groupEnd', () => {
      const spy = vi.spyOn(console, 'groupEnd').mockImplementation(() => {})
      const base = new WMEBase('Test')
      base.groupEnd()
      expect(spy).toHaveBeenCalled()
      spy.mockRestore()
    })
  })

  describe('createShortcut', () => {
    it('uses the provided default keys when no settings are attached', () => {
      const base = new WMEBase('Test')
      base.createShortcut('simplify', 'Simplify', 'A+E', () => {})
      expect(mockCreateShortcut).toHaveBeenCalledWith(expect.objectContaining({
        shortcutId: 'test-simplify',
        shortcutKeys: 'A+E',
      }))
    })

    it('uses the provided default keys when settings has no saved binding', () => {
      const settings = new MockSettings('Test', {})
      const base = new WMEBase('Test', settings)
      base.createShortcut('simplify', 'Simplify', 'A+E', () => {})
      expect(mockCreateShortcut).toHaveBeenCalledWith(expect.objectContaining({
        shortcutId: 'test-simplify',
        shortcutKeys: 'A+E',
      }))
    })

    it('prefers the user-saved keys over the provided default', () => {
      const settings = new MockSettings('Test', {})
      settings.set(['shortcuts', 'test-simplify'], 'A+R')
      const base = new WMEBase('Test', settings)
      base.createShortcut('simplify', 'Simplify', 'A+E', () => {})
      expect(mockCreateShortcut).toHaveBeenCalledWith(expect.objectContaining({
        shortcutId: 'test-simplify',
        shortcutKeys: 'A+R',
      }))
    })

    it('uses null when the user has cleared the binding', () => {
      const settings = new MockSettings('Test', {})
      settings.set(['shortcuts', 'test-simplify'], null)
      const base = new WMEBase('Test', settings)
      base.createShortcut('simplify', 'Simplify', 'A+E', () => {})
      expect(mockCreateShortcut).toHaveBeenCalledWith(expect.objectContaining({
        shortcutId: 'test-simplify',
        shortcutKeys: null,
      }))
    })

    it('nulls effective keys if they are already in use', () => {
      const settings = new MockSettings('Test', {})
      settings.set(['shortcuts', 'test-simplify'], 'A+R')
      mockAreShortcutKeysInUse.mockReturnValueOnce(true)
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const base = new WMEBase('Test', settings)
      base.createShortcut('simplify', 'Simplify', 'A+E', () => {})
      expect(mockCreateShortcut).toHaveBeenCalledWith(expect.objectContaining({
        shortcutId: 'test-simplify',
        shortcutKeys: null,
      }))
      warnSpy.mockRestore()
    })

    it('always attempts deleteShortcut before createShortcut', () => {
      const base = new WMEBase('Test')
      base.createShortcut('simplify', 'Simplify', 'A+E', () => {})
      expect(mockDeleteShortcut).toHaveBeenCalledWith({ shortcutId: 'test-simplify' })
      expect(mockCreateShortcut).toHaveBeenCalled()
    })

    it('continues registration when deleteShortcut throws (first-load path)', () => {
      mockDeleteShortcut.mockImplementationOnce(() => { throw new Error('not registered') })
      const base = new WMEBase('Test')
      base.createShortcut('simplify', 'Simplify', 'A+E', () => {})
      expect(mockCreateShortcut).toHaveBeenCalledWith(expect.objectContaining({
        shortcutId: 'test-simplify',
        shortcutKeys: 'A+E',
      }))
    })

    it('converts numeric saved format "4,56" to combo "A+8" before registering', () => {
      const settings = new MockSettings('Test', {})
      settings.set(['shortcuts', 'test-simplify'], '4,56')
      const base = new WMEBase('Test', settings)
      base.createShortcut('simplify', 'Simplify', 'A+E', () => {})
      expect(mockCreateShortcut).toHaveBeenCalledWith(expect.objectContaining({
        shortcutId: 'test-simplify',
        shortcutKeys: 'A+8',
      }))
    })

    it('converts combined modifiers "3,49" to "CS+1"', () => {
      const settings = new MockSettings('Test', {})
      settings.set(['shortcuts', 'test-simplify'], '3,49')
      const base = new WMEBase('Test', settings)
      base.createShortcut('simplify', 'Simplify', null, () => {})
      expect(mockCreateShortcut).toHaveBeenCalledWith(expect.objectContaining({
        shortcutKeys: 'CS+1',
      }))
    })

    it('passes through already-combo keys unchanged', () => {
      const settings = new MockSettings('Test', {})
      settings.set(['shortcuts', 'test-simplify'], 'AC+n')
      const base = new WMEBase('Test', settings)
      base.createShortcut('simplify', 'Simplify', null, () => {})
      expect(mockCreateShortcut).toHaveBeenCalledWith(expect.objectContaining({
        shortcutKeys: 'AC+n',
      }))
    })
  })

  describe('onBeforeUnload shortcut persistence', () => {
    it('writes current SDK shortcut keys to settings before saving', () => {
      const settings = new MockSettings('Test', {})
      mockGetAllShortcuts.mockReturnValueOnce([
        { shortcutId: 'test-simplify', shortcutKeys: 'A+R', description: '', callback: () => {} },
        { shortcutId: 'test-all', shortcutKeys: 'A+Y', description: '', callback: () => {} },
      ])
      const base = new WMEBase('Test', settings)
      base.onBeforeUnload({} as any)

      expect(settings.get('shortcuts', 'test-simplify')).toBe('A+R')
      expect(settings.get('shortcuts', 'test-all')).toBe('A+Y')
      expect(mockSave).toHaveBeenCalled()
    })

    it('still saves settings if getAllShortcuts throws', () => {
      const settings = new MockSettings('Test', {})
      mockGetAllShortcuts.mockImplementationOnce(() => { throw new Error('SDK unavailable') })
      const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {})
      const base = new WMEBase('Test', settings)
      base.onBeforeUnload({} as any)
      expect(mockSave).toHaveBeenCalled()
      warnSpy.mockRestore()
    })

    it('saves only shortcuts whose id starts with this instance prefix', () => {
      const settings = new MockSettings('Test', {})
      mockGetAllShortcuts.mockReturnValueOnce([
        { shortcutId: 'test-simplify', shortcutKeys: 'A+R', description: '', callback: () => {} },
        { shortcutId: 'other-script-foo', shortcutKeys: 'C+F', description: '', callback: () => {} },
        { shortcutId: 'test-all', shortcutKeys: 'A+Y', description: '', callback: () => {} },
      ])
      const base = new WMEBase('Test', settings)
      base.onBeforeUnload({} as any)
      expect(settings.get('shortcuts', 'test-simplify')).toBe('A+R')
      expect(settings.get('shortcuts', 'test-all')).toBe('A+Y')
      expect(settings.get('shortcuts', 'other-script-foo')).toBeNull()
    })

    it('round-trips user-rebound keys across reloads', () => {
      const settings = new MockSettings('Test', {})
      const base1 = new WMEBase('Test', settings)
      base1.createShortcut('simplify', 'Simplify', 'A+E', () => {})

      // user rebinds via WME UI — SDK now reports new keys
      mockGetAllShortcuts.mockReturnValueOnce([
        { shortcutId: 'test-simplify', shortcutKeys: 'A+R', description: '', callback: () => {} },
      ])
      base1.onBeforeUnload({} as any)

      // next session: new WMEBase with same settings container
      mockCreateShortcut.mockClear()
      const base2 = new WMEBase('Test', settings)
      base2.createShortcut('simplify', 'Simplify', 'A+E', () => {})
      expect(mockCreateShortcut).toHaveBeenCalledWith(expect.objectContaining({
        shortcutKeys: 'A+R',
      }))
    })
  })
})
