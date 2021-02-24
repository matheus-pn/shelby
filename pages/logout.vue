<template>
  <div />
</template>

<script>
export default {
  beforeMount () {
    this.$auth.logout()
  }
}
</script>
