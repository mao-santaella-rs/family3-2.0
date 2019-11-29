<template lang="pug">
  .fmly-tree(ref="tree")
    .fmly-wrpr(ref="wrapper")
      #line.line

      FamilyNode(
        v-if="Object.keys(familyTree).length > 0"
        :datos='familyTree'
        :personas="people"
        @centerPanZoom="centerPanZoom"
      )
    
    .control-panel
      a.btn--control(
        title="cancel scroll"
        @click.prevent="togglePanZoom"
      )
        img(src="../assets/icons/scroll-icon.svg")

      a.btn--control(
        @click.prevent="getCords"
        title="center tree"
      )
        img(src="../assets/icons/center-icon.svg")
      
</template>

<script>
import createPanZoom from 'panzoom'
import FamilyNode from './FamilyNode.vue'

export default {
  name: 'FamilyTree',
  components: {
    FamilyNode
  },
  data () {
    return {
      panZoom: null,
      initialPanZoom: null
    }
  },
  mounted () {
    this.panZoom = createPanZoom(this.$refs.wrapper, {
      maxZoom: 1,
      minZoom: 0.1
    })
    this.initialPanZoom = this.panZoom.getTransform()
  },
  watch: {
    storePanZoom () {
      if (this.storePanZoom) {
        this.resumePanZoom()
      } else {
        this.pausePanZoom()
      }
    }
  },
  computed: {
    familyTree () {
      return this.$store.state.familyTree
    },
    people () {
      return this.$store.state.people
    },
    storePanZoom () {
      return this.$store.state.panZoom
    }
  },
  methods: {
    centerPanZoom () {
      this.panZoom.centerOn(this.$refs.tree)
    },
    async togglePanZoom () {
      if (this.panZoom.isPaused()) {
        this.resumePanZoom()
        // this.panZoom.resume()
      } else {
        this.pausePanZoom()
        // this.panZoom.pause()
      }
    },
    getCords () {
      console.log(this.panZoom.getTransform())
    },
    pausePanZoom () {
      this.initialPanZoom = { ...this.panZoom.getTransform() }
      this.panZoom.pause()
      this.panZoom.moveTo(0, 0)
      this.panZoom.zoomAbs(0, 0, 1)
    },
    resumePanZoom () {
      this.panZoom.moveTo(
        this.initialPanZoom.x,
        this.initialPanZoom.y
      )
      this.panZoom.zoomAbs(
        this.initialPanZoom.x,
        this.initialPanZoom.y,
        this.initialPanZoom.scale
      )
      this.panZoom.resume()
    }
  },
  beforeDestroy () {
    this.panZoom.dispose()
  }
}
</script>

<style lang="sass">

.line
  position: absolute
  top: 0
  right: 0
  bottom: 0
  left: 0

  svg
    display: block
    stroke: $color-primario
    fill: none
    stroke-width: 2px

.fmly-wrpr
  display: inline-block
  position: relative
  cursor: grab
  z-index: 0
  +auto-height
  &::after
    clear: both
    content: ""
    display: block

  &:active
    cursor: grabbing

.control-panel
  padding: 10px
  z-index: 100
  +position(fixed,0 0 null null)
  display: flex
  border-bottom-left-radius: 10px

</style>
