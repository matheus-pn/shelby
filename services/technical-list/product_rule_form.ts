import axios from 'axios'
import config from '@/nuxt.config'
import { ProductRule } from '@/models/technical_list/product_rule'
import {
  Option,
  filterNull,
  addToLoaded,
  preprocessAgg,
  serializeAgg,
  selectedCollection
} from '@/services/technical-list/common'

const $axios = axios.create(config.axios)
const rule = new ProductRule({})

export const flagOptions = [
  { value: null, text: '-' },
  { value: true, text: 'only' },
  { value: false, text: 'except' }
]

export class ProductRuleForm {
  public factoryId = null as number | null

  public id = null as number | null

  public companyOptions = [] as Option[]
  public taxonOptions = [] as Option[]
  public productOptions = [] as Option[]
  public consumableOptions = [] as Option[]

  public companyVmodel = [] as Array<number>
  public productVmodel = [] as Array<number>
  public taxonVmodel = [] as Array<number>
  public consumableVmodel = [] as Array<number>

  public productLoading = true
  public companyLoading = true
  public taxonLoading = true
  public consumableLoading = true

  public companyInclusionVmodel = null
  public productInclusionVmodel = null
  public taxonInclusionVmodel = null

  public ruleNameVmodel = ''

  // Value for each v-slider, that is generated dinamically
  public consumableQuantityMap = new Map<number, number>()

  public isNewForm (): boolean { return this.id === null }

  public consumableFind (id: number): Option | undefined {
    return this.consumableOptions.find(e => e.id === id)
  }

  public quantityCallback (id: number, quantity: number) {
    this.consumableQuantityMap.set(id, quantity)
  }

  async loadFrom (id: string) {
    this.id = Number(id)
    const res = await $axios.get(`/api/v1/shelby/product_rules/${id}`)
    this.companyInclusionVmodel = res.data.company_inclusion
    this.productInclusionVmodel = res.data.product_inclusion
    this.taxonInclusionVmodel = res.data.taxon_inclusion

    const filteredComp = filterNull(res.data.companies)
    const filteredPro = filterNull(res.data.products)
    const filteredTax = filterNull(res.data.taxons)
    const filteredCons = preprocessAgg(
      filterNull(res.data.consumables),
      this.consumableQuantityMap
    )
    this.ruleNameVmodel = res.data.name
    this.companyVmodel = filteredComp.map(e => e.id)
    this.productVmodel = filteredPro.map(e => e.id)
    this.taxonVmodel = filteredTax.map(e => e.id)
    this.consumableVmodel = filteredCons.map(e => e.id)

    addToLoaded(this.companyOptions, filteredComp)
    addToLoaded(this.productOptions, filteredPro)
    addToLoaded(this.taxonOptions, filteredTax)
    addToLoaded(this.consumableOptions, filteredCons)
  }

  loadOptions () {
    const params = new URLSearchParams()
    params.set('factory_id', String(this.factoryId))

    $axios.get(`/api/v1/shelby/products?${params}`)
      .then(r => filterNull(r.data))
      .then(o => addToLoaded(this.productOptions, o))
      .then(_ => (this.productLoading = false))

    $axios.get('/api/v1/shelby/taxons')
      .then(r => filterNull(r.data))
      .then(o => addToLoaded(this.taxonOptions, o))
      .then(_ => (this.taxonLoading = false))

    $axios.get(`/api/v1/shelby/companies?${params}`)
      .then(r => filterNull(r.data))
      .then(o => addToLoaded(this.companyOptions, o))
      .then(_ => (this.companyLoading = false))

    $axios.get('/api/v1/shelby/consumables')
      .then(r => filterNull(r.data))
      .then(o => addToLoaded(this.consumableOptions, o))
      .then(_ => (this.consumableLoading = false))
  }

  toRule (): ProductRule {
    rule.initialize({
      id: this.id,
      factory_id: this.factoryId,
      name: this.ruleNameVmodel,
      companies: selectedCollection(
        this.companyOptions,
        this.companyVmodel,
        this.companyInclusionVmodel
      ),
      products: selectedCollection(
        this.productOptions,
        this.productVmodel,
        this.productInclusionVmodel
      ),
      taxons: selectedCollection(
        this.taxonOptions,
        this.taxonVmodel,
        this.taxonInclusionVmodel
      ),
      company_inclusion: !!this.companyVmodel,
      taxon_inclusion: !!this.taxonInclusionVmodel,
      product_inclusion: !!this.productInclusionVmodel,
      company_ids: this.companyVmodel,
      taxon_ids: this.taxonVmodel,
      product_ids: this.productVmodel,
      consumable_ids: serializeAgg(
        this.consumableVmodel,
        this.consumableQuantityMap
      )
    })

    return rule
  }
}
