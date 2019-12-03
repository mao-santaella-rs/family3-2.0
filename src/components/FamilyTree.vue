<template lang="pug">
  .fmly-tree(ref="tree")
    .fmly-wrpr(ref="wrapper")
      #line.line

      FamilyNode(
        v-if="Object.keys(familyTree).length > 0"
        :family-obj='familyTree'
        :people="people"
        :login="login"
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
      initialPanZoom: null,
      peopleCount: 0
    }
  },
  mounted () {
    this.panZoom = createPanZoom(this.$refs.wrapper, {
      maxZoom: 1,
      minZoom: 0.1
    })
    this.initialPanZoom = this.panZoom.getTransform()
    this.$root.$on('person-rendered', this.personRendered)
    this.$root.$on('make-lines', this.makeLines)
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
    },
    lines () {
      return this.$store.state.lines
    },
    login () {
      return this.$store.state.session.login
    }
  },
  methods: {
    personRendered () {
      this.peopleCount++    
      if (this.peopleCount === Object.keys(this.people).length) {
        this.makeLines()
      }
    },
    makeLines () {
      const svgId = 'linea-1'
      // old line
      const $oldLine = document.getElementById(svgId)

      // if there's a old line remove
      if ($oldLine) $oldLine.remove()

      // line object
      const $line = document.getElementById('line')

      const svgWidth = $line.offsetWidth
      const svgHeight = $line.offsetHeight

      // creacion de svg
      const $svg = fnCreateSvg($line, svgId, svgWidth, svgHeight)

      // loop in $store.lines
      for (const key in this.lines) {
        // if $store.lines[key] has data
        if (this.lines[key]) {            
          const $lineCords = $line.getBoundingClientRect()
          // person object and cords
          const $person = document.querySelector(`.a${key}`)
          const $personCords = $person.getBoundingClientRect()

          // parent of person object and cords
          const $parent = document.querySelector(`.${this.lines[key]}`)
          const $parentCords = $parent.getBoundingClientRect()

          // create line between person and parent
          createPolyLine($svg, $parentCords.x - $lineCords.x + ($parentCords.width / 2), $parentCords.bottom - $lineCords.y - 10, $personCords.x - $lineCords.x + ($personCords.width / 2), $personCords.y - $lineCords.y + 10)
        }
      }

      // CREAR SVG EN EL DOM
      function fnCreateSvg (csctnr, csid, cswidth, csheight) {
        const NS = 'http://www.w3.org/2000/svg'
        const svg = document.createElementNS(NS, 'svg')

        svg.setAttribute('id', csid)
        svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink')
        svg.setAttribute('viewBox', `0 0 ${cswidth} ${csheight}`)
        
        csctnr.appendChild(svg)
        return svg
      }

      // CREAR POLYLINEA DENTRO DEL SVG
      function createPolyLine (clctnr, clx1, cly1, clx2, cly2) {
        const NS = 'http://www.w3.org/2000/svg'
        const line = document.createElementNS(NS, 'polyline')
        const hWay = cly2 - 35
        const cords = `${clx1},${cly1} ${clx1},${hWay} ${clx2},${hWay} ${clx2},${cly2}`
        line.setAttribute('points', cords)
        clctnr.appendChild(line)
      }
    },
    centerPanZoom () {
      this.panZoom.centerOn(this.$refs.tree)
    },
    togglePanZoom () {
      if (this.panZoom.isPaused()) {
        this.resumePanZoom()
      } else {
        this.pausePanZoom()
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
