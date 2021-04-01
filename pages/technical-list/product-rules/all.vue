<template>
  <v-card>
    <v-card-title>
      {{ $t('technicalList.productRules.title') }}
      <v-spacer />
      <v-text-field
        v-model="search"
        append-icon="mdi-magnify"
        label="Search"
        single-line
        hide-details
      />
      <v-spacer />
      <v-btn
        color="primary"
        to="/technical-list/product-rules/new"
        small
        rounded
        dark
        outlined
      >
        {{ $t('technicalList.new') }}
        <v-icon dark dense>
          mdi-plus
        </v-icon>
      </v-btn>
    </v-card-title>
    <v-data-table
      :headers="headers.map(h => ({ text: $t(h.text), value: h.value }))"
      :items="items"
      :loading="items === undefined"
      class="elevation-1"
      page.sync="params.page"
      :search="search"
    >
      <template #item.actions="{ item }">
        <v-row>
          <nuxt-link
            :to="`/technical-list/product-rules/${item.id}`"
            style="text-decoration: none;"
          >
            <v-icon
              small
              class="mr-2"
            >
              mdi-pencil
            </v-icon>
          </nuxt-link>
          <div
            style="cursor: pointer;"
            @click="deleteItem(item)"
          >
            <v-icon
              small
              class="mr-2"
            >
              mdi-delete
            </v-icon>
          </div>
        </v-row>
      </template>
    </v-data-table>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { ProductRule } from '@/models/technical_list/product_rule'

const headers = [
  { text: 'technicalList.id', value: 'id' },
  { text: 'name', value: 'name' },
  { text: 'technicalList.productRules.productFilter', value: 'products' },
  { text: 'technicalList.productRules.taxonFilter', value: 'taxons' },
  { text: 'technicalList.productRules.companyFilter', value: 'companies' },
  { text: 'technicalList.createdAt', value: 'created_at' },
  { text: 'technicalList.actions', value: 'actions', sortable: false }
]

const params = { page: 1, per: 25 }

const defaultData = {
  search: '',
  params,
  headers,
  items: undefined as any[] | undefined
}

export default Vue.extend({
  data: () => (defaultData),

  mounted (): void {
    this.setParams()
    this.load()
  },

  methods: {

    load () {
      this.fetchRules()
        .then(this.setItems)
    },

    setParams (): void {
      this.params.page = Number(this.$nuxt.$route.query?.page ?? this.params.page)
      this.params.per = Number(this.$nuxt.$route.query?.per ?? this.params.per)
    },

    deleteItem (item: any) {
      if (!confirm('Are you sure')) { return }

      this.$axios.delete(`/api/v1/shelby/product_rules/${item.id}`)
        .then(_ => (this.load()))
    },

    fetchRules (): Promise<ProductRule[]> {
      const params = new URLSearchParams()
      params.set('page', '1')
      params.set('per', '10000')
      params.set('factory_id', String(this.$auth.user?.factory_id ?? 4))
      return this.$axios
        .get(`/api/v1/shelby/product_rules?${params}`)
        .then(r => r.data.map((e: any) => {
          return new ProductRule(e.rule)
        }))
    },

    setItems (rules: ProductRule[]): void {
      this.items = rules.map((rule) => {
        let s
        const limit = 70
        return {
          id: rule.id,
          name: rule.get('name'),
          materials: (s = rule.explain(2, this)).length > limit ? s.slice(0, limit) + '...' : s,
          companies: (s = rule.explain(0, this)).length > limit ? s.slice(0, limit) + '...' : s,
          categories: (s = rule.explain(1, this)).length > limit ? s.slice(0, limit) + '...' : s,
          created_at: rule.createdAt.toLocaleString('pt-Br').slice(0, 10)
        }
      })
    }
  }

})
</script>
