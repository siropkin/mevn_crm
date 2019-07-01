// TODO: Make error messages more readebl

import Vue from 'vue';
import Vuex from 'vuex';

import ProvidersService from './ProvidersService';
import ClientsService from './ClientsService';

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        error: '',
        clientsLoading: true,
        clients: [],
        providersForClients: [],
        client: {
            _id: "",
            name: "",
            email: "",
            phone: 0,
            providers: []
        },
        providersForClient: [],
        showClientCard: false,                       
        provider: {
            _id: "",
            name: ""
        }     
    },
    getters: {
        error(state) {
            return state.error;
        },
        clientsLoading(state) {
            return state.clientsLoading;
        },
        providersForClient(state) {
            return state.providersForClient;
        },
        providersForClients(state) {
            return state.providersForClients;
        },
        provider(state) {
            return state.provider;
        },        
        getProviderNameByIdForClientsList: state => id => {
            const provider = state.providersForClients.find((provider) => { return provider._id === id  });
            if (provider) {
                return provider.name
            } else {
                return id;
            }
        },
        clients(state) {
            return state.clients;
        },
        client(state) {
            return state.client;
        },        
        showClientCard(state) {
            return state.showClientCard;
        }
    },
    mutations: {
        setProviderName (state, value) {
            state.provider.name = value
        },
        async getProvidersForClientsList(state) {
            state.error = "";
            try {
                state.providersForClients = await ProvidersService.getProviders();
                /*
                const providersForClientsList = await ProvidersService.getProviders();
                state.providersForClients = providersForClientsList.map(provider => ({
                    ...provider
                }));
                */
            } catch(err) {
                state.error = `Wooops! Something gone wrong while gettings providers. Keep calm and try again later... \n ERR:${err.message}`;
            }
        },
        async getProvidersForClient(state) {
            state.error = "";
            try {
                const providers = await ProvidersService.getProviders();
                state.providersForClient = providers.map(provider => ({
                    ...provider,
                    readonly: true,
                    checked: state.client.providers.includes(provider._id)
                }));
            } catch(err) {
                state.error = `Wooops! Something gone wrong while gettings providers. Keep calm and try again later... \n ERR:${err.message}`;
            }
        },
        async addProvider(state) {
            //TODO: Work with "name" papam, not with state.newProviderName
            state.error = "";
            try {        
                if (state.providersForClient.length == 0) {
                    state.providersForClient = await ProvidersService.getProviders(); // need if server dosn't work when page load at a first time, but then server started and we need to reload data  
                }
                const providersResponse = await ProvidersService.createProvider(state.provider.name);
                const provider = {
                    _id: providersResponse.message,
                    name: state.provider.name,
                    readonly: true,
                    checked: false
                }
                state.providersForClient.push(provider);
                state.providersForClients.push(provider);
                state.provider.name = "";
            } catch(err) {
                state.error = `Wooops! Something gone wrong while creating provider. Keep calm and try again later... \n ERR:${err.message}`;
            }
        },
        async deleteProvider(state, index) {
            state.error = "";
            try {
                await ProvidersService.deleteProvider(state.providersForClient[index]._id);
                state.providersForClient.splice(index, 1);
            } catch(err) {
                state.error = `Wooops! Something gone wrong while deleting provider. Keep calm and try again later... \n ERR:${err.message}`;
            }
        },
        editProvider(state, index) {
            state.providersForClient[index].readonly = false;
        },
        async saveProvider(state, index) {
            state.error = "";
            try {
                await ProvidersService.updateProvider(state.providersForClient[index]._id, state.providersForClient[index].name);
                state.providersForClient[index].readonly = true;
                state.providersForClients[index].name = state.providersForClient[index].name;
            } catch(err) {
                state.error = `Wooops! Something gone wrong while saving provider. Keep calm and try again later... \n ERR:${err.message}`;
            }
        },
        async undoSaveProvider(state, index) {
            // TODO: Optimize undo saving: don't get provider from DB, save prev value
            state.error = "";
            try {
                const oldProvider = await ProvidersService.getProvider(state.providersForClient[index]._id)
                state.providersForClient[index].name = oldProvider.name;
                state.providersForClient[index].readonly = true;
            } catch(err) {
                state.error = `Wooops! Something gone wrong while undo saving provider. Keep calm and try again later... \n ERR:${err.message}`;
            }
        },
        toggleProvider(state, index) {
            state.providersForClient[index].checked = !state.providersForClient[index].checked;
        },
        async getClients(state) {
            state.error = "";
            state.clientsLoading = true;
            try {
                state.clients = await ClientsService.getClients();
                state.clientsLoading = false;
            } catch(err) {
                state.error = `Wooops! Something gone wrong while gettings clients. Keep calm and try again later... \n ERR:${err.message}`;
                state.clientsLoading = false;
            }
        },
        editClient(state, index) {
            state.error = "";
            
            state.providersForClient = [];

            state.client._id = state.clients[index]._id;
            state.client.name = state.clients[index].name;
            state.client.email = state.clients[index].email;
            state.client.phone = state.clients[index].phone;
            state.client.providers = state.clients[index].providers;

            state.showClientCard = true;           
        },
        async createClient(state) {
            state.error = "";
            try {
                if (state.providersForClients.length == 0) {
                    state.providersForClients = await ProvidersService.getProviders(); // need if server dosn't work when page load at a first time, but then server started and we need to reload data  
                }
                if (state.clients.length == 0) {
                    state.clients = await ClientsService.getClients(); // need if server dosn't work when page load at a first time, but then server started and we need to reload data  
                }

                state.providersForClient = [];

                state.client._id = -1;
                state.client.name = "";
                state.client.email = "";
                state.client.phone = 0;
                state.client.providers = [];
    
                state.showClientCard = true;     
            } catch(err) {
                state.error = `Wooops! Something gone wrong while creating client. Keep calm and try again later... \n ERR:${err.message}`;
            }
       
        },
        undoSaveClient(state) {
            state.error = "";            
            state.showClientCard = false;            
        },
        async deleteClient(state) {
            state.error = "";
            try {
                await ClientsService.deleteClient(state.client._id);
                const index = state.clients.findIndex((client) => { return client._id === state.client._id })
                state.clients.splice(index, 1);
                state.showClientCard = false;                
            } catch(err) {
                state.error = `Wooops! Something gone wrong while deleting client. Keep calm and try again later... \n ERR:${err.message}`;
            }
        },
        async saveClient(state) {
            state.error = "";
            try {
                state.client.providers = state.providersForClient.filter((provider) => { return provider.checked  }).map((provider) => {return provider._id});

                await ClientsService.updateClient(state.client._id, state.client);

                const index = state.clients.findIndex((client) => { return client._id === state.client._id })
                state.clients[index]._id = state.client._id;
                state.clients[index].name = state.client.name;
                state.clients[index].email = state.client.email;
                state.clients[index].phone = state.client.phone;
                state.clients[index].providers = state.client.providers;

                state.showClientCard = false;
            } catch(err) {
                state.error = `Wooops! Something gone wrong while saving client. Keep calm and try again later... \n ERR:${err.message}`;
            }
        },
        async addClient(state) {
            state.error = "";
            try {        
                if (state.clients.length == 0) {
                    state.clients = await ClientsService.getClients(); // need if server dosn't work when page load at a first time, but then server started and we need to reload data  
                }
                state.client.providers = state.providersForClient.filter((provider) => { return provider.checked  }).map((provider) => {return provider._id});

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
                state.error = `Wooops! Something gone wrong while creating client. Keep calm and try again later... \n ERR:${err.message}`;
            }
        },
    }
});