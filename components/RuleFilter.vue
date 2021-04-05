
<template>
  <v-row single-line>
    <v-col md="2">
      <v-select
        v-model="/* eslint-disable vue/no-mutating-props */ value[`${ruleField}InclusionVmodel`]"
        :items="translatedFlagOptions()"
        label="Opções de filtro"
      />
    </v-col>
    <v-col>
      <v-autocomplete
        v-model="/* eslint-disable vue/no-mutating-props */ value[`${ruleField}Vmodel`]"
        :loading="value[`${ruleField}Loading`]"
        :items="Array.from(value[`${ruleField}Options`]).sort((v1, v2) => (v1.name.localeCompare(v2.name)))"
        :disabled="value[`${ruleField}InclusionVmodel`] === null"
        prepend-icon="mdi-city"
        item-text="name"
        item-value="id"
        multiple
        chips
        small-chips
        deletable-chips
        clearable
        hide-selected
      />
    </v-col>
  </v-row>
</template>

<script lang="ts">

import Vue from 'vue'
export default Vue.extend({
  props: {
    value: {
      type: Object,
      required: true
    },
    ruleField: {
      type: String,
      required: true
    },
    flagOptions: {
      type: Array,
      required: true
    }
  },

  watch: {
    form () {
      this.$emit('input', this.value)
    }
  },

  methods: {
    translatedFlagOptions () {
      return this.flagOptions.map((o: any) => {
        return { value: o.value, text: this.$t(o.text) }
      })
    }
  }
})
</script>
