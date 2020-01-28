<template>
  <v-layout column justify-center align-center>
    <v-flex xs12 sm8 md6>
      <div class="text-center pb-3">
        <logo />
        <django-logo />
      </div>
      <div v-if="$store.state.auth.user">
        <p class="green--text">
          Authenticated user email is {{ $store.state.auth.user.email }}
        </p>
        <template v-if="$auth.user.accounts.length > 1">
          <p>Connected to:</p>
          <ul>
            <li v-for="account in $auth.user.accounts" :key="account.id">
              Provider: {{ account.provider }}
              <v-btn @click="$auth.disconnect(account)" text color="red">
                Disconnect
              </v-btn>
            </li>
          </ul>
        </template>
      </div>
      <div v-else class="red--text">Logged out</div>
      <v-card>
        <v-card-title class="headline"
          >Welcome to the Django + Vue.js template</v-card-title
        >
        <v-card-text>
          <p></p>
          <p>
            For more information on this template, check out the
            <a
              href="https://github.com/Maronato/django-vue-template"
              target="_blank"
              >documentation</a
            >.
          </p>
          <p>
            Find a bug? Report it on the github
            <a
              href="https://github.com/Maronato/django-vue-template/issues"
              target="_blank"
              title="contribute"
              >issue board</a
            >.
          </p>
          <hr class="my-3" />
          <a href="https://vuejs.org/" target="_blank">Vue Documentation</a>
          <br />
          <a href="https://docs.djangoproject.com/en/3.0/" target="_blank"
            >Django Documentation</a
          >
          <br />
          <a href="https://vuetifyjs.com/en/" target="_blank"
            >Vuetify Documentation</a
          >
        </v-card-text>
        <v-card-actions>
          <v-spacer />
          <v-btn nuxt to="/secret">Secret Page</v-btn>
          <template v-if="$auth.loggedIn">
            <v-btn @click="$auth.connect('google')" color="primary">
              Connect to other account
            </v-btn>
            <v-btn @click="$auth.logout()" color="red">Logout</v-btn>
          </template>
          <template v-else>
            <v-btn nuxt to="/login">Login Page</v-btn>
          </template>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>

<script>
import Logo from '~/components/Logo.vue'
import DjangoLogo from '~/components/DjangoLogo.vue'

export default {
  auth: false,
  components: {
    Logo,
    DjangoLogo
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
