export interface Option { id: number, name: string }

export const filterNull = (options: Option[]): Option[] => {
  return options.filter(e => !!e.id && !!e.name)
}

export const addToLoaded = (collection: Array<any>, array: Array<any>): void => {
  for (const e of array) { collection.push(e) }
}

export const selectedCollection =
  (collection: Array<Option>, keys: Array<number>, flag: null | boolean): Array<Option> => {
    const selected = [] as Option[]
    if (flag === null) { return selected }

    for (const key of keys) {
      selected.push(collection.find(e => e.id === key) as Option)
    }

    return selected
  }

export const preprocessAgg =
  (collection: Option[], hash: Map<number, number>): Option[] => {
    const distinct = []
    for (const c of collection) {
      const quantity = hash.get(c.id) || 0
      if (!quantity) { distinct.push(c) }

      // undefined => 1
      // number    => number + 1
      hash.set(c.id, quantity + 1)
    }

    return distinct
  }

export const serializeAgg =
  (idCollection: number[], hash: Map<number, number>): Array<number> => {
    const consumables = []
    for (const id of idCollection) {
      const quantity = hash.get(id) || 1

      for (let n = 0; n < quantity; n++) {
        consumables.push(id)
      }
    }

    return consumables
  }
