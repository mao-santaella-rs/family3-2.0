<template lang="pug">

  #app.app
    header
    router-view
    family-tree(ref="fmlyt")
    .control-panel
      //- a(@click.prevent="stopScroll()",title="cancel scroll").btn--control
      //-   img(src="img/icons/scroll-icon.svg")
      a(@click.prevent="centerPanZoom()",title="center tree").btn--control
        img(src="img/icons/center-icon.svg")

</template>

<script>
import Header from './components/Header.vue'
import FamilyTree from './components/FamilyTree.vue'

export default {
  name: 'App',
  components: {
    FamilyTree,
    Header
  },
  methods: {
    centerPanZoom () {
      this.$refs.fmlyt.centerPanZoom()
    },
    stopScroll () {
      this.$refs.fmlyt.stopScroll()
    }
  },
  computed: {
  },
  created () {
    this.$store.dispatch('getData')
    this.$store.dispatch('sessionV')
  },
  mounted () {}
}
</script>

<style lang="sass">
@import "./styles/main.sass"
html
  background: url("./assets/bg.png")
</style>
