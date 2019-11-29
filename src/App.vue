<template lang="pug">

  #app.app
    Header
    router-view

</template>

<script>
import Header from './components/Header.vue'

export default {
  name: 'App',
  components: {
    Header
  },
  beforeCreate () {
    this.$store.dispatch('getData')
    this.$store.dispatch('sessionV')
  }
}
</script>

<style lang="sass">
@import "./styles/base-styles"

.app
  background: url("./assets/bg.png")

</style>
