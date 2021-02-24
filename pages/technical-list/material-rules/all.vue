<template>
  <v-card>
    <v-card-title>
      Regras de Material
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
        to="/technical-list/material-rules/new"
        small
        rounded
        dark
        outlined
      >
        New Rule
        <v-icon dark dense>
          mdi-plus
        </v-icon>
      </v-btn>
    </v-card-title>
    <v-data-table
      :headers="headers"
      :items="items"
      :loading="items === undefined"
      class="elevation-1"
      :page.sync="params.page"
      :items-per-page.sync="params.per"
      :search="search"
    >
      <template #item.actions="{ item }">
        <v-row>
          <nuxt-link
            :to="`/technical-list/material-rules/${item.id}`"
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
import { MaterialRule } from '@/models/technical_list/material_rule'

const headers = [
  { text: 'Number', value: 'id' },
  { text: 'Materials', value: 'materials' },
  { text: 'Categories', value: 'categories' },
  { text: 'Companies', value: 'companies' },
  { text: 'Registro', value: 'created_at' },
  { text: 'Actions', value: 'actions', sortable: false }
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

      this.$axios.delete(`/api/v1/shelby/material_rules/${item.id}`)
        .then(_ => (this.load()))
    },

    fetchRules (): Promise<MaterialRule[]> {
      const params = new URLSearchParams()
      params.set('page', '1')
      params.set('per', '10000')
      return this.$axios
        .get(`http://localhost:8081/api/v1/shelby/material_rules?${params.toString()}`)
        .then(r => r.data.map((e: any) => {
          return new MaterialRule(e.rule)
        }))
    },

    setItems (rules: MaterialRule[]): void {
      this.items = rules.map((rule) => {
        return {
          id: rule.id,
          materials: rule.explain('material_inclusion', 'materials'),
          companies: rule.explain('company_inclusion', 'companies'),
          categories: rule.explain('category_inclusion', 'categories'),
          created_at: rule.createdAt.toLocaleString('pt-Br').slice(0, 10)
        }
      })
    }
  }

})
</script>
