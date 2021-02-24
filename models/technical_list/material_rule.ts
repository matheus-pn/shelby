import axios from 'axios'
import config from '@/nuxt.config'
import BaseModel from '../base_model'

const $axios = axios.create(config.axios)

export class MaterialRule extends BaseModel {
  public collection (name: string) {
    const arr = this.get(name, []) as Array<any>
    return arr
      .filter(e => !!e.id && !!e.name)
      .map(e => ({ id: e.id, name: e.name }))
  }

  private toParams () {
    return {
      rule: {
        company_ids: this.get('company_ids', []),
        material_ids: this.get('material_ids', []),
        category_ids: this.get('material_ids', []),
        company_inclusion: this.get('company_inclusion', false),
        material_inclusion: this.get('material_inclusion', false),
        category_inclusion: this.get('category_inclusion', false)
      },
      consumable_ids: this.get('consumable_ids', [])
    }
  }

  public async create (): Promise<boolean> {
    try {
      await $axios.post('/api/v1/shelby/material_rules', this.toParams())
      return true
    } catch (error) {
      this.setErr(error.response.data.error)
      return false
    }
  }

  public async edit (): Promise<boolean> {
    try {
      await $axios.patch(`/api/v1/shelby/material_rules/${this.id}`, this.toParams())
      return true
    } catch (error) {
      this.setErr(error.response.data.error)
      return false
    }
  }

  private setErr (msg: string) {
    msg = msg.replace('param is missing or the value is empty', 'Não pode ficar vazio')
    msg = msg.replace('consumable_ids', 'Consumíveis')
    this.set('error', msg)
  }

  public get id (): Number {
    return Number(this.get('id'))
  }

  public get createdAt (): Date {
    return new Date(this.get('created_at'))
  }

  public explain
  (flagName: string, plural: string): string {
    const filter = this.collection(plural).map(e => e.name)
    const flag = Boolean(this.get(flagName))
    const except = 'Se aplica a todos exceto: '
    const only = 'Se aplica somente a: '
    const first = filter[0]

    switch (filter.length) {
      case 0:
        return flag ? 'Não se aplica à nenhum' : 'Se aplica a todos'
      case 1:
        return flag ? first : except + first
      default:
        return flag ? only + filter.join(', ') : except + filter.join(', ')
    }
  }
}
