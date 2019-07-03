// TODO: Make error messages more readebl

import Vue from 'vue';
import Vuex from 'vuex';

import ProvidersService from './ProvidersService';
import ClientsService from './ClientsService';

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        error: '',
        clients: [],
        providers: [],
        client: {
            _id: "",
            name: "",
            email: "",
            phone: "",
            providers: []
        },
        showClientCard: false,
        clientsLoading: true,
        providersLoading: true,
    },
    getters: {
        error(state) {
            return state.error;
        },
        providers(state) {
            return state.providers;
        },        
        providerNameById: state => id => {
            const provider = state.providers.find((provider) => { return provider._id === id  });
            if (provider) { return provider.name }
            return id;
        },
        clients(state) {
            return state.clients;
        },
        client(state) {
            return state.client;
        },        
        showClientCard(state) {
            return state.showClientCard;
        },
        clientsLoading(state) {
            return state.clientsLoading;
        },
        providersLoading(state) {
            return state.providersLoading;
        },
    },
    mutations: {
        setError(state, message) {
            state.error = message;           
        },
        /*--- Providers ---*/
        async getProviders(state) {
            state.error = "";
            state.providersLoading = true;
            try {
                const providers = await ProvidersService.getProviders();
                state.providers = providers.map(provider => ({
                    _id: provider._id,
                    name: provider.name,
                    newName: provider.name,
                    readonly: true,
                    checked: false
                }));
                state.providersLoading = false;
            } catch(err) {
                state.error = err.message || "Wooops! Something gone wrong while gettings providers. Keep calm and try again later...";
                //state.error = err.message;
                state.providersLoading = false;
            }
        },
        async addProvider(state, name) {
            state.error = "";
            try {        
                if (state.providers.length == 0) {
                    state.providers = await ProvidersService.getProviders(); // need if server dosn't work when page load at a first time, but then server started and we need to reload data  
                }
                const providersResponse = await ProvidersService.createProvider(name);
                const provider = {
                    _id: providersResponse.message,
                    name: name,
                    newName: name,
                    readonly: true,
                    checked: false
                }
                state.providers.push(provider);
            } catch(err) {
                state.error = err.message || "Wooops! Something gone wrong while creating provider. Keep calm and try again later...";
                //state.error = err.message;
            }
        },
        async deleteProvider(state, index) {
            state.error = "";
            try {
                await ProvidersService.deleteProvider(state.providers[index]._id);
                state.providers.splice(index, 1);
            } catch(err) {
                state.error = err.message || "Wooops! Something gone wrong while deleting provider. Keep calm and try again later...";
                //state.error = err.message;
            }
        },
        editProvider(state, index) {
            state.providers[index].readonly = false;
        },
        async saveProvider(state, index) {
            state.error = "";
            try {
                await ProvidersService.updateProvider(state.providers[index]._id, state.providers[index].newName);
                state.providers[index].name = state.providers[index].newName;
                state.providers[index].readonly = true;                
            } catch(err) {
                state.error = err.message || "Wooops! Something gone wrong while saving provider. Keep calm and try again later...";
                //state.error = err.message;
            }
        },
        async undoSaveProvider(state, index) {
            state.error = "";
            state.providers[index].newName = state.providers[index].name;
            state.providers[index].readonly = true;
        },
        toggleProvider(state, index) {
            state.providers[index].checked = !state.providers[index].checked;
        },
        /*--- Clients ---*/
        async getClients(state) {
            state.error = "";
            state.clientsLoading = true;
            try {
                state.clients = await ClientsService.getClients();
                state.clientsLoading = false;
            } catch(err) {
                state.error = err.message || "Wooops! Something gone wrong while gettings clients. Keep calm and try again later...";
                //state.error = err.message;
                state.clientsLoading = false;
            }
        },        
        async addClient(state) {
            state.error = "";
            try {        
                if (state.clients.length == 0) {
                    state.clients = await ClientsService.getClients(); // need if server dosn't work when page load at a first time, but then server started and we need to reload data  
                }
                state.client.providers = state.providers.filter((provider) => { return provider.checked  }).map((provider) => {return provider._id});

                const clientsResponse = await ClientsService.createClient(state.client);
                const client = {
                    _id: clientsResponse.message,
                    name: state.client.name,
                    email: state.client.email,
                    phone: state.client.phone,
                    providers: state.client.providers
                }
                state.clients.push(client);

                state.showClientCard = false;
            } catch(err) {
                state.error = err.message || "Wooops! Something gone wrong while creating client. Keep calm and try again later...";
                //state.error = err.message;
                state.showClientCard = true;
            }
        },
        async deleteClient(state) {
            state.error = "";
            try {
                await ClientsService.deleteClient(state.client._id);
                const index = state.clients.findIndex((client) => { return client._id === state.client._id })
                state.clients.splice(index, 1);
                state.showClientCard = false;                
            } catch(err) {
                state.error = err.message || "Wooops! Something gone wrong while deleting client. Keep calm and try again later...";
                //state.error = err.message;
            }
        },        
        editClient(state, index) {
            state.error = "";

            state.client._id = state.clients[index]._id;
            state.client.name = state.clients[index].name;
            state.client.email = state.clients[index].email;
            state.client.phone = state.clients[index].phone;
            state.client.providers = state.clients[index].providers;

            state.providers = state.providers.map(provider => ({
                _id: provider._id,
                name: provider.name,
                newName: provider.name,
                readonly: true,
                checked: state.client.providers.includes(provider._id)
            }));

            state.showClientCard = true;           
        },
        async createClient(state) {
            state.error = "";
            try {
                if (state.providers.length == 0) {
                    state.providers = await ProvidersService.getProviders(); // need if server dosn't work when page load at a first time, but then server started and we need to reload data  
                }
                if (state.clients.length == 0) {
                    state.clients = await ClientsService.getClients(); // need if server dosn't work when page load at a first time, but then server started and we need to reload data  
                }

                state.client._id = -1;
                state.client.name = "";
                state.client.email = "";
                state.client.phone = "";
                state.client.providers = [];

                state.providers = state.providers.map(provider => ({
                    _id: provider._id,
                    name: provider.name,
                    newName: provider.name,
                    readonly: true,
                    checked: false
                }));
    
                state.showClientCard = true;     
            } catch(err) {
                state.error = err.message || "Wooops! Something gone wrong while creating client. Keep calm and try again later...";
                //state.error = err.message;
            }
       
        },             
        async saveClient(state) {
            state.error = "";
            try {
                state.client.providers = state.providers.filter((provider) => { return provider.checked  }).map((provider) => {return provider._id});

                await ClientsService.updateClient(state.client._id, state.client);

                const index = state.clients.findIndex((client) => { return client._id === state.client._id })
                state.clients[index]._id = state.client._id;
                state.clients[index].name = state.client.name;
                state.clients[index].email = state.client.email;
                state.clients[index].phone = state.client.phone;
                state.clients[index].providers = state.client.providers;

                state.showClientCard = false;
            } catch(err) {
                state.error = err.message || "Wooops! Something gone wrong while saving client. Keep calm and try again later...";
                //state.error = err.message;
                state.showClientCard = true; 
            }
        },
        undoSaveClient(state) {
            state.error = "";            
            state.showClientCard = false;            
        },   
    }
});