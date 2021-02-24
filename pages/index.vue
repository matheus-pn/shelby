<template>
  <v-row justify="center" align="center" />
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({
  beforeMount () {
    this.$router.push('/technical-list/material-rules/all')
  }
})
</script>
