<template>
  <div id="app">
    <div class="error" v-if="error">{{ error }}</div>
    <ClientsComponent />
    <div class="client" v-if="showClient">
      <ClientComponent />
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
      showClient: 'showClient'
    })
  },
}
  // TODO: If click twise to Add Provider when input is empty, then error message don't show is second time
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

div.error {  
  position: absolute;
  top: 0px;
  left: 37%;
  width: 26%;
  background-color: orangered;
  color: white;
}
/*
div.error {  
  opacity: 0;
  position: absolute;
  top: 0px;
  left: 37%;
  width: 26%;
  background-color: orangered;
  color: white;
  -webkit-animation-name: widthChange;
  -webkit-animation-duration: 5s;
  animation-name: widthChange;
  animation-duration: 5s;
}

@keyframes widthChange {
  0%   {opacity: 0;}
  1%   {opacity: 0.1;}
  2%   {opacity: 0.2;}
  3%   {opacity: 0.3;}
  4%   {opacity: 0.4;}
  5%   {opacity: 0.5;}
  6%   {opacity: 0.6;}
  7%   {opacity: 0.7;}
  8%   {opacity: 0.8;}
  9%   {opacity: 0.9;}
  10%  {opacity: 1;}
  100% {opacity: 1;}
}
*/
div.client-container {  
  position: absolute;
  top: 30%;
  left: 30%;
  width: 40%;
  background-color: #44475C;
  color: #FFF;
  text-align: left;
  padding: 15px;
}
</style>
