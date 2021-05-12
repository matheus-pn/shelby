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
              {{ $t('technicalList.orderRules.companyFilter') }}
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
import { OrderRuleForm, flagOptions } from '@/services/technical-list/order_rule_form'
import RuleFilter from '@/components/RuleFilter.vue'

export default Vue.extend({
  components: {
    RuleFilter
  },

  data: () => ({
    form: new OrderRuleForm(),
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
        this.$router.push('/technical-list/order-rules/all')
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
        this.$router.push('/technical-list/order-rules/all')
      } else {
        this.$store.commit('addError', rule.get('error'))
      }
    }
  }
})
</script>
