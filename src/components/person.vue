<template lang="pug">
.person(:class="'a' + person")
  .person-item
    .person-item__img(
      :style="{'background-image': 'url('+people[person].img+')'}"
    )
      router-link.person-item__edit(
        v-if="login"
        :to="{name: 'edit' , params: { id: person }}"
      )
    .person-item__info
      .person-item__info__name
        span {{people[person].name}}
      .person-item__info__others
        span.person-item__info__nickname {{people[person].nickname}}
        span.person-item__info__year(
          v-if="people[person].dates.birth"
        ) {{dateTransform(people[person].dates.birth)}}
    .person-item__action(v-if="login")
      router-link(:to="{name:'add'}").person-item__add
</template>

<script>
import {
  format as dateFormat
} from 'date-fns'
export default {
  name: 'Person',
  props: {
    person: String,
    people: Object,
    login: Boolean
  },
  mounted () {
    this.$nextTick(function () {
      this.$root.$emit('person-rendered')
    })
  },
  methods: {
    dateTransform (dateStr) {
      return dateFormat(new Date(dateStr), 'dd MMM yyyy')
    }
  }    
}
</script>

<style lang="sass">

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
