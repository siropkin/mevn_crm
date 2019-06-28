<template>
  <div class="container">
    <h1>Providers</h1>
    <div class="create-provider">
      <label for="create-provider">Providers: </label>
      <input type="text" id="create-provider" v-model="newProviderName" placeholder="Create a provider">
      <button v-on:click="createProvider">Add Provider</button>
    </div>
    <hr>
    <p class="error" v-if="error">{{ error }}</p>
    <div class="providers-container">
      <div class="provider"
        v-for="(provider, index) in providers"
        v-bind:item="provider"
        v-bind:index="index"
        v-bind:key="provider._id"
      >
        <!-- <p class="name">{{ provider.name }}</p> -->
        <input type="text" :readonly="provider.readonly" id="edit-provider" v-model="provider.name" placeholder="Edit a provider name">
        <button :hidden="!provider.readonly" v-on:click="editProvider(index)">Edit</button>
        <button :hidden="!provider.readonly" v-on:click="deleteProvider(provider._id)">Delete</button>
        <button :hidden="provider.readonly" v-on:click="updateProvider(index, provider._id, provider.name)">Save</button>
        <button :hidden="provider.readonly" v-on:click="undoSaveProvider(index)">Cancel</button>
      </div>
    </div>

  </div>
</template>

<script>
import ProviderService from '../ProviderService';

export default {
  name: 'ProviderComponent',
  data() {
    return {
      providers: [],
      error: '',
      newProviderName: ''
    }
  },
  async created() {
    try {
      this.providers = await ProviderService.getProviders();
    } catch(err) {
      this.error = err.message;
    }
  },
  methods: {
    async createProvider() {
      await ProviderService.createProvider(this.newProviderName);
      this.providers = await ProviderService.getProviders();
    },
    async deleteProvider(id) {
      await ProviderService.deleteProvider(id);
      this.providers = await ProviderService.getProviders();
    },
    async editProvider(index) {
      this.providers[index].readonly = false;
    },
    async updateProvider(index, id, name) {
      this.providers[index].readonly = true;
      await ProviderService.updateProvider(id, name);
      this.providers = await ProviderService.getProviders();
    },
    async undoSaveProvider(index) {
      this.providers[index].readonly = true;
      this.providers = await ProviderService.getProviders();
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
