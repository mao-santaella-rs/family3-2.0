<template lang="pug">
#modal.modal
  router-link.modal__background(
    to="/"
    @click.native="resumePanZoom"
  )
  .modal__window
    router-link.modal__close(
      to="/"
      @click.native="resumePanZoom"
    )
      img(src="img/icons/cancel.svg")

    .modal__content
      router-view

</template>

<script>
export default {
  name: 'Modal',
  data () {
    return {
    }
  },
  methods: {
    pausePanZoom () {
      this.$store.dispatch('panZoomChange', false)
    },
    resumePanZoom () {
      this.$store.dispatch('panZoomChange', true)
    }
  }
}
</script>

<style lang="sass">
</style>
