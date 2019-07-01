<template>
  <div id="app">
    <div class="clients">
      <ClientsComponent />
    </div>
    <div class="client-card" v-if="showClientCard">
      <ClientComponent />
    </div>
    <div class="error" v-if="error">
      {{ error }}
    </div>
  </div>
</template>

<script>
import ClientsComponent from './components/ClientsComponent.vue'
import ClientComponent from './components/ClientComponent.vue'
import { mapGetters } from 'vuex';

export default {
  name: 'app',
  components: {
    ClientsComponent,
    ClientComponent
  },
  computed: {
    ...mapGetters({
      error: 'error',
      showClientCard: 'showClientCard'
    })
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
}

div.clients {
  position: relative;
  top: 0px;
  left: 12%;
  width: 76%;
}

div.client-card {  
  position: absolute;
  top: 5%;
  left: 22%;
  width: 56%;
  background-color: orangered;
}

div.error {  
  position: absolute;
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
