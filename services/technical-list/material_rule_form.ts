import axios from 'axios'
import config from '@/nuxt.config'
import { MaterialRule } from '@/models/technical_list/material_rule'

export enum FormModes {
  NEW, EDIT
}

const $axios = axios.create(config.axios)

export const flagOptions = [
  { value: null, text: '-' },
  { value: true, text: 'Only' },
  { value: false, text: 'Except' }
]

interface Option { id: number, name: string }

export class MaterialRuleForm {
  public loading = true
  public id = null as number | null

  public rule = new MaterialRule({})
  public mode = FormModes.NEW

  public companyOptions = new Set([] as Option[])
  public categoryOptions = new Set([] as Option[])
  public materialOptions = new Set([] as Option[])
  public consumableOptions = new Set([] as Option[])

  public companyVmodel = [] as Array<number>
  public materialVmodel = [] as Array<number>
  public categoryVmodel = [] as Array<number>
  public consumableVmodel = [] as Array<number>

  public materialLoading = true
  public companyLoading = true
  public categoryLoading = true
  public consumableLoading = true

  public companyInclusionVmodel = null
  public materialInclusionVmodel = null
  public categoryInclusionVmodel = null

  async loadFrom (id: string) {
    this.id = Number(id)
    this.mode = FormModes.EDIT
    const res = await $axios.get(`/api/v1/shelby/material_rules/${id}`)
    this.companyInclusionVmodel = res.data.company_inclusion
    this.materialInclusionVmodel = res.data.material_inclusion
    this.categoryInclusionVmodel = res.data.category_inclusion

    const filteredComp = this.filterNull(res.data.companies)
    const filteredCons = this.filterNull(res.data.consumables)
    const filteredMat = this.filterNull(res.data.materials)
    const filteredCat = this.filterNull(res.data.categories)

    this.companyVmodel = filteredComp.map(e => e.id)
    this.materialVmodel = filteredMat.map(e => e.id)
    this.categoryVmodel = filteredCat.map(e => e.id)
    this.consumableVmodel = filteredCons.map(e => e.id)

    this.addToSet(this.companyOptions, filteredComp)
    this.addToSet(this.materialOptions, filteredMat)
    this.addToSet(this.categoryOptions, filteredCat)
    this.addToSet(this.consumableOptions, filteredCons)
  }

  loadOptions (factoryId: number) {
    const params = new URLSearchParams()
    params.set('factory_id', String(factoryId))

    const materialsRes = $axios.get(`/api/v1/shelby/materials?${params}`)
    const companiesRes = $axios.get(`/api/v1/shelby/companies?${params}`)
    const categoriesRes = $axios.get('/api/v1/shelby/categories')
    const consumablesRes = $axios.get('/api/v1/shelby/consumables')

    materialsRes
      .then(r => this.filterNull(r.data))
      .then(o => this.addToSet(this.materialOptions, o))
      .then(_ => (this.materialLoading = false))

    categoriesRes
      .then(r => this.filterNull(r.data))
      .then(o => this.addToSet(this.categoryOptions, o))
      .then(_ => (this.categoryLoading = false))

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

  toRule (): MaterialRule {
    this.rule.initialize({
      id: this.id,
      companies: this.selectedCompanies(),
      materials: this.selectedMaterials(),
      categories: this.selectedCategories(),
      company_inclusion: this.companyFlagCheck(),
      category_inclusion: this.categoryFlagCheck(),
      material_inclusion: this.materialFlagCheck(),
      company_ids: this.selectedCompanies().map(o => o.id),
      category_ids: this.selectedCategories().map(o => o.id),
      material_ids: this.selectedMaterials().map(o => o.id),
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

  selectedMaterials (): Array<Option> {
    if (this.materialInclusionVmodel === null) { return [] }

    return this.materialVmodel.map((id) => {
      return Array.from(this.materialOptions).find(c => c.id === id) as Option
    })
  }

  selectedCategories (): Array<Option> {
    if (this.categoryInclusionVmodel === null) { return [] }

    return this.categoryVmodel.map((id) => {
      return Array.from(this.categoryOptions).find(c => c.id === id) as Option
    })
  }

  companyFlagCheck (): boolean {
    return !!this.companyInclusionVmodel
  }

  materialFlagCheck (): boolean {
    return !!this.materialInclusionVmodel
  }

  categoryFlagCheck (): boolean {
    return !!this.categoryInclusionVmodel
  }
}
