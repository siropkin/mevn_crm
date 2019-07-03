<template>
  <div class="clients-container">
    <div class="clients-toolbar">
      <h2>Clients</h2>
      <button id="client-create-btn" @click="createClient()">New Client</button>
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
        <tr class="preloader" v-if="clientsLoading || providersLoading"> 
          <td colspan="5">
            <div id="preloader"></div>
          </td>
        </tr>
        <tr class="no-data" v-else-if="clients.length == 0"> 
          <td colspan="5">
            <div style="display: inline-block">
              No data.
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
          <td>{{ client.phone.toString().replace(/[^0-9]/g, '').replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3') }}</td>
          <td>
            <span class="provider-name"
              v-for="(id, index) in client.providers"
              v-bind:key="index"
            >{{ providerNameById(id) }}</span>
          </td>
          <td>
            <button id="client-edit-btn" @click="editClient(index)">Edit</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="client-card" v-if="showClientCard">
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
      clientsLoading: 'clientsLoading',
      providersLoading: 'providersLoading',
      clients: 'clients',
      providers: 'providers',
      providerNameById: 'providerNameById',
      showClientCard: 'showClientCard'      
    })    
  },
  created() {
    this.$store.commit('getProviders');
    this.$store.commit('getClients');
  },
  methods: {
    refreshData() {
      this.$store.commit('getProviders');
      this.$store.commit('getClients');
    },
    createClient() {
      this.$store.commit('createClient');
    },
    editClient(index) {
      this.$store.commit('editClient', index);
    }
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
  position: absolute;
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
