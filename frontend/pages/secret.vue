<template>
  <v-layout>
    <v-flex class="text-center">
      <v-card>
        <div class="pt-10">This page is for authenticated users only!</div>
        <v-card-actions>
          <v-spacer />
          <v-btn nuxt to="/" color="primary">Go back</v-btn>
        </v-card-actions>
      </v-card>
    </v-flex>
  </v-layout>
</template>
