<template>
  <v-layout>
    <v-flex class="text-center">
      <v-btn @click="$auth.loginWith('google')" color="red" class="mt-10"
        >Login with google</v-btn
      >
    </v-flex>
  </v-layout>
</template>

<script>
export default {}
</script>
