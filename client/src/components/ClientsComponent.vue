<template>
  <div class="container">
    <h1>Clients</h1>
    <button v-on:click="createClient()">New Client</button>
    <table class="clients">
      <thead>
        <tr>
          <th>Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Providers</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr class="client"
          v-for="(client, index) in clients"
          v-bind:item="client"
          v-bind:index="index"
          v-bind:key="client._id"
        >
          <td>{{ client.name }}</td>
          <td>{{ client.email }}</td>
          <td>{{ client.phone }}</td>
          <td>
            <span class="provider-name"
              v-for="(id, index) in client.providers"
              v-bind:key="index"
            >
              {{ getProviderNameById(id) }}
            </span>
          </td>
          <td><button v-on:click="editClient(index)">Edit</button></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
  name: 'ClientsComponent',
  computed: {
    ...mapGetters({
      clients: 'clients',
      getProviderNameById: 'getProviderNameById'
    })
  },
  created() {
    this.$store.commit('getProviders');
    this.$store.commit('getClients');
  },
  methods: {
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
table {
  font-family: 'Open Sans', sans-serif;
  width: 750px;
  border-collapse: collapse;
  border: 3px solid #44475C;
  margin: 10px 10px 0 10px;
}

table th {
  text-transform: uppercase;
  text-align: left;
  background: #44475C;
  color: #FFF;
  padding: 8px;
  min-width: 30px;
}

table td {
  text-align: left;
  padding: 8px;
  border-right: 2px solid #7D82A8;
}
table td:last-child {
  border-right: none;
}
table tbody tr:nth-child(2n) td {
  background: #D4D8F9;
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
