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
    this.error = "";
    try {
      this.providers = await ProviderService.getProviders();
    } catch(err) {
      this.error = `Wooops! Something gone wrong while gettings providers. Keep calm and try again later... \n ERR:${err.message}`;
    }
  },
  methods: {
    async createProvider() {
      this.error = "";
      try {
        if (this.providers.length == 0) {
          this.providers = await ProviderService.getProviders(); // need if server dosn't work when page load at a first time, but then server started and we need to reload data  
        }
        const createProviderResponse = await ProviderService.createProvider(this.newProviderName);
        this.providers.push({
          _id: createProviderResponse.message,
          name: this.newProviderName,
          readonly: true
        });
        this.newProviderName = "";
      } catch(err) {
        this.error = `Wooops! Something gone wrong while creating provider. Keep calm and try again later... \n ERR:${err.message}`;
      }
    },
    async deleteProvider(index) {
      this.error = "";
      try {
        await ProviderService.deleteProvider(this.providers[index]._id);
        this.providers.splice(index, 1);
      } catch(err) {
        this.error = `Wooops! Something gone wrong while deleting provider. Keep calm and try again later... \n ERR:${err.message}`;
      }
    },
    async editProvider(index) {
      this.providers[index].readonly = false;
    },
    async updateProvider(index) {
      this.error = "";
      try {
        await ProviderService.updateProvider(this.providers[index]._id, this.providers[index].name);
        this.providers[index].readonly = true;
      } catch(err) {
        this.error = `Wooops! Something gone wrong while saving provider. Keep calm and try again later... \n ERR:${err.message}`;
      }
    },
    async undoSaveProvider(index) {
      // TODO: Optimize undo saving: don't get provider from DB, save prev value
      this.error = "";
      try {
        const oldProvider = await ProviderService.getProvider(this.providers[index]._id)
        this.providers[index].name = oldProvider.name;
        this.providers[index].readonly = true;
      } catch(err) {
        this.error = `Wooops! Something gone wrong while undo saving provider. Keep calm and try again later... \n ERR:${err.message}`;
      }
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div.error {  
  opacity: 0;
  position: absolute;
  top: 0px;
  left: 37%;
  width: 26%;
  background-color: orangered;
  color: white;
  -webkit-animation-name: widthChange; /* Safari 4.0 - 8.0 */
  -webkit-animation-duration: 5s; /* Safari 4.0 - 8.0 */
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
