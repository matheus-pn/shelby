export default class BaseModel {
  private innerRecord: any

  constructor (record: any) {
    this.innerRecord = record
    this.initialize(record)
  }

  public initialize (record: any) {
    Object
      .keys(record).forEach((k) => {
        this.set(k, record[k] ?? null)
      })
  }

  public get (prop: string, def = null as any): any {
    return this.innerRecord[prop] ?? def
  }

  public set (prop: string, val: any) : void {
    this.innerRecord[prop] = val
  }

  public get vmodel (): any { return this.innerRecord }
  public set vmodel (value: any) { this.innerRecord = value }
}
