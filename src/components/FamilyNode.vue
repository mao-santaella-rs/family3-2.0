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
  data () {
    return {
    }
  },
  watch: {},
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
        console.log('ultima filia')
        
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
        console.log(this.lines)

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
</style>
