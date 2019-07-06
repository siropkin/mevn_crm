<template>
  <div class="clients-container">
    <div class="clients-toolbar">
      <h2>Clients</h2>
      <button id="client-create-btn" @click="createNewClient()">New Client</button>
    </div>
    <table class="clients-list">
      <thead>
        <tr>
          <th width="20%">Name</th>
          <th width="20%">Email</th>
          <th width="20%">Phone</th>
          <th width="35%">Providers</th>
          <th width="5%"></th>
        </tr>
      </thead>      
      <tbody>
        <tr class="preloader" v-if="providersIsLoading || clientsIsLoading"> 
          <td colspan="5">
            <div id="preloader"></div>
          </td>
        </tr>
        <tr class="no-data" v-else-if="clients.length == 0"> 
          <td colspan="5">
            <div style="display: inline-block">
              No data for clients.
              <button id="refresh-btn" @click="refreshData">Refresh</button>
            </div>            
          </td>
        </tr>
        <tr v-else class="client"
          v-for="(client, index) in clients"
          v-bind:item="client"
          v-bind:index="index"
          v-bind:key="client._id"
        >
          <td>{{ client.name }}</td>
          <td>{{ client.email }}</td>
          <td>{{ formatPhoneNumber(client.phone) }}</td>
          <td>
            <span class="provider-name"
              v-for="(id, index) in client.providers"
              v-bind:key="index"
            >{{ getProviderNameById(id) }}</span>
          </td>
          <td>
            <button id="client-edit-btn" @click="editClient(index)">Edit</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="client-card" v-if="!newClientHidden">
      <ClientComponent />
    </div>
  </div>
</template>

<script>
import ClientComponent from './ClientComponent.vue'
import { mapGetters } from 'vuex';

export default {
  name: 'ClientsComponent',
  components: {
    ClientComponent
  },
  computed: {
    ...mapGetters({
      providersIsLoading: 'PROVIDERS_IS_LOADING',
      providers: 'PROVIDERS',
      clientsIsLoading: 'CLIENTS_IS_LOADING',      
      clients: 'CLIENTS',      
      newClientHidden: 'NEW_CLIENT_HIDDEN'      
    })    
  },
  created() {
    this.$store.dispatch('SET_ERROR', "");
    this.$store.dispatch('SET_PROVIDERS');
    this.$store.dispatch('SET_CLIENTS');
  },
  methods: {
    refreshData() {
      this.$store.dispatch('SET_ERROR', "");
      this.$store.dispatch('SET_PROVIDERS');
      this.$store.dispatch('SET_CLIENTS');
    },
    createNewClient() {
      this.$store.dispatch('SET_ERROR', "");
      if (this.providers.length == 0) {
          this.$store.dispatch('SET_PROVIDERS');
      }
      if (this.clients.length == 0) {
        this.$store.dispatch('SET_CLIENTS');
      }
      this.$store.dispatch('SET_NEW_CLIENT', -1);
      this.$store.dispatch('SET_PROVIDERS_STATUS_FOR_NEW_CLIENT');
      this.$store.dispatch('SET_NEW_CLIENT_HIDDEN', false);
    },
    editClient(index) {
      this.$store.dispatch('SET_ERROR', "");
      this.$store.dispatch('SET_NEW_CLIENT', index);
      this.$store.dispatch('SET_PROVIDERS_STATUS_FOR_NEW_CLIENT');
      this.$store.dispatch('SET_NEW_CLIENT_HIDDEN', false);
    },
    formatPhoneNumber(phoneNumber) {
      return phoneNumber.replace(/[^0-9]/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
    },
    getProviderNameById(providerId) {
      const provider = this.providers.find((provider) => { return provider._id === providerId  });
      if (provider) { return provider.name }
      return providerId;
    },
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
div.clients-container {
  margin: 0 auto;
  width: 100%; 
  max-width: 1000px; 
}

div.clients-toolbar {
  position: relative;
  height: 65px;  
  border: 1px solid lightgray;
  background:#f1f5f9;
}

div.client-card {  
  position: fixed;
  top: 10px;
  left: calc(50% - 640px/2);
  width: 640px;
}

table.clients-list {
  width: 100%;
  border-collapse: collapse;
  border: 1px solid lightgray;
  background: white;
}

table.clients-list thead {
  box-shadow: 0 8px 8px -6px gray;
}

table.clients-list th {
  text-align: left;
  color: black;
  padding: 16px;
  min-width: 30px;
  border: 1.5px solid gray;
  background-color: #F7F5F6; 
  background-image: linear-gradient(to bottom, #F7F5F6, #DDDDDD);
}

table.clients-list tr.client td {
  text-align: left;
  padding: 16px;
  border: 1px solid lightgray;
}

table.clients-list tr.no-data td {
  text-align: center;
  padding: 16px;
  border: 1px solid lightgray;
  color: gray
}

table.clients-list tr.preloader td {
  padding: 10px;
  border: 1px solid lightgray;
  color: gray
}

#client-create-btn {
  position: absolute;
  right: 16px;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);  
  border: 1px solid #ADADAD;
  border-radius: 7px;
  margin: 0;

  text-decoration: none; 
  display: inline-block;
  color: #4A4A4A;
  background-color: #F7F5F6; 
  background-image: linear-gradient(to bottom, #F7F5F6, #DDDDDD);  
  width: 100px;
  height: 30px;
}

#client-create-btn:hover {
  border: 1px solid #ADADAD;
  background-color: #E0E0E0; 
  background-image: linear-gradient(to bottom, #E0E0E0, #BDBBBC);
}

#client-edit-btn, #client-edit-btn:hover, #client-edit-btn:after, #client-edit-btn:focus {
  clear: both;
  text-align: center;
  color: #108be3;
  text-decoration: underline;
  border: none;
  box-shadow: none;
  background: none;
  outline: 0;
  cursor: pointer;
  display: inline-block;
  font-size: 100%;
  margin: 0 auto;
}

#refresh-btn, #refresh-btn:hover, #refresh-btn:after, #refresh-btn:focus {
  clear: both;
  text-align: center;
  color: gray;
  text-decoration: underline;
  border: none;
  box-shadow: none;
  background: none;
  outline: 0;
  cursor: pointer;
  display: inline-block;
  font-size: 100%;
  padding: 0;
}

span.provider-name {
    margin: 0;
    padding: 0;
}

span.provider-name:not(:last-of-type):after {
    content: ", ";
}

#preloader {
  margin: 0 auto;
  width: 28px;
  height: 28px;
  border: gray 2px solid;
  border-left-color: transparent;
  border-radius: 50%;
  -webkit-animation: rotating 1s linear infinite;
}

@-webkit-keyframes rotating {
  from {
    -webkit-transform: rotate(0deg);
  }
  to {
    -webkit-transform: rotate(360deg);
  }
}

h2 {
  position: relative;
  top: 50%;
  -ms-transform: translateY(-50%);
  transform: translateY(-50%);
  padding-left: 16px;
  margin: 0;
  color: #37798b;
}
</style>
