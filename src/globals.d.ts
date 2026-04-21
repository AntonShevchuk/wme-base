/// <reference types="wme-sdk-typings" />

declare function getWmeSdk(options: { scriptId: string, scriptName: string }): any

declare class Settings {
  constructor(name: string, defaults: any)
  container: any
  get(...keys: string[]): any
  set(path: any[], value: any): void
  has(...keys: string[]): boolean
  save(): void
}

declare class WMEUIHelper {
  constructor(uid: string)
  uid: string
  index: number

  generateId(): string
  createPanel(title: string, attributes?: any): any
  createTab(title: string, attributes?: any): any
  createModal(title: string, attributes?: any): any
  createFieldset(title: string, attributes?: any): any
}
