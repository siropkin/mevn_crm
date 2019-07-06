<template>
  <div id="app">
    <ClientsComponent />    
    <div id="app-error" v-if="error">{{ error }}</div>
  </div>
</template>

<script>
import ClientsComponent from './components/ClientsComponent.vue'
import { mapGetters } from 'vuex';

export default {
  name: 'app',
  components: {
    ClientsComponent
  },
  computed: {
    ...mapGetters({
      error: 'ERROR'
    })
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
}

#app-error {  
  position: fixed;
  top: 0px;
  left: 37%;
  width: 26%;
  background-color: orangered;
  color: white;
  padding: 5px;
  border-radius: 0px 0px 5px 5px;
  font-size: 80%;
  text-align: center;
}
</style>
