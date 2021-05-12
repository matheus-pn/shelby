<template>
  <v-card>
    <v-card-title>{{ $t('technicalList.form') }}</v-card-title>
    <v-form>
      <v-container>
        <v-text-field v-model="form.ruleNameVmodel" :label="$t('name')" />
        <v-expansion-panels
          dense
          multiple
        >
          <!-- Companies -->
          <v-expansion-panel>
            <v-expansion-panel-header>
              {{ $t('technicalList.materialRules.companyFilter') }}
              <v-subheader>
                {{ form.toRule().explain(0, this) }}
              </v-subheader>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <rule-filter
                v-model="form"
                :rule-field="'company'"
                :flag-options="flagOptions"
              />
            </v-expansion-panel-content>
          </v-expansion-panel>
          <!-- Materials -->
          <v-expansion-panel>
            <v-expansion-panel-header>
              {{ $t('technicalList.materialRules.materialFilter') }}
              <v-subheader>
                {{ form.toRule().explain(2, this) }}
              </v-subheader>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <rule-filter
                v-model="form"
                :rule-field="'material'"
                :flag-options="flagOptions"
              />
            </v-expansion-panel-content>
          </v-expansion-panel>
          <!-- Categories -->
          <v-expansion-panel>
            <v-expansion-panel-header>
              {{ $t('technicalList.materialRules.categoryFilter') }}
              <v-subheader>
                {{ form.toRule().explain(1, this) }}
              </v-subheader>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <rule-filter
                v-model="form"
                :rule-field="'category'"
                :flag-options="flagOptions"
              />
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
        <v-row>
          <v-col>
            <v-card-title>{{ $t('consumables') }}</v-card-title>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-autocomplete
              v-model="form.consumableVmodel"
              :loading="form.consumableLoading"
              :items="form.consumableOptions"
              item-text="name"
              item-value="id"
              multiple
              outlined
              clearable
            />
            <span
              v-for="id in form.consumableVmodel"
              :key="id"
            >
              <v-slider
                :label="`${form.consumableFind(id).name}, ${$t('quantity')}:`"
                thumb-label="always"
                thumb-color="secondary"
                :value="form.consumableQuantityMap.get(id)"
                min="1"
                max="10"
                @input="form.quantityCallback(id, $event)"
              />
            </span>
          </v-col>
        </v-row>
        <v-row>
          <v-col>
            <v-btn
              class="mr-4"
              color="info"
              @click="submit() "
            >
              {{ $t('technicalList.submit') }}
            </v-btn>
          </v-col>
        </v-row>
      </v-container>
    </v-form>
  </v-card>
</template>

<script lang="ts">
import Vue from 'vue'
import { MaterialRuleForm, flagOptions } from '@/services/technical-list/material_rule_form'
import RuleFilter from '@/components/RuleFilter.vue'

export default Vue.extend({
  components: {
    RuleFilter
  },

  data: () => ({
    form: new MaterialRuleForm(),
    flagOptions
  }),

  beforeMount () {
    const formParam = this.$route.params.form
    this.form.factoryId = (this.$auth.user?.factory_id ?? 4) as number
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
      if (this.form.isNewForm()) {
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
