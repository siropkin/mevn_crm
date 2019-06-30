<template>
  <div class="container">    
    <div class="create-provider">
      <label for="create-provider">Providers: </label>
      <input type="text" id="create-provider" v-model="newProviderName" placeholder="Provider name">
      <button v-on:click="addProvider()">Add Provider</button>
    </div>  
    <div class="providers-container">
      <div class="provider"
        v-for="(provider, index) in providers"
        v-bind:item="provider"
        v-bind:index="index"
        v-bind:key="provider._id"
      >
        <input type="checkbox" id="provider-checked" v-on:change="toggleProvider(index)" v-bind:checked="provider.checked">
        <input type="text" :readonly="provider.readonly" id="edit-providerName" v-model="provider.name" placeholder="Provider name">
        <button :hidden="!provider.readonly" v-on:click="editProvider(index)">Edit</button>
        <button :hidden="!provider.readonly" v-on:click="deleteProvider(index)">Delete</button>
        <button :hidden="provider.readonly" v-on:click="saveProvider(index)">Save</button>
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
    addProvider() {
      this.$store.commit('addProvider');
    },
    deleteProvider(index) {
      this.$store.commit('deleteProvider', index);
    },
    editProvider(index) {
      this.$store.commit('editProvider', index);
    },
    saveProvider(index) {
      this.$store.commit('saveProvider', index);
    },
    undoSaveProvider(index) {
      this.$store.commit('undoSaveProvider', index);
    },
    toggleProvider(index) {
      this.$store.commit('toggleProvider', index);
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
