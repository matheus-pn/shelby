import axios from 'axios'
import config from '@/nuxt.config'
import { ProductRule } from '@/models/technical_list/product_rule'

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

export class ProductRuleForm {
  public loading = true
  public id = null as number | null

  public rule = new ProductRule({})
  public mode = FormModes.NEW

  public companyOptions = new Set([] as Option[])
  public taxonOptions = new Set([] as Option[])
  public productOptions = new Set([] as Option[])
  public consumableOptions = new Set([] as Option[])

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
  public factoryId = null as number | null

  async loadFrom (id: string) {
    this.id = Number(id)
    this.mode = FormModes.EDIT
    const res = await $axios.get(`/api/v1/shelby/product_rules/${id}`)
    this.companyInclusionVmodel = res.data.company_inclusion
    this.productInclusionVmodel = res.data.product_inclusion
    this.taxonInclusionVmodel = res.data.taxon_inclusion

    const filteredComp = this.filterNull(res.data.companies)
    const filteredCons = this.filterNull(res.data.consumables)
    const filteredPro = this.filterNull(res.data.products)
    const filteredTax = this.filterNull(res.data.taxons)

    this.ruleNameVmodel = res.data.name
    this.companyVmodel = filteredComp.map(e => e.id)
    this.productVmodel = filteredPro.map(e => e.id)
    this.taxonVmodel = filteredTax.map(e => e.id)
    this.consumableVmodel = filteredCons.map(e => e.id)

    this.addToSet(this.companyOptions, filteredComp)
    this.addToSet(this.productOptions, filteredPro)
    this.addToSet(this.taxonOptions, filteredTax)
    this.addToSet(this.consumableOptions, filteredCons)
  }

  loadOptions () {
    const params = new URLSearchParams()
    params.set('factory_id', String(this.factoryId))

    const productsRes = $axios.get(`/api/v1/shelby/products?${params}`)
    const companiesRes = $axios.get(`/api/v1/shelby/companies?${params}`)
    const taxonsRes = $axios.get('/api/v1/shelby/taxons')
    const consumablesRes = $axios.get('/api/v1/shelby/consumables')

    productsRes
      .then(r => this.filterNull(r.data))
      .then(o => this.addToSet(this.productOptions, o))
      .then(_ => (this.productLoading = false))

    taxonsRes
      .then(r => this.filterNull(r.data))
      .then(o => this.addToSet(this.taxonOptions, o))
      .then(_ => (this.taxonLoading = false))

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

  toRule (): ProductRule {
    this.rule.initialize({
      id: this.id,
      factory_id: this.factoryId,
      name: this.ruleNameVmodel,
      companies: this.selectedCompanies(),
      products: this.selectedProducts(),
      taxons: this.selectedTaxons(),
      company_inclusion: this.companyFlagCheck(),
      taxon_inclusion: this.taxonFlagCheck(),
      product_inclusion: this.productFlagCheck(),
      company_ids: this.selectedCompanies().map(o => o.id),
      taxon_ids: this.selectedTaxons().map(o => o.id),
      product_ids: this.selectedProducts().map(o => o.id),
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

  selectedProducts (): Array<Option> {
    if (this.productInclusionVmodel === null) { return [] }

    return this.productVmodel.map((id) => {
      return Array.from(this.productOptions).find(c => c.id === id) as Option
    })
  }

  selectedTaxons (): Array<Option> {
    if (this.taxonInclusionVmodel === null) { return [] }

    return this.taxonVmodel.map((id) => {
      return Array.from(this.taxonOptions).find(c => c.id === id) as Option
    })
  }

  companyFlagCheck (): boolean {
    return !!this.companyInclusionVmodel
  }

  productFlagCheck (): boolean {
    return !!this.productInclusionVmodel
  }

  taxonFlagCheck (): boolean {
    return !!this.taxonInclusionVmodel
  }
}
