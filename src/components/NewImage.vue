<template lang="pug">
.new-img
  .row
    .col
      .input-file
        input#my-file.input-file-input(
          type="file"
          @change="selectFile($event)"
        )
        label.input-file-label(for="my-file") Select a file...

      p.file-return(v-if="imgName") 
        b Selected file
        br 
        | {{imgName}}

    .col
      .new-image(
        :style="{'background-image': `url(${finalImg})`}"
      )
</template>

<script>
export default {
  name: 'NewImage',
  props: {
    image: String
  },
  data () {
    return {
      imgProcessed: '',
      imgName: ''
    }
  },
  methods: {
    selectFile (event) {
      const file = event.target.files[0]
      this.imgName = file.name
      const fr = new FileReader()
      fr.onload = e => {
        this.imgProcessed = e.target.result
        this.$emit('get-imgblob', file)
      }
      fr.readAsDataURL(file)
    }
  },
  computed: {
    finalImg () {
      return this.imgProcessed.length ? this.imgProcessed : this.image
    }
  }
}
</script>

<style lang="sass">
.new-img

.input-file
  position: relative

.input-file-input
  +position(absolute, 0 null null 0)
  width: 100%
  opacity: 0
  pointer-events: none

.input-file-label
  display: block
  padding: 10px 20px
  text-align: center
  background-color: $action-color
  color: $button-text-color
  transition: all $base-duration $base-timing
  border-radius: $base-border-radius
  cursor: pointer
  margin-bottom: 10px

  &:hover, &:focus
    background-color: $link-hover-color
    color: $white

.file-return
  margin: 0
  margin-bottom: 10px
  font-style: italic
  font-size: .9rem
  word-break: break-all

  br
    line-height: 1em

.new-image
  width: 170px
  height: 130px
  background-position: center
  background-size: cover
  background-color: $lightest-gray
  border-radius: 15px
</style>
