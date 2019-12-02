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
        select#form-spouse(v-model="sex")
          option(value="m") Masculine
          option(value="f") Feminine

    .col-md-6
      .input-ctnr
        label(for='form-nickname') Nick Name
        input#form-nickname(
          type='text'
          v-model="nickName"
        )
    
    .col-md-6
      .input-ctnr
        label(for='form-spouse') Spouse
        select#form-spouse(v-model="spouse")
          option(
            v-for="(person,key,index) in people"
            :key="index + key"
            :value="key"
          ) {{person.name}}

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
        label Birth Day
        .input-date
          select(v-model="birthDateObj.day")
            option(selected data-default :value="0") Day
            option(
              v-for="number in dateSetUp.day" 
              :key="'day-'+number"
              :value="number"
            ) {{number}}
          select(v-model="birthDateObj.month")
            option(selected data-default :value="0") Month
            option(
              v-for="(month,index) in dateSetUp.month" 
              :key="'day-'+month"
              :value="index"
            ) {{month}}
          select(v-model="birthDateObj.year")
            option(selected data-default :value="0") Year
            option(
              v-for="number in dateSetUp.year" 
              :key="'day-'+number"
              :value="2019 - number"
            ) {{2019 - number}}

    .col-md-6
      .input-ctnr
        .form-check.form-check-inline
          input#form-dead-q.form-check-input(
            type='checkbox'
            v-model="deadDateObj.isDead"
          )
          label(for='form-dead-q') 
            span Deceased 
            span(v-if="dead") date
        
        .input-date(v-if="deadDateObj.isDead")
          select(v-model="deadDateObj.day")
            option(selected data-default value="") Day
            option(
              v-for="number in dateSetUp.day" 
              :key="'day-'+number"
              :value="number"
            ) {{number}}
          select(v-model="deadDateObj.month")
            option(selected data-default value="") Month
            option(
              v-for="(month,index) in dateSetUp.month" 
              :key="'day-'+month"
              :value="index"
            ) {{month}}
          select(v-model="deadDateObj.year")
            option(selected data-default value="") Year
            option(
              v-for="number in dateSetUp.year" 
              :key="'day-'+number"
              :value="2019 - number"
            ) {{2019 - number}}
    
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
        @click.prevent="updateData"
      ) Update

      button(
        v-else
        @click.prevent="addData"
      ) Add

      a.lnk.lnk-delete(
        @click.prevent="deleteData"
        href
        v-if="$route.name == 'edit'"
        title="Delete"
      ) Delete

</template>

<script>
import {
  format as dateFormat
} from 'date-fns'
import NewImage from './NewImage'
export default {
  name: 'AddEdit',
  components: {
    NewImage
  },
  data () {
    return {
      name: '',
      nickName: '',
      sex: '',
      mother: '',
      father: '',
      spouse: '',
      image: '',
      birthDate: null,
      deadDate: null,
      bio: '',
      row: '',

      birthDateObj: {
        day: null,
        month: null,
        year: null
      },
      deadDateObj: {
        isDead: false,
        day: null,
        month: null,
        year: null
      },
      dateSetUp: {
        day: 31,
        month: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
        year: 100
      },
      dead: false,
      birthDateView: null,
      deadDateView: null,
      feedback: false,
      imgBlob: {}
    }
  },
  mounted () {
    if (this.$route.name === 'edit') {
      this.loadData()
    }
    // let mao = new Date('2019/11/20').setHours(0, 0, 0, 0)
    // console.log(dateFormat(mao, 'yyyy MM dd HH:mm:ss'), mao)
  },
  methods: {
    saveImageBlob (blob) {
      this.imgBlob = blob
    },
    loadData () {
      const person = this.people[this.$route.params.id]

      this.name = person.name
      this.nickName = person.nickname
      this.sex = person.sex
      this.mother = person.conections.mother
      this.father = person.conections.father
      this.spouse = person.conections.spouse
      this.image = person.img
      
      this.bio = person.bio
      this.row = person.row

      if (typeof person.dates.birth === 'object') {
        const dbDate = new Date(dateTransform(person.dates.birth))
        this.birthDateObj.day = Number(dateFormat(dbDate, 'dd'))
        this.birthDateObj.month = Number(dateFormat(dbDate, 'M')) - 1
        this.birthDateObj.year = Number(dateFormat(dbDate, 'yyyy'))

        console.log(typeof person.dates.birth)
        
        // const newBday = new Date(this.birthDateObj.year, this.birthDateObj.month, this.birthDateObj.day)
        // const newBdayStr = dateFormat(newBday, 'yyyy MM dd HH:mm:ss')
        // console.log(newBdayStr)
      } else {
        const dbDate = new Date(person.dates.birth)
        this.birthDateObj.day = Number(dateFormat(dbDate, 'dd'))
        this.birthDateObj.month = Number(dateFormat(dbDate, 'M'))
        this.birthDateObj.year = Number(dateFormat(dbDate, 'yyyy'))
      }

      // console.log(dateFormat(new Date(0).setUTCSeconds(person.dates.birth.seconds), 'yyyy MM dd HH:mm:ss'))
      
      if (person.dates.dead) {
        this.deadDateView = dateTransform(person.dates.dead)
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
        if (this.birthDateView) {
          this.birthDate = new Date(this.birthDateView).setHours(0, 0, 0, 0)
        }
        if (this.deadDateView) {
          this.deadDate = new Date(this.deadDateView).setHours(0, 0, 0, 0)
        }
        actualizarDatos()
      }

      function actualizarDatos () {
        console.log('actualizando datos')
        this.dataBase.doc(personId).update({
          name: this.name,
          nickname: this.nickName,
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
            birth: this.birthDate,
            dead: this.deadDate
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
        if (!this.nickName) {
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
      this.feedback = this.formValidation()

      if (this.feedBack.length) return

      if (this.father.length) {
        this.row = this.people[this.father].row + 1
      }
      if (this.mother.length) {
        this.row = this.people[this.mother].row + 1
      }
      // send data
      this.dataBase.add({
        name: this.name,
        nickname: this.nickName,
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
          birth: dateFormat(new Date(this.birthDateObj.year, this.birthDateObj.month, this.birthDateObj.day), 'yyyy MM dd HH:mm:ss'),
          dead: dateFormat(new Date(this.deadDateObj.year, this.deadDateObj.month, this.deadDateObj.day), 'yyyy MM dd HH:mm:ss')
        }
      })
        .then(docRef => {
          console.log('Document written with ID: ', docRef.id)
          this.$router.go(-1)
        })
        .catch(error => {
          console.error('Error adding document: ', error)
        })
    },
    formValidation () {
      let feedBack = []
      if (this.name.length < 1) {
        feedBack.push('Name is required')
      }
      if (this.nickName.length < 1) {
        feedBack.push('Nick Name is required')
      }
      if (this.sex.length < 1) {
        feedBack.push('Sex is required')
      }
      if (this.father.length < 1 && this.mother.length < 1) {
        feedBack.push('select one of the parents')
      }
      if (this.birthDateObj.day === null && this.birthDateObj.month === null && this.birthDateObj.year === null) {
        feedBack.push('select a correct birthday')
      }
      if (this.deadDateObj.isDead) {
        if (this.deadDateObj.day === null && this.deadDateObj.month === null && this.deadDateObj.year === null) {
          feedBack.push('select a correct dead date')
        }
      }
      return feedBack
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
.input-date
  display: flex
  select
    margin-right: 10px
    &:last-child
      margin-right: 0
</style>
