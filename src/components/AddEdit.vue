<template lang="pug">
#addedit
  h5(v-if="$route.name == 'edit'") Edit Relative
  h5(v-else) Add Relative
  .row
    .col-md-6
      .input-ctnr
        label(for='form-name') Name
        input#form-name(
          type='text'
          v-model="name"
        )

    .col-md-6
      .input-ctnr
        label Sex:

        .form-check.form-check-inline
          input#form-sex-m.form-check-input(
            type='radio'
            name='formsex'
            v-model="sex"
            value='m'
          )
          label.form-check-label(for='form-sex-m') M

        .form-check.form-check-inline
          input#form-sex-f.form-check-input(
            type='radio'
            name='formsex'
            v-model="sex"
            value='f'
          )
          label.form-check-label(for='form-sex-f') F

    .col-md-6
      .input-ctnr
        label(for='form-nickname') Nick Name
        input#form-nickname(
          type='text'
          v-model="nk_name"
        )

    .col-md-6
      .input-ctnr
        label(for='form-mother') Mother
        select#form-mother(v-model="mother")
          option(
            v-for="(person,key,index) in femenine"
            :key="key + index"
            :value="key"
          ) {{person.name}}

    .col-md-6
      .input-ctnr
        label(for='form-father') Father
        select#form-father(v-model="father")
          option(
            v-for="(person,key,index) in masculine"
            :key="key + index"
            :value="key"
          ) {{person.name}}
    
    .col-md-6
      .input-ctnr
        label(for='form-spouse') Spouse
        select#form-spouse(v-model="spouse")
          option(
            v-for="(person,key,index) in people"
            :key="index + key"
            :value="key"
          ) {{person.name}}

      //- .input-ctnr
        label(for='form-img') Image Url
        input#form-img(type='text',v-model="image")

    .col-md-6

      .input-ctnr
        label(for='form-birth') Birth Day
        input#form-birth(
          type='date'
          v-model="b_day_p"
          placeholder="yyyy-mm-dd"
        )

    .col-md-6
      .input-ctnr
        .form-check.form-check-inline
          input#form-dead-q.form-check-input(
            type='checkbox'
            value='true'
            v-model="dead"
          )
          label(for='form-dead-q') 
            span Deceased 
            span(v-if="dead") date

        input#form-dead(
          v-if="dead"
          type='date'
          v-model="d_day_p"
          placeholder="yyyy-mm-dd"
        )
    
    .col-md-6
      .input-ctnr
        label(for='form-bio') Bio
        textarea#form-bio(
          rows='7'
          v-model="bio"
        )

    .col-md-6
      .input-ctnr
        label Select image
        new-image(
          :image="image"
          @get-blob="saveImageBlob"
        )

    .col-12(v-if="feedback")
      p(v-html="feedback")

    .col-12.form-action
      button(
        v-if="$route.name == 'edit'"
        @click.prevent="updateData()"
      ) Update

      button(
        v-else
        @click.prevent="addData()"
      ) Add

      a.lnk.lnk-delete(
        @click.prevent="deleteData()"
        href
        v-if="$route.name == 'edit'"
        title="Delete"
      ) Delete

</template>

<script>
import NewImage from './NewImage'
export default {
  name: 'AddEdit',
  components: {
    NewImage
  },
  data () {
    return {
      name: null,
      nk_name: null,
      sex: null,
      mother: null,
      father: null,
      spouse: null,
      image: null,
      d_day: null,
      d_day_p: null,
      b_day: null,
      b_day_p: null,
      bio: null,
      row: null,
      dead: false,
      feedback: false,

      imgBlob: {}
    }
  },
  mounted () {
    this.loadData()
  },
  methods: {
    saveImageBlob (blob) {
      this.imgBlob = blob
    },
    loadData () {
      const person = this.people[this.$route.params.id]

      this.name = person.name
      this.nk_name = person.nickname
      this.sex = person.sex
      this.mother = person.conections.mother
      this.father = person.conections.father
      this.spouse = person.conections.spouse
      this.image = person.img
      
      this.bio = person.bio
      this.row = person.row

      if (person.dates.birth) {
        this.b_day_p = dateTransform(person.dates.birth)
      } else {
        this.b_day_p = ''
      }
      
      if (person.dates.dead) {
        this.d_day_p = dateTransform(person.dates.dead)
        this.dead = true
      } else {
        this.dead = false
      }
      
      function dateTransform (timestamp) {
        var a = new Date(0)
        a.setUTCSeconds(timestamp.seconds)
        var year = a.getUTCFullYear()
        var month = a.getUTCMonth() + 1
        if (month < 10) {
          month = '0' + month
        }
        var date = a.getUTCDate()
        if (date < 10) {
          date = '0' + date
        }
        var time = year + '-' + month + '-' + date
        return time
      }
    },
    uploadImage () {
      if (!('name' in this.imgBlob)) return

      const name = this.name.replace(/\s+/g, '-').toLowerCase()
      const re = /(?:\.([^.]+))?$/
      const ext = re.exec(this.imgBlob.name)[1]
      
      const task = this.storage
        .child(`photos/${name}.${ext}`)
        .put(this.imgBlob)

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
              this.image = downloadURL
            })
        })
    },
    updateData () {
      let personId = this.$route.params.id

      this.feedback = validacion()

      if (!validacion()) {
        if (this.father !== this.people[personId].conections.father) {
          this.row = this.people[this.father].row + 1
        }
        if (this.mother !== this.people[personId].conections.mother) {
          this.row = this.people[this.mother].row + 1
        }
        if (this.b_day_p) {
          this.b_day = new Date(this.b_day_p + 'T00:00:01.0Z')
        }
        if (this.d_day_p) {
          this.d_day = new Date(this.d_day_p + 'T00:00:01.0Z')
        }
        actualizarDatos()
      }

      function actualizarDatos () {
        console.log('actualizando datos')
        this.dataBase.doc(personId).update({
          name: this.name,
          nickname: this.nk_name,
          row: this.row,
          sex: this.sex,
          bio: this.bio,
          img: this.image,
          conections: {
            father: this.father,
            mother: this.mother,
            spouse: this.spouse
          },
          dates: {
            birth: this.b_day,
            dead: this.d_day
          }
        })
          .then(function (docRef) {
            console.log('Se guardo Correctamente')
            this.$router.go(-1)
          })
          .catch(function (error) {
            console.error('Error adding document: ', error)
          })
      }

      function validacion () {
        let feedBack = ''
        if (!this.name) {
          feedBack = 'El nombre es un campo obligatorio<br>'
        }
        if (!this.nk_name) {
          feedBack = feedBack + 'El apodo es un campo obligatorio<br>'
        }
        if (feedBack === '') {
          feedBack = null
        }
        return feedBack
      }
    },
    deleteData () {
      let routeId = this.$route.params.id
      let dbPersonas = this.people
      // confirm troug confirm dialog
      var confirmation = confirm('Do you want to delete' + dbPersonas[routeId].name)
      if (confirmation) {
        this.dataBase.doc(routeId).delete()
          .then(() => {
            console.log('Document successfully deleted!')
            this.$store.dispatch('getData')
            this.$router.go(-1)
          }).catch(error => {
            console.error('Error removing document: ', error)
          })
      } else {
        this.feedBack = 'You pressed Cancel!'
      }
    },
    addData () {
      this.feedback = null
      
      this.feedback = validacion()

      // if validation pass
      if (!validacion()) {
        // asign de correct row
        if (this.father) {
          this.row = this.$store.state.personas[this.father].row + 1
        }
        if (this.mother) {
          this.row = this.$store.state.personas[this.mother].row + 1
        }
        // format de the timestamp for firestore
        if (this.b_day_p) {
          this.b_day = new Date(this.b_day_p + 'T00:00:01.0Z')
        }
        if (this.d_day_p) {
          this.d_day = new Date(this.d_day_p + 'T00:00:01.0Z')
        }

        // send data
        enviarDatos()
      }

      // functions
      // fn send data
      function enviarDatos () {
        this.dataBase.add({
          name: this.name,
          nickname: this.nk_name,
          row: this.row,
          sex: this.sex,
          bio: this.bio,
          img: this.image,
          conections: {
            father: this.father,
            mother: this.mother,
            spouse: this.spouse
          },
          dates: {
            birth: this.b_day,
            dead: this.d_day
          }
        })
          .then(function (docRef) {
            console.log('Document written with ID: ', docRef.id)
            this.$router.go(-1)
          })
          .catch(function (error) {
            console.error('Error adding document: ', error)
          })
      }
      // fn validation
      function validacion () {
        let feedBack = ''
        if (!this.name) {
          feedBack = 'El nombre es un campo obligatorio<br>'
        }
        if (!this.nk_name) {
          feedBack = feedBack + 'El apodo es un campo obligatorio<br>'
        }
        if (!this.sex) {
          feedBack = feedBack + 'El sexo es un campo obligatorio<br>'
        }
        if (!this.father && !this.mother) {
          feedBack = feedBack + 'Seleccione uno de los padres<br>'
        }
        if (feedBack === '') {
          feedBack = null
        }
        return feedBack
      }
    }
  },
  computed: {
    people () {
      return this.$store.state.people
    },
    masculine () {
      return this.$store.getters.genderSel('m')
    },
    femenine () {
      return this.$store.getters.genderSel('f')
    },
    dataBase () {
      return this.$store.state.db.collection('people')
    },
    storage () {
      return this.$store.state.storage
    }
  }
}
</script>

<style lang="sass">
.form-action
  display: flex
  justify-content: space-between
  align-items: center
  flex-direction: row-reverse

.input-ctnr
  margin-bottom: 10px

  input[type="checkbox"]
    margin-bottom: 5px

  input[type="text"], input[type='date'], select, textarea
    box-shadow: none
    border-radius: 0
    margin-bottom: 0
    line-height: inherit

    &:focus
      & ~ label
        color: $color-secundario
        &:after
          background-color: $color-secundario

    & ~ label
      margin: 0
      line-height: inherit
      white-space: nowrap
      
      &:before
        content: ""
        display: block
        height: 100%
        width: 1px
        +position(absolute, null 0 0 null)
        background-color: $lightest-gray
        transition: background-color $base-duration $base-timing
        opacity: 0

      &:after
        content: ""
        display: block
        width: 100%
        height: 1px
        +position(absolute, null null 0 0)
        background-color: $lightest-gray
        transition: background-color $base-duration $base-timing

  textarea
    line-height: 1.2em !important
    &:focus
      & ~ label
        &:before
          background-color: $color-secundario
          opacity: 1
      
</style>
