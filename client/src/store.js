import Vue from 'vue';
import Vuex from 'vuex';

import ProvidersService from './ProvidersService';
import ClientsService from './ClientsService';

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        error: '',
        /*--- Providers ---*/
        providersIsLoading: true,
        providers: [],
        newProvider: {
            _id: "",
            name: ""
        },
        /*--- Clients ---*/
        clientsIsLoading: true,
        clients: [], 
        newClient: {
            _id: "",
            name: "",
            email: "",
            phone: "",
            providers: []
        },
        newClientHidden: true
    },
    getters: {
        ERROR(state) {
            return state.error;
        },
        /*--- Providers ---*/
        PROVIDERS_IS_LOADING(state) {
            return state.providersIsLoading;
        },
        PROVIDERS(state) {
            return state.providers;
        },
        NEW_PROVIDER(state) {
            return state.newProvider;
        },
        /*--- Clients ---*/
        CLIENTS_IS_LOADING(state) {
            return state.clientsIsLoading;
        },
        CLIENTS(state) {
            return state.clients;
        },
        NEW_CLIENT(state) {
            return state.newClient;
        },        
        NEW_CLIENT_HIDDEN(state) {
            return state.newClientHidden;
        }        
    },
    mutations: {
        SET_ERROR(state, message) {
            state.error = message;           
        },
        /*--- Providers ---*/
        SET_PROVIDERS_IS_LOADING(state, isLoading) {
            state.providersIsLoading = isLoading;          
        },
        SET_PROVIDERS(state, providers) {
            state.providers = providers.map(provider => ({
                _id: provider._id,
                name: provider.name,
                newName: provider.name,
                readonly: true,
                checked: false
            }));
        },
        SET_NEW_PROVIDER(state, provider) {
            state.newProvider = provider;
        },
        ADD_PROVIDER(state, provider) {
            const mapedProvider = {
                _id: provider._id,
                name: provider.name,
                newName: provider.name,
                readonly: true,
                checked: false
            }
            state.providers.push(mapedProvider);
        },
        DEL_PROVIDER(state, index) {
            state.providers.splice(index, 1);
        },
        TOGGLE_PROVIDER_READONLY(state, index) {
            state.providers[index].readonly = !state.providers[index].readonly;
        },
        TOGGLE_PROVIDER_CHECKED(state, index) {
            state.providers[index].checked = !state.providers[index].checked;
        },
        SAVE_PROVIDER_NAME(state, index) {
            state.providers[index].name = state.providers[index].newName;
        },
        RESET_PROVIDER_NEWNAME(state, index) {
            state.providers[index].newName = state.providers[index].name;
        },
        SET_PROVIDERS_STATUS_FOR_NEW_CLIENT(state) {
            const clientProviders = state.newClient.providers;
            state.providers = state.providers.map(provider => ({
                _id: provider._id,
                name: provider.name,
                newName: provider.name,
                readonly: true,
                checked: clientProviders.includes(provider._id)
            }));
        },
        /*--- Clients ---*/
        SET_CLIENTS_IS_LOADING(state, isLoading) {
            state.clientsIsLoading = isLoading;          
        },
        SET_CLIENTS(state, clients) {
            state.clients = clients;
        },
        SET_NEW_CLIENT(state, client) {
            state.newClient = client;
        },
        SET_NEW_CLIENT_HIDDEN(state, isHidden) {
            state.newClientHidden = isHidden;
        },
        DEL_CLIENT(state, id) {
            const index = state.clients.findIndex((client) => client._id === id);
            state.clients.splice(index, 1);
        },
        SAVE_NEW_CLIENT(state, client) {
            const index = state.clients.findIndex((c) => c._id === client._id);
            if (index == -1) {
                state.clients.push(client);
            } else {
                state.clients[index]._id = client._id;
                state.clients[index].name = client.name;
                state.clients[index].email = client.email;
                state.clients[index].phone = client.phone;
                state.clients[index].providers = client.providers;
            }            
        }   
    },
    actions: {
        SET_ERROR: (context, message) => {
            context.commit('SET_ERROR', message);
        },
        /*--- Providers ---*/
        SET_PROVIDERS: async (context) => {
            context.commit('SET_PROVIDERS_IS_LOADING', true);
            try {
                const providers = await ProvidersService.getProviders();
                context.commit('SET_PROVIDERS', providers);                
                context.commit('SET_PROVIDERS_IS_LOADING', false);
            } catch(err) {
                context.commit('SET_ERROR', err.message || "Wooops! Something gone wrong while gettings providers. Keep calm and try again later...");
                context.commit('SET_PROVIDERS_IS_LOADING', false);
            }
        },
        ADD_PROVIDER: async (context) => {
            try {
                const name = context.getters.NEW_PROVIDER.name.trim();
                const response = await ProvidersService.createProvider(name);
                const newProvider = {
                    _id: response.message,
                    name: name,
                };
                context.commit('ADD_PROVIDER', newProvider);
                const provider = {
                    _id: "",
                    name: ""
                }
                context.commit('SET_NEW_PROVIDER', provider);
            } catch(err) {
                context.commit('SET_ERROR', err.message || "Wooops! Something gone wrong while creating provider. Keep calm and try again later...");
            }
        },
        DEL_PROVIDER: async (context, index) => {
            try {
                const id = context.getters.PROVIDERS[index]._id;
                const response = await ProvidersService.deleteProvider(id);
                context.commit('DEL_PROVIDER', index);                
            } catch(err) {
                context.commit('SET_ERROR', err.message || "Wooops! Something gone wrong while deleting provider. Keep calm and try again later...");
            }
        },
        TOGGLE_PROVIDER_READONLY: (context, index) => {
            context.commit('TOGGLE_PROVIDER_READONLY', index);
        },
        TOGGLE_PROVIDER_CHECKED: (context, index) => {
            context.commit('TOGGLE_PROVIDER_CHECKED', index);
        },
        SAVE_PROVIDER: async (context, index) => {
            try {
                const id = context.getters.PROVIDERS[index]._id;
                const name = context.getters.PROVIDERS[index].newName.trim();
                const response = await ProvidersService.updateProvider(id, name);
                context.commit('SAVE_PROVIDER_NAME', index);
                context.commit('TOGGLE_PROVIDER_READONLY', index);
            } catch(err) {
                context.commit('SET_ERROR', err.message || "Wooops! Something gone wrong while saving provider. Keep calm and try again later...");
            }
        },
        UNDO_SAVE_PROVIDER: (context, index) => {
            context.commit('RESET_PROVIDER_NEWNAME', index);
            context.commit('TOGGLE_PROVIDER_READONLY', index);
        },
        SET_PROVIDERS_STATUS_FOR_NEW_CLIENT: (context) => {
            context.commit('SET_PROVIDERS_STATUS_FOR_NEW_CLIENT');
        },
        /*--- Clients ---*/
        SET_CLIENTS: async (context) => {
            context.commit('SET_CLIENTS_IS_LOADING', true);
            try {
                const clients = await ClientsService.getClients();
                context.commit('SET_CLIENTS', clients);                
                context.commit('SET_CLIENTS_IS_LOADING', false);
            } catch(err) {
                context.commit('SET_ERROR', err.message || "Wooops! Something gone wrong while gettings clients. Keep calm and try again later...");
                context.commit('SET_CLIENTS_IS_LOADING', false);
            }
        },
        SET_NEW_CLIENT: (context, index) => {
            let client;
            if (index == -1) {
                // Create new client
                client = {
                    _id: -1,
                    name: "",
                    email: "",
                    phone: "",
                    providers: []
                }
            } else {
                // Edit client
                client = {
                    _id: context.getters.CLIENTS[index]._id,
                    name: context.getters.CLIENTS[index].name,
                    email: context.getters.CLIENTS[index].email,
                    phone: context.getters.CLIENTS[index].phone,
                    providers: context.getters.CLIENTS[index].providers
                }
            }
            context.commit('SET_NEW_CLIENT', client);
        },
        SET_NEW_CLIENT_HIDDEN: (context, isHidden) => {
            context.commit('SET_NEW_CLIENT_HIDDEN', isHidden);
        },
        DEL_CLIENT: async (context, id) => {
            try {
                const response = await ClientsService.deleteClient(id);
                context.commit('DEL_CLIENT', id);
                context.commit('SET_NEW_CLIENT_HIDDEN', true);                
            } catch(err) {
                context.commit('SET_ERROR', err.message || "Wooops! Something gone wrong while deleting client. Keep calm and try again later...");
            }
        },
        SAVE_NEW_CLIENT: async (context) => {
            try {
                const client = context.getters.NEW_CLIENT;
                client.name = client.name.trim();
                client.phone = client.phone.replace(/-/g, "").replace(/_/g, "");
                client.providers = context.getters.PROVIDERS.filter(provider => provider.checked).map(provider => provider._id);
                if (client._id == -1) {
                    const response = await ClientsService.createClient(client);
                    client._id = response.message;
                }
                else {
                    const response = await ClientsService.updateClient(client._id, client);
                }                
                context.commit('SAVE_NEW_CLIENT', client);
                context.commit('SET_NEW_CLIENT_HIDDEN', true);             
            } catch(err) {
                context.commit('SET_ERROR', err.message || "Wooops! Something gone wrong while deleting client. Keep calm and try again later...");
            }
        },
    }
});