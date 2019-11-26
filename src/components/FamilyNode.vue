<template lang="pug">
  .fmly-row
    .fmly(
      v-if='datos'
      v-for='family in datos'
    )
      .couple
        .ref(:class="parentsFlag(family.couple)")
        .person(
          v-for='(person,index) in family.couple'
          :key='person+index'
          :class="'a' + person"
        )
          .person-item
            .person-item__img(
              :style="{'background-image': 'url('+personas[person].img+')'}"
            )
              router-link.person-item__edit(
                :to="{name: 'edit' , params: { id: person }}"
              )
            .person-item__info
              .person-item__info__name
                span {{personas[person].name}}
              .person-item__info__others
                span.person-item__info__nickname {{personas[person].nickname}}
                span.person-item__info__year(
                  v-if="personas[person].dates.birth"
                ) {{dateTransform(personas[person].dates.birth.seconds)}}
            .person-item__action
              router-link(:to="{name:'add'}").person-item__add

      vfamilynode(
        v-if='family.relatives'
        :datos='family.relatives'
        :personas="personas"
      )

</template>

<script>
export default {
  name: 'vfamilynode',
  props: ['datos', 'personas'],
  methods: {
    parentsFlag (couple) {
      if (couple.length > 1) {
        let cl1 = 'a'
        let cl2 = 'a'
        for (let i = 0; i < couple.length; i++) {
          cl1 = cl1 + couple[i]
        }
        for (let i = couple.length - 1; i >= 0; i--) {
          cl2 = cl2 + couple[i]
        }
        return cl1 + ' ' + cl2
      } else {
        return null
      }
    },
    dateTransform (timestamp) {
      var a = new Date(0)
      a.setUTCSeconds(timestamp)
      var months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic']
      var year = a.getUTCFullYear()
      var month = months[a.getUTCMonth()]
      var date = a.getUTCDate()
      var time = date + ' ' + month + ' ' + year 
      return time
    },
    makeLines () {
      const svgId = 'linea-1'

      // cual es el row <
      const lowestRow = this.personas[Object.keys(this.personas)[0]].row

      // este es el current Row
      let currentPerson = this.datos[Object.keys(this.datos)[0]].couple[0]
      let currentRow = this.personas[currentPerson].row

      // esto es porque el ultimo componente en terminar es el primero
      if (currentRow === lowestRow) {
        // SCROLLING LEFT START
        const fmlyWrapper = document.querySelector('#app')
        let fmlyWrapperBcr = fmlyWrapper.getBoundingClientRect()

        const $fmlyRow = document.querySelector('.fmly-row')
        let $familyRowBcr = $fmlyRow.getBoundingClientRect()
        
        fmlyWrapper.scrollLeft += ($familyRowBcr.width / 2) - (fmlyWrapperBcr.width / 2)
        // SCROLLING LEFT END

        // old line
        let $oldLine = document.getElementById(svgId)

        // if there's a old line remove
        if ($oldLine) $oldLine.remove()

        // line object
        const $line = document.getElementById('line')

        let svgWidth = $line.offsetWidth
        let svgHeight = $line.offsetHeight

        // creacion de svg
        let $svg = fnCreateSvg($line, svgId, svgWidth, svgHeight)

        // loop in $store.lines
        for (let key in this.lines) {
          // if $store.lines[key] has data
          if (this.lines[key]) {
            const $lineCords = $line.getBoundingClientRect()
            // person object and cords
            const $person = document.querySelector('.' + 'a' + key)
            const $personCords = $person.getBoundingClientRect()
            
            // parent of person object and cords
            const $parent = document.querySelector('.' + this.lines[key])
            const $parentCords = $parent.getBoundingClientRect()

            // create line between person and parent
            createPolyLine($svg, $parentCords.x - $lineCords.x + ($parentCords.width / 2), $parentCords.bottom - $lineCords.y - 10, $personCords.x - $lineCords.x + ($personCords.width / 2), $personCords.y - $lineCords.y + 10)
          }
        }
      }

      // CREAR SVG EN EL DOM
      function fnCreateSvg (csctnr, csid, cswidth, csheight) {
        var NS = 'http://www.w3.org/2000/svg'
        var svg = document.createElementNS(NS, 'svg')

        svg.setAttribute('id', csid)
        svg.setAttribute('xmlns:xlink', 'http://www.w3.org/1999/xlink')
        svg.setAttribute('viewBox', '0 0 ' + cswidth + ' ' + csheight)
        
        csctnr.appendChild(svg)
        return svg
      }

      // CREAR POLYLINEA DENTRO DEL SVG
      function createPolyLine (clctnr, clx1, cly1, clx2, cly2) {
        var NS = 'http://www.w3.org/2000/svg'
        var line = document.createElementNS(NS, 'polyline')

        var hWay = cly2 - 35 

        var cords = clx1 + ',' + cly1 + ' ' + clx1 + ',' + hWay + ' ' + clx2 + ',' + hWay + ' ' + clx2 + ',' + cly2

        line.setAttribute('points', cords)
        
        clctnr.appendChild(line)
      }
    }
  },
  computed: {
    lines () {
      return this.$store.state.lines
    }
  },
  created () {},
  mounted () {
    this.$nextTick(function () {
      this.makeLines()
    })
  },
  updated () {
    this.makeLines()
  }
}

</script>

<style lang="sass">

.fmly
  display: flex
  flex-wrap: wrap
  flex-direction: column
  align-items: center

.fmly-row
  width: 100%
  display: flex
  justify-content: center
  flex-wrap: nowrap
  padding-top: 50px
  &::after
    clear: both
    content: ""
    display: block

.couple
  display: flex
  position: relative
  &:before
    content: ""
    display: block
    height: 2px
    width: 100px
    background-color: $color-primario
    position: absolute
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)
  .ref
    height: 20px
    width: 20px
    border-radius: 50%
    background-color: $color-primario
    position: absolute
    top: 50%
    left: 50%
    transform: translate(-50%, -50%)

.person
  position: relative
  display: flex
  margin: 0 25px

.person-item
  width: 170px
  min-width: 120px
  background-color: $white
  box-shadow: 5px 5px 10px 0px rgba(0, 0, 0, 0.15)
  border-radius: 10px
  overflow: hidden

  &:hover
    .person-item__action,.person-item__edit
      opacity: 1
      pointer-events: auto
      
.person-item__img
  min-height: 130px
  background-position: center
  background-size: cover
  position: relative

.person-item__info
  padding: 10px
  font-size: 0.9rem
  line-height: 1.1em

.person-item__info__name
  min-height: 2em
  line-height: 1em
  text-transform: uppercase
  font-weight: $base-bold-font-weight
  margin-bottom: 3px

.person-item__info__others
  display: flex
  justify-content: space-between
  font-weight: $base-light-font-weight
  font-size: 0.8rem

.person-item__info__nickname, .person-item__info__year

.person-item__action
  +position(absolute, null 0 0 0)
  opacity: 0
  transition: opacity $base-duration $base-timing
  pointer-events: none

.person-item__edit
  display: block
  +size(30px)
  background: transparentize($white, 0.2)  no-repeat center
  background-image: url("../assets/icons/edit-draw-pencil.svg")
  background-size: 20px 20px
  border-radius: 50%
  opacity: 0
  pointer-events: none
  +position(absolute, 10px 10px null null)
  transform: scale(1)
  transition: transform $base-duration $base-timing
  &:hover
    transform: scale(1.2)

.person-item__add
  display: block
  +size(30px)
  background-color: $white
  border-radius: 50%
  +position(absolute,50% null null 50%)
  transform: translate(-50%,-50%) scale(0.75)
  transition: transform $base-duration $base-timing

  &:hover
    transform: translate(-50%,-50%) scale(1)

  &:before,&:after
    content: ""
    display: block
    height: 2px
    width: 15px
    background-color: $lighten-gray
    +position(absolute, 50% 0 0 50%)

  &:before
    transform: translate(-50%,-50%) rotate(90deg)
  
  &:after
    transform: translate(-50%,-50%)
</style>
