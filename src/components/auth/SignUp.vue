<template lang="pug">

#signup
  h5.card-title Registro
  .form
    .form-group
      label(for='form-user') User
      input#form-user.form-control(type='email',v-model="user")
    .form-group
      label(for='form-password') Password
      input#form-password.form-control(type='password',v-model="password")
    .form-group
      label(for='form-alias') Alias
      input#form-alias.form-control(type='text',v-model="alias")
    .form-group(v-if="feedback_text")
      p {{feedback_text}}
    .form-group.form-action
      button.btn.btn-primary(@click="signup") Registrar

</template>

<script>
export default {
  name: 'Signup',
  data () {
    return {
      user: null,
      password: null,
      alias: null,
      feedback_text: null,
      slug: null
    }
  },
  methods: {
    // TODO make it async await
    signup () {
      const auth = this.$store.state.auth
      const db = this.$store.state.db
      this.feedback_text = null

      if (this.alias && this.user && this.password) {
        this.slug = slugify(this.alias)
        const ref = db.collection('users').doc(this.slug)
        ref.get().then(doc => {
          if (doc.exists) {
            this.feedback_text = 'el usuario ya existe'
          } else {
            // this.feedback_text = "el usuario esta disponible";
            auth.createUserWithEmailAndPassword(this.user, this.password)
              .then(cred => {
                ref.set({
                  alias: this.alias,
                  user_id: cred.user.uid
                })
              }).then(() => {
                this.$router.go(-1)
              })
              .catch(err => {
                console.log(err)
                this.feedback_text = err.message
              })
          }
        })
      } else {
        this.feedback_text = 'hay que entrar un alias'
      }

      // in functions
      function slugify (text) {
        return text.toString().toLowerCase()
          /* eslint-disable */
          .replace(/\s+/g, '-') // Replace spaces with
          .replace(/[^\w\-]+/g, '') // Remove all non-word chars
          .replace(/\-\-+/g, '-') // Replace multiple - with single -
          .replace(/^-+/, '') // Trim - from start of text
          .replace(/-+$/, '') // Trim - from end of text
          /* eslint-enable */
      }
    }
  }  
}
</script>

<style lang="sass">

</style>
