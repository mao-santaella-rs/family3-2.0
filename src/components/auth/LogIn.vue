<template lang="pug">
#login
  h5.card-title Ingresar
  .form
    .form-group
      label(for='form-user') User
      input#form-user.form-control(type='text',v-model="user")
    .form-group
      label(for='form-password') Password
      input#form-password.form-control(type='password',v-model="password")
    .form-group(v-if="feedback_text")
      p {{feedback_text}}
    .form-group.form-action
      button.btn.btn-primary(@click.prevent="login()") Ingresar
</template>

<script>
export default {
  name: 'LogIn',
  data () {
    return {
      user: null,
      password: null,
      feedback_text: null
    }
  },
  methods: {
    login () {
      if (this.user && this.password) {
        this.$store.state.auth.signInWithEmailAndPassword(this.user, this.password)
          .then(() => {
            this.$router.go(-1)
          })
          .catch(function (error) {
            // TODO show error in the view
            console.error(error)
          })
      } else {
        // TODO show that needs a username an password
        if (this.user) {
          
        }
      }
    }
  }
}
</script>

<style lang="sass">
</style>
