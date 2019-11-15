<template lang="pug">
#app
  #nav
    router-link(to='/') Home
    |  | 
    router-link(to='/about') About
  router-view

</template>

<script>
export default {
  name: 'App',
  beforeCreate () {
    this.$store.dispatch('getData')
  }
}
</script>

<style lang="sass">
</style>
