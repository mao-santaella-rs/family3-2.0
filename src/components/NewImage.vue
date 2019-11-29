<template lang="pug">
.new-img

  .input-file
    input#my-file.input-file-input(
      type="file"
      @change="selectFile($event)"
    )
    label.input-file-label(for="my-file") Select a file...

    p.file-return(v-if="selected_img") 
      b Selected file
      br 
      | {{selected_img}}

    button(
      v-if="!image_saved && img_obj"
      @click.prevent="processFile"
    ) Save Image

  .new-image(:style="{'background-image': 'url(' + image +')'}")

</template>

<script>
export default {
  name: 'NewImage',
  data () {
    return {
      image: null,
      selected_img: null,
      image_saved: null,
      img_obj: null
    }
  },
  methods: {
    selectFile (event) {
      let file = event.target.files[0]
      this.selected_img = file.name

      var fr = new FileReader()
      fr.onload = e => {
        this.image = e.target.result
        this.img_obj = file
      }
      fr.readAsDataURL(file)
    },
    processFile () {
      let name = this.name.replace(/\s+/g, '-').toLowerCase()
      let re = /(?:\.([^.]+))?$/
      let ext = re.exec(this.img_obj.name)[1]

      var imageRef = this.storage.child('photos/' + name + '.' + ext)

      let task = imageRef.put(this.img_obj)

      task.on('state_changed',
        snapshot => {
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          console.log('Upload is ' + progress + '% done')
        }, 
        error => {
          switch (error.code) {
            // User doesn't have permission to access the object
            case 'storage/unauthorized': break
            // User canceled the upload
            case 'storage/canceled': break
            // Unknown error occurred, inspect error.serverResponse
            case 'storage/unknown': break
          }
        },
        () => {
          // Upload completed successfully, now we can get the download URL
          task.snapshot.ref.getDownloadURL()
            .then(downloadURL => {
              console.log('File available at', downloadURL)
              this.image_saved = true
              this.image = downloadURL
            })
        })
    }
  },
  computed: {
    storage () {
      return this.$store.state.storage
    }
  }
}
</script>

<style lang="sass">
.new-img
  display: flex
  justify-content: space-between

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
