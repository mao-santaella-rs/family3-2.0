<template lang="pug">
  .fmly-row
    .fmly(
      v-for='family in familyObj'
    )
      .couple
        .ref(:class="parentsFlag(family.couple)")
        person(
          v-for='person in family.couple'
          :key='person'
          :person="person"
          :people="people"
          :login="login"
        )

      FamilyNode(
        v-if='family.relatives'
        :family-obj='family.relatives'
        :people="people"
        :login="login"
      )
</template>

<script>
import Person from './person'
export default {
  name: 'FamilyNode',
  components: { Person },
  props: {
    familyObj: Object,
    people: Object,
    login: Boolean
  },
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
        return ''
      }
    }
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
</style>
