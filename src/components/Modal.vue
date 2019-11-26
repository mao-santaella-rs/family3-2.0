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
      img(src="../assets/icons/cancel.svg")

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
.modal
  +position(fixed, 0 null null 0)
  display: flex
  justify-content: center
  align-items: center
  width: 100vw
  height: 100vh
  z-index: 1000

.modal__background
  display: block
  +position(absolute, 0 0 0 0)
  background-color: rgba($black,0.8)
  &:hover
    cursor: pointer

.modal__window
  width: 90vw
  max-width: 900px
  padding: 35px
  background-color: $white
  position: relative
  z-index: 1100

.auth__window
  max-width: 400px

.modal__close
  display: block
  +size(20px)
  +position(absolute, 10px 10px null null)
</style>
