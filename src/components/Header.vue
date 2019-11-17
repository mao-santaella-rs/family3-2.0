<template lang="pug">
  header.header
    .header__logo
      img(src="img/logo-l.svg", alt="")
    .header__user
      .header__user-txt(v-if="session.login")
        span {{session.alias}}
      .header__user__action(v-if="session.login")
        a(href,@click.prevent="signOut()").lnk log Out
      .header__user__action(v-if="!session.login")
        router-link(:to="{name: 'login'}").lnk log In
</template>

<script>
export default {
  name: 'vHeader',
  data () {
    return {
      
    }
  },
  methods: {
    signOut () {
      this.$store.state.auth.signOut()
    }
  },
  computed: {
    session () {
      return this.$store.state.session
    }
  }
}
</script>

<style lang="sass">

</style>
