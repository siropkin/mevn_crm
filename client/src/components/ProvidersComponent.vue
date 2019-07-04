<template>
  <div class="providers-container">    
    <div class="providers-toolbar">
      <label class="main" for="provider-name">Providers: </label>
      <input class="main" type="text" id="provider-name" v-model="providerName" placeholder="Provider name">
      <button id="provider-add-btn" @click="addProvider()">Add Provider</button>
    </div>  
    <div class="providers" v-if="providers.length !== 0">
      <div class="provider"
        v-for="(provider, index) in providers"
        v-bind:item="provider"
        v-bind:index="index"
        v-bind:key="provider._id"
      >
        <input type="checkbox" id="provider-checked" @change="toggleProvider(index)" v-bind:checked="provider.checked" />
        <input type="text" :readonly="provider.readonly" id="edit-providerName" v-model="provider.newName" placeholder="Provider name" />
        <template v-if="provider.readonly">
          <button id="provider-edit-btn" @click="editProvider(index)"/>
          <button id="provider-delete-btn" @click="deleteProvider(index)"/>
        </template>
        <template v-else>
          <button id="provider-save-btn" @click="saveProvider(index)"/>
          <button id="provider-cancel-btn" @click="undoSaveProvider(index)"/>
        </template>
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
    })
    /*,
    provider: { 
      get() { return this.$store.getters.provider; },
      set(value) { this.$store.commit('setProviderName', value) } 
    }
    */
  },
  data () {
    return {
      providerName: ""
    }
  },
  created() {
    //this.$store.commit('getProviders');
  },
  methods: {
    addProvider() {
      if (this.$data.providerName.length == 0) {
        const message = "Fill provider name."
        this.$store.commit('setError', message);
        return false;
      }
      this.$store.commit('addProvider', this.$data.providerName.trim());
      this.$data.providerName = "";
    },
    deleteProvider(index) {
      this.$store.commit('deleteProvider', index);
    },
    editProvider(index) {
      this.$store.commit('editProvider', index);
    },
    saveProvider(index) {
      if (this.providers[index].newName.length == 0) {
        const message = "Fill provider name."
        this.$store.commit('setError', message);
        return false;
      }
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
div.providers-toolbar {
  display: inline-block;
}
#provider-add-btn {
  border: 1px solid #ADADAD;
  border-radius: 7px;
  text-decoration: none; 
  display: inline-block;
  color: #4A4A4A;
  background-color: #F7F5F6; 
  background-image: linear-gradient(to bottom, #F7F5F6, #DDDDDD);
  width: 100px;
  height: 30px;
  margin-left:20px;
}

#provider-add-btn:hover {
  border: 1px solid #ADADAD;
  background-color: #E0E0E0; 
  background-image: linear-gradient(to bottom, #E0E0E0, #BDBBBC);
}

div.providers {  
  border: 1px solid lightgray;
  border-radius: 3px;
  width: 250px;
  margin-left: 160px;
}

label.main {
  margin-top: 7px;
  font-weight:bold;
  text-align:right;
  width:150px;
  float:left;
}

input.main {
  float:left;
  border:solid 1px #aacfe4;
  width:230px;
  margin:2px 0 10px 10px;
  border-radius: 5px;
  -moz-border-radius: 5px;
  -op-border-radius: 5px;
  -webkit-border-radius: 5px;
  font-size: 14px;
}
 
input.main {
  height: 18px;
  padding: 4px 10px;
}

div.provider {
  display: flex;
  align-items: center;
  margin: 5px;
  width: 100%''
}

.provider input {
  margin-left: 5px;
  margin-right: 5px;
}

.provider input:read-only {
    border:solid 2px white;
}

#provider-edit-btn {
  border: none;
  background-size: cover;
  background: url('../assets/edit-icon.svg') no-repeat center;
  width: 20px;
  height: 20px;
  margin-left: 3px;
  margin-right: 3px;
  padding: 0;
}

#provider-delete-btn {
  border: none;
  background-size: cover;
  background: url('../assets/trash-alt.svg') no-repeat center;
  width: 20px;
  height: 20px;
  margin-left: 3px;
  margin-right: 3px;
  padding: 0;
}

#provider-save-btn {
  border: none;
  background-size: cover;
  background: url('../assets/check-square.svg') no-repeat center;
  width: 20px;
  height: 20px;
  margin-left: 3px;
  margin-right: 3px;
  padding: 0;
}

#provider-cancel-btn {
  border: none;
  background-size: cover;
  background: url('../assets/window-close.svg') no-repeat center;
  width: 20px;
  height: 20px;
  margin-left: 3px;
  margin-right: 3px;
  padding: 0;
}
</style>
