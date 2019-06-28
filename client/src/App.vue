<template>
  <div id="app">
    <img alt="Vue logo" src="./assets/logo.png">
    <ProviderComponent />
  </div>
</template>

<script>
import ProviderComponent from './components/ProviderComponent.vue'

export default {
  name: 'app',
  components: {
    ProviderComponent
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
