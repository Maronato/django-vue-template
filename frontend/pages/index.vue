<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <div class="text-center">
        <logo />
        <vuetify-logo />
      </div>
      <div v-if="$store.state.auth.user">
        Username is {{ $store.state.auth.user.email }}
      </div>
      <div v-else>
        Logged out
      </div>
      <v-card>
        <v-card-title class="headline"
          >Welcome to the Vuetify + Nuxt.js template</v-card-title
        >
        <v-card-text>
          <p>
            Vuetify is a progressive Material Design component framework for
            Vue.js. It was designed to empower developers to create amazing
            applications.
          </p>
          <p>
            For more information on Vuetify, check out the
            <a href="https://vuetifyjs.com" target="_blank">documentation</a>.
          </p>
          <p>
            If you have questions, please join the official
            <a href="https://chat.vuetifyjs.com/" target="_blank" title="chat"
              >discord</a
            >.
          </p>
          <p>
            Find a bug? Report it on the github
            <a
              href="https://github.com/vuetifyjs/vuetify/issues"
              target="_blank"
              title="contribute"
              >issue board</a
            >.
          </p>
          <p>
            Thank you for developing with Vuetify and I look forward to bringing
            more exciting features in the future.
          </p>
          <div class="text-xs-right">
            <em>
              <small>&mdash; John Leider</small>
            </em>
          </div>
          <hr class="my-3" />
          <a href="https://nuxtjs.org/" target="_blank">Nuxt Documentation</a>
          <br />
          <a href="https://github.com/nuxt/nuxt.js" target="_blank"
            >Nuxt GitHub</a
          >
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn @click="click">Click me</v-btn>
          <v-btn color="primary" nuxt to="/auth/social/login">Continue</v-btn>
          <v-btn v-if="$auth.loggedIn" @click="$auth.logout()" color="primary"
            >Logout</v-btn
          >
          <v-btn
            v-if="$auth.loggedIn"
            @click="$auth.fetchUser()"
            color="primary"
            >fetch</v-btn
          >
          <v-btn
            v-if="$auth.loggedIn"
            @click="$auth.connect('google')"
            color="primary"
            >connect</v-btn
          >
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import Logo from '~/components/Logo.vue'
import VuetifyLogo from '~/components/VuetifyLogo.vue'

export default {
  auth: false,
  components: {
    Logo,
    VuetifyLogo
  },
  methods: {
    click() {
      if (this.$auth.loggedIn) {
        this.$auth.connect('google')
      } else {
        this.$auth.loginWith('google')
      }
    }
  }
}
</script>
