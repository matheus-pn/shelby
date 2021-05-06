import axios from 'axios'
import config from '@/nuxt.config'
import { OrderRule } from '@/models/technical_list/order_rule'

export enum FormModes {
  NEW, EDIT
}

const $axios = axios.create(config.axios)

export const flagOptions = [
  { value: null, text: '-' },
  { value: true, text: 'only' },
  { value: false, text: 'except' }
]

interface Option { id: number, name: string, sku: string }

export class OrderRuleForm {
  public loading = true
  public id = null as number | null

  public rule = new OrderRule({})
  public mode = FormModes.NEW

  public companyOptions = new Set([] as Option[])
  public consumableOptions = new Set([] as Option[])

  public companyVmodel = [] as Array<number>
  public consumableVmodel = [] as Array<number>

  public companyLoading = true
  public consumableLoading = true

  public companyInclusionVmodel = null

  public ruleNameVmodel = ''
  public factoryId = null as number | null

  async loadFrom (id: string) {
    this.id = Number(id)
    this.mode = FormModes.EDIT
    const res = await $axios.get(`/api/v1/shelby/order_rules/${id}`)
    this.companyInclusionVmodel = res.data.company_inclusion

    const filteredComp = this.filterNull(res.data.companies)
    const filteredCons = this.filterNull(res.data.consumables)

    this.ruleNameVmodel = res.data.name
    this.companyVmodel = filteredComp.map(e => e.id)
    this.consumableVmodel = filteredCons.map(e => e.id)

    this.addToSet(this.companyOptions, filteredComp)
    this.addToSet(this.consumableOptions, filteredCons)
  }

  loadOptions () {
    const params = new URLSearchParams()
    params.set('factory_id', String(this.factoryId))

    const companiesRes = $axios.get(`/api/v1/shelby/companies?${params}`)
    const consumablesRes = $axios.get('/api/v1/shelby/consumables')

    companiesRes
      .then(r => this.filterNull(r.data))
      .then(o => this.addToSet(this.companyOptions, o))
      .then(_ => (this.companyLoading = false))

    consumablesRes
      .then(r => this.filterNull(r.data))
      .then(o => this.addToSet(this.consumableOptions, o))
      .then(_ => (this.consumableLoading = false))
  }

  private filterNull (options: Option[]): Option[] {
    return options.filter(e => !!e.id && !!e.name)
  }

  toRule (): OrderRule {
    this.rule.initialize({
      id: this.id,
      factory_id: this.factoryId,
      name: this.ruleNameVmodel,
      companies: this.selectedCompanies(),
      company_inclusion: this.companyFlagCheck(),
      company_ids: this.selectedCompanies().map(o => o.id),
      consumable_ids: this.consumableVmodel
    })

    return this.rule
  }

  addToSet (set: Set<any>, array: Array<any>) {
    array.forEach(e => set.add(e))
  }

  selectedCompanies (): Array<Option> {
    if (this.companyInclusionVmodel === null) { return [] }

    return this.companyVmodel.map((id) => {
      return Array.from(this.companyOptions).find(c => c.id === id) as Option
    })
  }

  companyFlagCheck (): boolean {
    return !!this.companyInclusionVmodel
  }
}
