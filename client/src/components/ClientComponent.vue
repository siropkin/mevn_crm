<template>
  <div class="client-container">    
    <div class="client-card">
      <h1 v-if="client._id == -1">New Client</h1>  
      <h1 v-else>Edit Client</h1>  
      <hr>
      <label for="edit-client-name">Name: </label> 
      <input type="text" id="edit-client-name" v-model="client.name" placeholder="Client name"> <br/>
      <label for="edit-client-email">Email: </label> 
      <input type="text" id="edit-client-email" v-model="client.email" placeholder="Client email"> <br/>
      <label for="edit-client-phone">Phone: </label> 
      <input type="text" id="edit-client-phone" v-model="client.phone" placeholder="Client phone"> <br/>
      <ProvidersComponent />
      <hr>
      <template v-if="client._id == -1">
        <button v-on:click="undoSaveClient()">Cancel</button>
        <button v-on:click="addClient()">Add Client</button>
      </template>
      <template v-else>
        <button v-on:click="deleteClient()">Delete Client</button>
        <button v-on:click="undoSaveClient()">Cancel</button>
        <button v-on:click="saveClient()">Save Client</button>
      </template>
    </div>
  </div>
</template>

<script>
import ProvidersComponent from './ProvidersComponent.vue'
import { mapGetters } from 'vuex';

export default {
  name: 'ClientComponent',
  components: {
    ProvidersComponent
  },
  computed: {
    ...mapGetters({
      client: 'client'
    }),
  },
  methods: {
    addClient() {
      this.$store.commit('addClient');
    },
    deleteClient() {
      if(confirm("Do you really want to delete?")) {
        this.$store.commit('deleteClient');
      }
    },
    saveClient() {
      this.$store.commit('saveClient');
    },
    undoSaveClient() {
      this.$store.commit('undoSaveClient');
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
input {
  width: 100px;
}
div.client-container {  
  position: relative;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: #44475C;
  color: #FFF;
  text-align: left;
  padding: 15px;
}
</style>
