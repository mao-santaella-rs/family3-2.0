<template lang="pug">

  .home
    family-tree
    router-view

</template>

<script>
import familyTree from '../components/FamilyTree.vue'

export default {
  name: 'Home',
  components: {
    familyTree
  }
}
</script>

<style lang="sass">

</style>
