<template>
  <v-layout>
    <v-flex class="text-center">
      <v-btn color="red" class="mt-10" @click="$auth.loginWith('google')"
        >Login with google</v-btn
      >
    </v-flex>
  </v-layout>
</template>

<script>
export default {}
</script>
