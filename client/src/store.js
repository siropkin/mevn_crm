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
        client: {
            _id: "",
            name: "",
            email: "",
            phohe: 0,
            providers: []
        },
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
            return state.client;
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
        /*
        getProvidersNames(state, ids) {
            const names = "";
            ids.forEach(id => {
                const provider = ProviderService.getProvider(id);
                names = `${names}, ${provider.name}`;
            });
            return names;
        }
        */
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
                    readonly: true
                }));
            } catch(err) {
                state.error = `Wooops! Something gone wrong while gettings providers. Keep calm and try again later... \n ERR:${err.message}`;
            }
        },
        async createProvider(state) {
            //TODO: Work with "name" papam, not with state.newProviderName
            state.error = "";
            if (state.newProviderName !== "") {
                try {        
                    if (state.providers.length == 0) {
                        state.providers = await ProvidersService.getProviders(); // need if server dosn't work when page load at a first time, but then server started and we need to reload data  
                    }
                    const createProviderResponse = await ProvidersService.createProvider(state.newProviderName);
                    const provider = {
                        _id: createProviderResponse.message,
                        name: state.newProviderName,
                        readonly: true
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
        async updateProvider(state, index) {
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
        async getClients(state) {
            state.error = "";
            try {
                const clients = await ClientsService.getClients();
                state.clients = clients.map(client => ({
                    ...client,
                    providersString: "TODO"//$store.getters.getProvidersNames(state, client.providers)
                }));
            } catch(err) {
                state.error = `Wooops! Something gone wrong while gettings clients. Keep calm and try again later... \n ERR:${err.message}`;
            }
        },
        editClient(state, index) {
            state.showClient = true;
            state.client = state.clients[index];
        },
        undoSaveClient(state, index) {
            state.showClient = false;
        },
    }
});