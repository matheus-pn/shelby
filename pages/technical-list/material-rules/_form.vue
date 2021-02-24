<template>
  <v-card>
    <v-card-title>Formulário de Regra</v-card-title>
    <v-form>
      <v-container>
        <v-expansion-panels
          dense
          multiple
        >
          <!-- Companies -->
          <v-expansion-panel>
            <v-expansion-panel-header>
              Filtro de Company
              <v-subheader>
                {{ form.toRule().explain('company_inclusion', 'companies') }}
              </v-subheader>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row single-line>
                <v-col md="2">
                  <v-select
                    v-model="form.companyInclusionVmodel"
                    :items="flagOptions"
                    label="Opções de filtro"
                  />
                </v-col>
                <v-col>
                  <v-autocomplete
                    v-model="form.companyVmodel"
                    :loading="form.companyLoading"
                    :items="Array.from(form.companyOptions)"
                    prepend-icon="mdi-city"
                    item-text="name"
                    item-value="id"
                    multiple
                    chips
                    small-chips
                    deletable-chips
                    clearable
                    hide-selected
                    label="Companies"
                  />
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <!-- Materials -->
          <v-expansion-panel>
            <v-expansion-panel-header>
              Filtro de Material
              <v-subheader>
                {{ form.toRule().explain('material_inclusion', 'materials') }}
              </v-subheader>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row single-line>
                <v-col md="2">
                  <v-select
                    v-model="form.materialInclusionVmodel"
                    :items="flagOptions"
                    label="Opções de filtro"
                  />
                </v-col>
                <v-col>
                  <v-autocomplete
                    v-model="form.materialVmodel"
                    :loading="form.materialLoading"
                    :items="Array.from(form.materialOptions)"
                    prepend-icon="mdi-briefcase"
                    item-text="name"
                    item-value="id"
                    multiple
                    chips
                    small-chips
                    deletable-chips
                    clearable
                    hide-selected
                    label="Materiais"
                  />
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
          <!-- Categories -->
          <v-expansion-panel>
            <v-expansion-panel-header>
              Filtro de Categoria
              <v-subheader>
                {{ form.toRule().explain('category_inclusion', 'categories') }}
              </v-subheader>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-row single-line>
                <v-col md="2">
                  <v-select
                    v-model="form.categoryInclusionVmodel"
                    :items="flagOptions"
                    label="Opções de filtro"
                  />
                </v-col>
                <v-col>
                  <v-autocomplete
                    v-model="form.categoryVmodel"
                    :loading="form.categoryLoading"
                    :items="Array.from(form.categoryOptions)"
                    prepend-icon="mdi-buffer"
                    item-text="name"
                    item-value="id"
                    chips
                    small-chips
                    deletable-chips
                    multiple
                    clearable
                    hide-selected
                    label="Categorias"
                  />
                </v-col>
              </v-row>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <v-row>
          <v-col>
            <v-card-title>Consumiveis</v-card-title>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-autocomplete
              v-model="form.consumableVmodel"
              :loading="form.consumableLoading"
              :items="Array.from(form.consumableOptions)"
              item-text="name"
              item-value="id"
              multiple
              outlined
              clearable
            />
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn
              class="mr-4"
              color="info"
              @click="submit() "
            >
              Submit
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { MaterialRuleForm, flagOptions, FormModes } from '@/services/technical-list/material_rule_form'

export default Vue.extend({
  data: () => ({
    form: new MaterialRuleForm(),
    flagOptions
  }),

  beforeMount () {
    const formParam = this.$route.params.form
    this.form.loadOptions()
    switch (true) {
      case /new/.test(formParam):
        break
      case /[1-9]\d*/.test(formParam):
        this.form.loadFrom(formParam)
        break
      default:
        this.$router.push('/technical-list/material-rules/all')
    }
  },

  methods: {
    async submit () {
      if (!confirm('Are you sure?')) { return }
      const rule = this.form.toRule()
      let res
      if (this.form.mode === FormModes.NEW) {
        res = await rule.create()
      } else {
        res = await rule.edit()
      }

      if (res) {
        this.$store.commit('addNotice', 'Atualizado com sucesso')
        this.$router.push('/technical-list/material-rules/all')
      } else {
        this.$store.commit('addError', rule.get('error'))
      }
    }
  }
})
</script>
