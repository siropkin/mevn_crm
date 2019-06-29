import Vue from 'vue';
import Vuex from 'vuex';

import ProviderService from './ProviderService';

Vue.use(Vuex);

export const store = new Vuex.Store({
    state: {
        providers: [],
        error: '',
        newProviderName: ''
    },
    getters: {
        providers(state) {
            return state.providers;
        },
        error(state) {
            return state.error;
        },
        newProviderName(state) {
            return state.newProviderName;
        }
    },
    mutations: {
        newProviderName (state, value) {
            state.newProviderName = value
        },
        async getProviders(state) {
            state.error = "";
            try {
                state.providers = await ProviderService.getProviders();
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
                        state.providers = await ProviderService.getProviders(); // need if server dosn't work when page load at a first time, but then server started and we need to reload data  
                    }
                    const createProviderResponse = await ProviderService.createProvider(state.newProviderName);
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
                await ProviderService.deleteProvider(state.providers[index]._id);
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
                await ProviderService.updateProvider(state.providers[index]._id, state.providers[index].name);
                state.providers[index].readonly = true;
            } catch(err) {
                state.error = `Wooops! Something gone wrong while saving provider. Keep calm and try again later... \n ERR:${err.message}`;
            }
          },
          async undoSaveProvider(state, index) {
            // TODO: Optimize undo saving: don't get provider from DB, save prev value
            state.error = "";
            try {
                const oldProvider = await ProviderService.getProvider(state.providers[index]._id)
                state.providers[index].name = oldProvider.name;
                state.providers[index].readonly = true;
            } catch(err) {
                state.error = `Wooops! Something gone wrong while undo saving provider. Keep calm and try again later... \n ERR:${err.message}`;
            }
          }
    }
});