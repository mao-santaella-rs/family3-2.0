<template lang="pug">
  .fmly-wrpr(ref="wrapper")
    #line.line

    FamilyNode(
      v-if="Object.keys(familyTree).length > 0"
      :datos='familyTree'
      :personas="people"
      @centerPanZoom="centerPanZoom()"
    )
    
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
      paneoZoom: null,
      initialPanZoom: null
    }
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
      this.paneoZoom.centerOn(this.$refs.wrapper, 'x')
    },
    panZoom () {
      this.paneoZoom = createPanZoom(this.$refs.wrapper, {
        maxZoom: 1,
        minZoom: 0.1
      })
    },
    resumePanZoom () {
      this.paneoZoom.resume()
      this.paneoZoom.moveTo(
        this.initialPanZoom.x,
        this.initialPanZoom.y
      )
      this.paneoZoom.zoomAbs(
        this.initialPanZoom.x,
        this.initialPanZoom.y,
        this.initialPanZoom.scale
      )
    },
    pausePanZoom () {
      let transform = this.paneoZoom.getTransform()
      this.initialPanZoom = {
        x: transform.x,
        y: transform.y,
        scale: transform.scale
      }
      this.paneoZoom.pause()
      this.paneoZoom.moveTo(0, 0)
      this.paneoZoom.zoomAbs(0, 0, 1)
    }
  },
  mounted () {
    this.panZoom()
    this.initialPanZoom = this.paneoZoom.getTransform()
  },
  beforeDestroy () {
    this.paneoZoom.dispose()
  }
}
</script>

<style lang="sass">
</style>
