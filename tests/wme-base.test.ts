import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock globals before importing
const mockSave = vi.fn()
const mockGetAll = vi.fn()
const mockGetById = vi.fn()
const mockGetSelection = vi.fn()
const mockGetUserInfo = vi.fn(() => ({ rank: 3 }))
const mockGetAddress = vi.fn()

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
}

// Mock jQuery
const mockOn = vi.fn().mockReturnThis()
const mockJQuery: any = vi.fn(() => ({ on: mockOn }))

// @ts-ignore
globalThis.jQuery = mockJQuery
// @ts-ignore
globalThis.getWmeSdk = vi.fn(() => mockWmeSDK)

// Mock Settings class
class MockSettings {
  name: string
  defaults: any
  container: any
  constructor(name: string, defaults: any) {
    this.name = name
    this.defaults = defaults
    this.container = {}
  }
  get(...keys: string[]) { return null }
  set(path: any[], value: any) {}
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

    it('should handle settings = null', () => {
      const base = new WMEBase('Test')
      expect(base.settings).toBeNull()
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
})
