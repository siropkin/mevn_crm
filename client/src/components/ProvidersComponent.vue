<template>
  <div class="container">    
    <div class="create-provider">
      <label for="create-provider">Providers: </label>
      <input type="text" id="create-provider" v-model="newProviderName" placeholder="Provider name">
      <button v-on:click="createProvider">Add Provider</button>
    </div>  
    <div class="providers-container">
      <div class="provider"
        v-for="(provider, index) in providers"
        v-bind:item="provider"
        v-bind:index="index"
        v-bind:key="provider._id"
      >
        <input type="text" :readonly="provider.readonly" id="edit-providerName" v-model="provider.name" placeholder="Provider name">
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
  name: 'ProvidersComponent',
  computed: {
    ...mapGetters({
      providers: 'providers'
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
