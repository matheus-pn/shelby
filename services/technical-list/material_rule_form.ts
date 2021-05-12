import axios from 'axios'
import config from '@/nuxt.config'
import { MaterialRule } from '@/models/technical_list/material_rule'
import {
  Option,
  filterNull,
  addToLoaded,
  preprocessAgg,
  serializeAgg,
  selectedCollection
} from '@/services/technical-list/common'

// Constants
const $axios = axios.create(config.axios)
const rule = new MaterialRule({}) // allocated only once for less garbage

export const flagOptions = [
  { value: null, text: '-' },
  { value: true, text: 'only' },
  { value: false, text: 'except' }
]
export class MaterialRuleForm {
  // meta-data: Scope of api calls
  public factoryId = null as number | null

  // meta-data: Edit form or New form
  public id = null as number | null

  // Options for the v-autocompletes
  public companyOptions = [] as Option[]
  public categoryOptions = [] as Option[]
  public materialOptions = [] as Option[]
  public consumableOptions = [] as Option[]

  // Vmodels for the v-autocompletes
  public companyVmodel = [] as Array<number>
  public materialVmodel = [] as Array<number>
  public categoryVmodel = [] as Array<number>
  public consumableVmodel= [] as Array<number>

  // Loading flags for the v-autocompletes
  public materialLoading = true
  public companyLoading = true
  public categoryLoading = true
  public consumableLoading = true

  // Vmodels for the filter option
  public companyInclusionVmodel = null
  public materialInclusionVmodel = null
  public categoryInclusionVmodel = null

  // Name field vmodel
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

  // Set ui state based on loaded data
  public async loadFrom (id: string) {
    this.id = Number(id)

    const res = await $axios.get(`/api/v1/shelby/material_rules/${id}`)

    // Set filter flags
    this.companyInclusionVmodel = res.data.company_inclusion
    this.materialInclusionVmodel = res.data.material_inclusion
    this.categoryInclusionVmodel = res.data.category_inclusion

    const filteredComp = filterNull(res.data.companies)
    const filteredMat = filterNull(res.data.materials)
    const filteredCat = filterNull(res.data.categories)

    // preprocessCons sets the generated v-slider values
    const filteredCons = preprocessAgg(
      filterNull(res.data.consumables),
      this.consumableQuantityMap
    )

    // Set v-autocomplete selection
    this.ruleNameVmodel = res.data.name
    this.companyVmodel = filteredComp.map(e => e.id)
    this.materialVmodel = filteredMat.map(e => e.id)
    this.categoryVmodel = filteredCat.map(e => e.id)
    this.consumableVmodel = filteredCons.map(e => e.id)

    // Adds options to display on v-autocomplete
    addToLoaded(this.companyOptions, filteredComp)
    addToLoaded(this.materialOptions, filteredMat)
    addToLoaded(this.categoryOptions, filteredCat)
    addToLoaded(this.consumableOptions, filteredCons)
  }

  // Loads all options for v-autocomplete
  // Sets loading to false for each
  public loadOptions () {
    const params = new URLSearchParams()
    params.set('factory_id', String(this.factoryId))

    $axios.get(`/api/v1/shelby/materials?${params}`)
      .then(r => filterNull(r.data))
      .then(o => addToLoaded(this.materialOptions, o))
      .then(_ => (this.materialLoading = false))

    $axios.get('/api/v1/shelby/categories')
      .then(r => filterNull(r.data))
      .then(o => addToLoaded(this.categoryOptions, o))
      .then(_ => (this.categoryLoading = false))

    $axios.get(`/api/v1/shelby/companies?${params}`)
      .then(r => filterNull(r.data))
      .then(o => addToLoaded(this.companyOptions, o))
      .then(_ => (this.companyLoading = false))

    $axios.get('/api/v1/shelby/consumables')
      .then(r => filterNull(r.data))
      .then(o => addToLoaded(this.consumableOptions, o))
      .then(_ => (this.consumableLoading = false))
  }

  // MaterialRule info is filled based on user inputed flags
  public toRule (): MaterialRule {
    rule.initialize({
      id: this.id,
      factory_id: this.factoryId,
      name: this.ruleNameVmodel,
      companies: selectedCollection(
        this.companyOptions,
        this.companyVmodel,
        this.companyInclusionVmodel
      ),
      materials: selectedCollection(
        this.materialOptions,
        this.materialVmodel,
        this.materialInclusionVmodel
      ),
      categories: selectedCollection(
        this.categoryOptions,
        this.companyVmodel,
        this.companyInclusionVmodel
      ),
      // null => false, bool => bool
      company_inclusion: !!this.companyInclusionVmodel,
      category_inclusion: !!this.categoryInclusionVmodel,
      material_inclusion: !!this.materialInclusionVmodel,
      company_ids: this.companyVmodel,
      category_ids: this.categoryVmodel,
      material_ids: this.materialVmodel,
      // serializes based on user selected quantity
      consumable_ids: serializeAgg(
        this.consumableVmodel,
        this.consumableQuantityMap
      )
    })

    return rule
  }
}
