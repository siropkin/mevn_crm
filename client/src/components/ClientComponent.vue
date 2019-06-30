<template>
  <div class="client-container">    
    <h1 :hidden="newClientIndex == -1">Edit Client</h1>
    <h1 :hidden="newClientIndex !== -1">Add Client</h1>
    <hr>
    <div class="client">
      <label for="edit-client-name">Name: </label> 
      <input type="text" id="edit-client-name" v-model="client.name" placeholder="Client name"> <br/>
      <label for="edit-client-email">Email: </label> 
      <input type="text" id="edit-client-email" v-model="client.email" placeholder="Client email"> <br/>
      <label for="edit-client-phone">Phone: </label> 
      <input type="text" id="edit-client-phone" v-model="client.phone" placeholder="Client phone"> <br/>
      <ProvidersComponent />
      <hr>
      <button :hidden="newClientIndex == -1" v-on:click="deleteClient()">Delete Client</button>
      <button v-on:click="undoSaveClient()">Cancel</button>
      <button :hidden="newClientIndex == -1" v-on:click="saveClient()">Save Client</button>
      <button :hidden="newClientIndex !== -1" v-on:click="addClient()">Add Client</button>
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
      client: 'client',
      newClientIndex: 'newClientIndex'
    }),
  },
  /*
  created() {
    this.$store.commit('getProviders');
  },
  */
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
