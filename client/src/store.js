// TODO: Make error messages more readebl

import Vue from 'vue';
import Vuex from 'vuex';

import ProvidersService from './ProvidersService';
import ClientsService from './ClientsService';

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        error: '',
        providers: [],
        clients: [],        
        newProviderName: '',
        newClient: {
            _id: "",
            name: "",
            email: "",
            phone: 0,
            providers: []
        },
        newClientIndex: -1,
        showClient: false
    },
    getters: {
        providers(state) {
            return state.providers;
        },
        clients(state) {
            return state.clients;
        },
        client(state) {
            return state.newClient;
        },
        error(state) {
            return state.error;
        },
        newProviderName(state) {
            return state.newProviderName;
        },
        showClient(state) {
            return state.showClient;
        },
        newClientIndex(state) {
            return state.newClientIndex;
        },        
        getProviderNameById: state => id => {
            const provider = state.providers.find((provider) => { return provider._id === id  });
            if (provider) {
                return provider.name
            } else {
                return id;
            }
        }
    },
    mutations: {
        newProviderName (state, value) {
            state.newProviderName = value
        },
        async getProviders(state) {
            state.error = "";
            try {
                const providers = await ProvidersService.getProviders();
                state.providers = providers.map(provider => ({
                    ...provider,
                    readonly: true,
                    checked: state.newClient.providers.includes(provider._id)
                }));
            } catch(err) {
                state.error = `Wooops! Something gone wrong while gettings providers. Keep calm and try again later... \n ERR:${err.message}`;
            }
        },
        async addProvider(state) {
            //TODO: Work with "name" papam, not with state.newProviderName
            state.error = "";
            if (state.newProviderName !== "") {
                try {        
                    if (state.providers.length == 0) {
                        state.providers = await ProvidersService.getProviders(); // need if server dosn't work when page load at a first time, but then server started and we need to reload data  
                    }
                    const providersResponse = await ProvidersService.createProvider(state.newProviderName);
                    const provider = {
                        _id: providersResponse.message,
                        name: state.newProviderName,
                        readonly: true,
                        checked: false
                    }
                    state.providers.push(provider);
                    state.newProviderName = "";
                    } catch(err) {
                        state.error = `Wooops! Something gone wrong while creating provider. Keep calm and try again later... \n ERR:${err.message}`;
                    }
            } else {
                state.error = `Please enter provider name`;
            }
        },
        async deleteProvider(state, index) {
            state.error = "";
            try {
                await ProvidersService.deleteProvider(state.providers[index]._id);
                state.providers.splice(index, 1);
            } catch(err) {
                state.error = `Wooops! Something gone wrong while deleting provider. Keep calm and try again later... \n ERR:${err.message}`;
            }
        },
        editProvider(state, index) {
            state.providers[index].readonly = false;
        },
        async saveProvider(state, index) {
            state.error = "";
            try {
                await ProvidersService.updateProvider(state.providers[index]._id, state.providers[index].name);
                state.providers[index].readonly = true;
            } catch(err) {
                state.error = `Wooops! Something gone wrong while saving provider. Keep calm and try again later... \n ERR:${err.message}`;
            }
        },
        async undoSaveProvider(state, index) {
            // TODO: Optimize undo saving: don't get provider from DB, save prev value
            state.error = "";
            try {
                const oldProvider = await ProvidersService.getProvider(state.providers[index]._id)
                state.providers[index].name = oldProvider.name;
                state.providers[index].readonly = true;
            } catch(err) {
                state.error = `Wooops! Something gone wrong while undo saving provider. Keep calm and try again later... \n ERR:${err.message}`;
            }
        },
        toggleProvider(state, index) {
            state.providers[index].checked = !state.providers[index].checked;
        },
        async getClients(state) {
            state.error = "";
            try {
                const clients = await ClientsService.getClients();
                state.clients = clients.map(client => ({
                    ...client,
                    //providersString: client.providers//$store.getters.getProvidersNames(state, client.providers)
                }));
            } catch(err) {
                state.error = `Wooops! Something gone wrong while gettings clients. Keep calm and try again later... \n ERR:${err.message}`;
            }
        },
        editClient(state, index) {
            state.newClient._id = state.clients[index]._id;
            state.newClient.name = state.clients[index].name;
            state.newClient.email = state.clients[index].email;
            state.newClient.phone = state.clients[index].phone;
            state.newClient.providers = state.clients[index].providers;

            state.newClientIndex = index;
            state.showClient = true;            
        },
        createClient(state) {
            state.newClient._id = "";
            state.newClient.name = "";
            state.newClient.email = "";
            state.newClient.phone = 0;
            state.newClient.providers = [];

            state.newClientIndex = -1;
            state.showClient = true;            
        },
        undoSaveClient(state) {
            state.newClientIndex = -1;
            state.showClient = false;            
        },
        async deleteClient(state) {
            state.error = "";
            try {
                const index = state.newClientIndex;

                await ClientsService.deleteClient(state.clients[index]._id);
                state.clients.splice(index, 1);
                state.newClientIndex = -1;
                state.showClient = false;                
            } catch(err) {
                state.error = `Wooops! Something gone wrong while deleting client. Keep calm and try again later... \n ERR:${err.message}`;
            }
        },
        async saveClient(state) {
            state.error = "";
            try {
                const index = state.newClientIndex;

                state.newClient.providers = state.providers.filter((provider) => { return provider.checked  }).map((provider) => {return provider._id});

                await ClientsService.updateClient(state.newClient._id, state.newClient);

                state.clients[index]._id = state.newClient._id;
                state.clients[index].name = state.newClient.name;
                state.clients[index].email = state.newClient.email;
                state.clients[index].phone = state.newClient.phone;
                state.clients[index].providers = state.newClient.providers;

                state.newClientIndex = -1;
                state.showClient = false;
            } catch(err) {
                state.error = `Wooops! Something gone wrong while saving client. Keep calm and try again later... \n ERR:${err.message}`;
            }
        },
        async addClient(state) {
            state.error = "";
            if (state.newClient.name !== "") {
                try {        
                    if (state.clients.length == 0) {
                        state.clients = await ClientsService.getClients(); // need if server dosn't work when page load at a first time, but then server started and we need to reload data  
                    }
                    state.newClient.providers = state.providers.filter((provider) => { return provider.checked  }).map((provider) => {return provider._id});

                    const clientsResponse = await ClientsService.createClient(state.newClient);
                    const client = {
                        _id: clientsResponse.message,
                        name: state.newClient.name,
                        email: state.newClient.email,
                        phone: state.newClient.phone,
                        providers: state.newClient.providers
                    }
                    state.clients.push(client);

                    state.newClientIndex = -1;
                    state.showClient = false;
                    } catch(err) {
                        state.error = `Wooops! Something gone wrong while creating client. Keep calm and try again later... \n ERR:${err.message}`;
                    }
            } else {
                state.error = `Please enter client name`;
            }
        },
    }
});