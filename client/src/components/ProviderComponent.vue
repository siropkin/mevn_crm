<template>
  <div class="container">
    <div class="error" v-if="error">{{ error }}</div>
    <h1>Providers</h1>
    <div class="create-provider">
      <label for="create-provider">Providers: </label>
      <input type="text" id="create-provider" v-model="newProviderName" placeholder="Provider name">
      <button v-on:click="createProvider">Add Provider</button>
    </div>
    <hr>    
    <div class="providers-container">
      <div class="provider"
        v-for="(provider, index) in providers"
        v-bind:item="provider"
        v-bind:index="index"
        v-bind:key="provider._id"
      >
        <input type="text" :readonly="provider.readonly" id="edit-provider" v-model="provider.name" placeholder="Edit a provider name">
        <button :hidden="!provider.readonly" v-on:click="editProvider(index)">Edit</button>
        <button :hidden="!provider.readonly" v-on:click="deleteProvider(index)">Delete</button>
        <button :hidden="provider.readonly" v-on:click="updateProvider(index)">Save</button>
        <button :hidden="provider.readonly" v-on:click="undoSaveProvider(index)">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ProviderComponent',
  computed: {
    ...mapGetters({
      providers: 'providers',
      error: 'error'
    }),
    newProviderName: { 
      get() { return this.$store.getters.newProviderName; },
      set(value) { this.$store.commit('newProviderName', value) } 
    }
  },
  created() {
    this.$store.commit('getProviders');
  },
  methods: {
    createProvider() {
      // TODO: If click twise to Add Provider when input is empty, then error message don't show is second time
      this.$store.commit('createProvider');
    },
    deleteProvider(index) {
      this.$store.commit('deleteProvider', index);
    },
    editProvider(index) {
      this.$store.commit('editProvider', index);
    },
    updateProvider(index) {
      this.$store.commit('updateProvider', index);
    },
    undoSaveProvider(index) {
      this.$store.commit('undoSaveProvider', index);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
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

h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
