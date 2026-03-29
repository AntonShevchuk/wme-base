declare function getWmeSdk(options: { scriptId: string, scriptName: string }): any

declare class Settings {
  constructor(name: string, defaults: any)
  container: any
  get(...keys: string[]): any
  set(path: any[], value: any): void
  save(): void
}
