<template>
  <div>
    <p>Carregando seus dados...</p>
    <template v-if="timeout">
      <p>Demorando muito?</p>
      <v-btn @click="$auth.logout()">Tentar de novo</v-btn>
    </template>
  </div>
</template>

<script>
export default {
  data() {
    return {
      timeout: false,
      timeoutId: null
    }
  },
  mounted() {
    this.timeoutId = setTimeout(() => (this.timeout = true), 5000)
  },
  beforeDestroy() {
    clearTimeout(this.timeoutId)
  }
}
</script>
