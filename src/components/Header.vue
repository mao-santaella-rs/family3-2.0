<template lang="pug">
  .header
    .header__logo
      img(src="../assets/logo-l.svg", alt="")
    .header__user
      .header__user-txt
        span(v-if="session.login") {{session.alias}}
      .header__user__action(v-if="session.login")
        a.lnk(@click.prevent="signOut()") log Out
      .header__user__action(v-else)
        router-link.lnk(:to="{name: 'login'}") log In
</template>

<script>
export default {
  name: 'Header',
  data () {
    return {
      
    }
  },
  methods: {
    signOut () {
      this.auth.signOut().then(() => {
        // TODO show succsesfull signout
      }).catch(function (error) {
        // TODO show error had happend
        console.error(error)
      })
    }
  },
  computed: {
    session () {
      return this.$store.state.session
    },
    auth () {
      return this.$store.state.auth
    }
  }
}
</script>

<style lang="sass">
.header
  padding: 25px
  +position(fixed, 0 null null 0)
  z-index: 100
  background-color: rgba($black,0.7)
  border-bottom-right-radius: 20px

.header__logo
  img
    width: 100px

.header__user

.header__user-txt
  font-weight: $base-bold-font-weight
  color: $lighter-gray

@media(max-width:550px)
  .header
    padding: 10px
    border-bottom-right-radius: 10px
  .header__logo
    img
      width: 50px
</style>
