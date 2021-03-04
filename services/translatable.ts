export class Translatable {
  text: string
  translate: boolean

  constructor (t: string, tr = true) {
    this.text = t
    this.translate = tr
  }
}
