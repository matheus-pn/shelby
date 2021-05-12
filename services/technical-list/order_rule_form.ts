import axios from 'axios'
import config from '@/nuxt.config'
import { OrderRule } from '@/models/technical_list/order_rule'
import {
  Option,
  filterNull,
  addToLoaded,
  preprocessAgg,
  serializeAgg,
  selectedCollection
} from '@/services/technical-list/common'

const $axios = axios.create(config.axios)
const rule = new OrderRule({})

export const flagOptions = [
  { value: null, text: '-' },
  { value: true, text: 'only' },
  { value: false, text: 'except' }
]

export class OrderRuleForm {
  public id = null as number | null

  public companyOptions = [] as Option[]
  public consumableOptions = [] as Option[]

  public companyVmodel = [] as Array<number>
  public consumableVmodel = [] as Array<number>

  public companyLoading = true
  public consumableLoading = true

  public companyInclusionVmodel = null

  public ruleNameVmodel = ''
  public factoryId = null as number | null

  // Value for each v-slider, that is generated dinamically
  public consumableQuantityMap = new Map<number, number>()

  public isNewForm (): boolean { return this.id === null }

  public consumableFind (id: number): Option | undefined {
    return this.consumableOptions.find(e => e.id === id)
  }

  public quantityCallback (id: number, quantity: number) {
    this.consumableQuantityMap.set(id, quantity)
  }

  public async loadFrom (id: string) {
    this.id = Number(id)
    const res = await $axios.get(`/api/v1/shelby/order_rules/${id}`)
    this.companyInclusionVmodel = res.data.company_inclusion

    const filteredComp = filterNull(res.data.companies)
    const filteredCons = preprocessAgg(
      filterNull(res.data.consumables),
      this.consumableQuantityMap
    )

    this.ruleNameVmodel = res.data.name
    this.companyVmodel = filteredComp.map(e => e.id)
    this.consumableVmodel = filteredCons.map(e => e.id)

    addToLoaded(this.companyOptions, filteredComp)
    addToLoaded(this.consumableOptions, filteredCons)
  }

  loadOptions () {
    const params = new URLSearchParams()
    params.set('factory_id', String(this.factoryId))

    $axios.get(`/api/v1/shelby/companies?${params}`)
      .then(r => filterNull(r.data))
      .then(o => addToLoaded(this.companyOptions, o))
      .then(_ => (this.companyLoading = false))

    $axios.get('/api/v1/shelby/consumables')
      .then(r => filterNull(r.data))
      .then(o => addToLoaded(this.consumableOptions, o))
      .then(_ => (this.consumableLoading = false))
  }

  toRule (): OrderRule {
    rule.initialize({
      id: this.id,
      factory_id: this.factoryId,
      name: this.ruleNameVmodel,
      companies: selectedCollection(
        this.companyOptions,
        this.companyVmodel,
        this.companyInclusionVmodel
      ),
      company_inclusion: !!this.companyInclusionVmodel,
      company_ids: this.companyVmodel,
      consumable_ids: serializeAgg(
        this.consumableVmodel,
        this.consumableQuantityMap
      )
    })

    return rule
  }
}
