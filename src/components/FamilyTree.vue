<template lang="pug">
  .fmly-wrpr(ref="fmly-wrpr")
    #line.line
    vfamilynode(
      v-if="Object.keys(tree).length"
      :datos='tree'
      :personas="people"
    )
</template>

<script>
import vfamilynode from './FamilyNode.vue'

export default {
  components: {
    vfamilynode
  },
  computed: {
    tree () {
      return this.$store.state.familyTree
    },
    people () {
      return this.$store.state.people
    }
  }
}
</script>

<style lang="sass">

</style>
