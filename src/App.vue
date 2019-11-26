<template lang="pug">

  #app.app
    Header
    router-view
    family-tree(ref="fmlyt")
    .control-panel
      //- a(@click.prevent="stopScroll()",title="cancel scroll").btn--control
      //-   img(src="img/icons/scroll-icon.svg")
      a(@click.prevent="centerPanZoom()",title="center tree").btn--control
        img(src="./assets/icons/center-icon.svg")

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
.app
  background: url("./assets/bg.png")

.control-panel
  padding: 10px
  z-index: 100
  // background-image: url("./assets/bg.jpg")
  +position(fixed,0 0 null null)
  display: flex
  border-bottom-left-radius: 10px

</style>
