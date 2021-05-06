import axios from 'axios'
import config from '@/nuxt.config'
import Vue from 'vue'
import { Translatable } from '@/services/translatable'
import BaseModel from '../base_model'

const $axios = axios.create(config.axios)

export class OrderRule extends BaseModel {
  public collection (name: string) {
    const arr = this.get(name, []) as Array<any>
    return arr
      .filter(e => !!e.id && !!e.name)
      .map(e => ({ id: e.id, name: e.name }))
  }

  private toParams () {
    return {
      rule: {
        name: this.get('name'),
        factory_id: this.get('factory_id'),
        company_ids: this.get('company_ids', []),
        company_inclusion: this.get('company_inclusion', false)
      },
      consumable_ids: this.get('consumable_ids', [])
    }
  }

  public async create (): Promise<boolean> {
    try {
      await $axios.post('/api/v1/shelby/order_rules', this.toParams())
      return true
    } catch (error) {
      if (error.response?.data?.error) {
        this.setErr(error.response.data.error)
      } else {
        this.set('error', error.message)
      }

      return false
    }
  }

  public async edit (): Promise<boolean> {
    try {
      await $axios.patch(`/api/v1/shelby/order_rules/${this.id}`, this.toParams())
      return true
    } catch (error) {
      if (error.response?.data?.error) {
        this.setErr(error.response.data.error)
      } else {
        this.set('error', error.message)
      }

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

  private fields = {
    0: { flag: 'company_inclusion', name: 'companies' }
  }

  public explain
  (field: 0, vm: Vue): string {
    const filter = this.collection(this.fields[field].name).map(e => e.name)
    const flag = Boolean(this.get(this.fields[field].flag))
    const except = new Translatable('technicalList.except')
    const only = new Translatable('technicalList.only')
    const first = new Translatable(filter[0], false)
    const commaSep = new Translatable(filter.join(', '), false)
    const notAppliable = new Translatable('technicalList.notAppliable')
    const forAll = new Translatable('technicalList.forAll')

    let res

    switch (filter.length) {
      case 0:
        res = flag ? [notAppliable] : [forAll]
        break
      case 1:
        res = flag ? [first] : [except, first]
        break
      default:
        res = flag ? [only, commaSep] : [except, commaSep]
        break
    }

    return res.map(t => t.translate ? vm.$t(t.text) : t.text).join(' ')
  }
}
