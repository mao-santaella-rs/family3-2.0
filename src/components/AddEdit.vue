<template lang="pug">
#addedit
  h5.card-title(v-if="$route.name == 'edit'") Edit Relative
  h5.card-title(v-else) Add Relative
  .row
    .col-md-6
      .input-ctnr
        input#form-name(
          type='text'
          v-model="name"
        )
        label(for='form-name') Name

    .col-md-6.input-ctnr
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

      .form-check.form-check-inline
        label.form-check-label Sex:

    .col-md-6
      .input-ctnr
        input#form-nickname(
          type='text'
          v-model="nk_name"
        )
        label(for='form-nickname') Nick Name

    .col-md-6
      .input-ctnr
        select#form-mother(v-model="mother")
          option(
            v-for="(person,key,index) in femenine"
            :key="key + index"
            :value="key"
          ) {{person.name}}
        label(for='form-mother') Mother

    .col-md-6
      .input-ctnr
        select#form-father(v-model="father")
          option(
            v-for="(person,key,index) in masculine"
            :key="key + index"
            :value="key"
          ) {{person.name}}
        label(for='form-father') Father
    
    .col-md-6
      .input-ctnr
        select#form-spouse(v-model="spouse")
          option(
            v-for="(person,key,index) in people"
            :key="index + key"
            :value="key"
          ) {{person.name}}
        label(for='form-spouse') Spouse

      //- .input-ctnr
        label(for='form-img') Image Url
        input#form-img(type='text',v-model="image")

    .col-md-6
      .input-ctnr
        
        .form-check.form-check-inline
          input#form-dead-q.form-check-input(
            type='checkbox'
            value='true'
            v-model="dead"
          )
          label.form-check-label(for='form-dead-q') Deceased

        input#form-birth(
          type='date'
          v-model="b_day_p"
          placeholder="yyyy-mm-dd"
        )
        label(for='form-birth') Birth Day

    .col-md-6
      .input-ctnr(v-if="dead")
        input#form-dead(
          type='date'
          v-model="d_day_p"
          placeholder="yyyy-mm-dd"
        )
        label(for='form-dead') Deceased Date
    
    .col-md-6
      .input-ctnr
        textarea#form-bio(
          rows='7'
          v-model="bio"
        )
        label(for='form-bio') Bio

    .col-md-6

      .image__selection
        .input-file
          label.input-file__label Select image
          input#my-file.input-file-input(
            type="file"
            @change="selectFile($event)"
          )
          label.input-file-label(for="my-file") Select a file...

          p.file-return(
            v-if="selected_img"
          ) 
            b Selected file
            br 
            | {{selected_img}}

          button(
            v-if="image_saved"
            @click.prevent="processFile()"
          ) Save Image

        .new-image(:style="{'background-image': 'url(' + image +')'}")

      //- .mao
      //- a(:href="image", title="title").class img

    .col-12(v-if="feedback")
      p(v-html="feedback")

    .col-12.form-action
      button(
        v-if="$route.name == 'edit'"
        @click.prevent="updateData(),pausePanZoom()"
      ) Update

      button(
        v-else
        @click.prevent="addData(),pausePanZoom()"
      ) Add

      a.lnk.lnk-delete(
        @click.prevent="deleteData(),pausePanZoom()"
        href
        v-if="$route.name == 'edit'"
        title="Delete"
      ) Delete

</template>

<script>
export default {
  name: 'AddEdit',
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
      feedback_text: null,
      app_update: false,

      selected_img: null,
      image_saved: null,
      img_obj: null
    }
  },
  watch: {
  },
  methods: {
    pausePanZoom () {
      this.$store.dispatch('panZoomChange', false)
    },
    resumePanZoom () {
      this.$store.dispatch('panZoomChange', true)
    },
    selectFile (event) {
      let file = event.target.files[0]
      this.selected_img = file.name

      var fr = new FileReader()

      fr.onload = function (e) { 
        this.image = e.target.result
        this.img_obj = file
      }

      fr.readAsDataURL(file)
    },
    processFile () {
      let name = this.name.replace(/\s+/g, '-').toLowerCase()
      let re = /(?:\.([^.]+))?$/
      let ext = re.exec(this.img_obj.name)[1]

      let storageRef = this.firebase.storage().ref()

      var imageRef = storageRef.child('photos/' + name + '.' + ext)

      let task = imageRef.put(this.img_obj)

      task.on('state_changed',
        snapshot => {
          var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
          // TODO PONER EL PORCENTAGE EN LA VISTA
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
              this.image_saved = true
              this.image = downloadURL
            })
        })
    },
    stateValidation () {
      // if the computed property people is ready
      if (this.people) {
        // check if is already updated
        if (!this.app_update) {
          // If the route.name is edit and If there is an id in the route params
          if (this.$route.name === 'edit' && this.$route.params.id) {
            this.loadData()
          }
          // prevent re-update
          this.app_update = true
        }
      }
    },
    genderSel (gender) {
      let people = this.people
      let objP = {}
      for (var key in people) {
        if (people.hasOwnProperty(key)) {
          if (people[key].sex === gender) {
            objP[key] = this.people[key]
          }
        }
      }
      return objP
    },
    loadData () {
      let people = this.people
      let routeId = this.$route.params.id
      let person = people[routeId]

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
    updateData () {
      let routeId = this.$route.params.id
      let dbPersonas = this.people

      this.feedback = validacion()

      if (!validacion()) {
        if (this.father !== dbPersonas[routeId].conections.father) {
          this.row = dbPersonas[this.father].row + 1
        }
        if (this.mother !== dbPersonas[routeId].conections.mother) {
          this.row = dbPersonas[this.mother].row + 1
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
        this.dataBase.doc(routeId).update({
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
            // TODO PONER EL MENSAGE DE SE GUARDO EN LA VISTA
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
            // TODO PONER MENSAGE EN LA VISTA
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
            // TODO PONER MENSAGE DE "GUARDADO" EN LA VISA
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
      return this.$store.state.personas
    },
    masculine () {
      return this.$store.getters.genderSel('m')
    },
    femenine () {
      return this.$store.getters.genderSel('f')
    },
    dataBase () {
      return this.$store.state.db.collection('people')
    }
  },
  created () {
    this.stateValidation()
    this.pausePanZoom()
  },
  updated () {
    this.stateValidation()
  },
  // beforeRouteEnter (to, from, next) {
  //   // called before the route that renders this component is confirmed.
  //   // does NOT have access to `this` component instance,
  // // because it has not been created yet when this guard is called!
  // // next(vm => {
  // // // access to component instance via `vm`
  // // console.log(vm.$store.state.session.login);
      
  // //   if (vm.$store.state.session.login) {
  // //     next()
  // //   } else {
  // //     next("/m/login")
  // //   }
  // // })
    
  // },
  beforeRouteUpdate (to, from, next) {
    // react to route changes...
    // don't forget to call next()
    next()
    this.stateValidation()
  }
  
}
</script>

<style lang="sass">
</style>
