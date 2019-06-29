import axios from 'axios';

const url = 'http://localhost:5000/api/providers/';

class ProviderService {
    // Get all Providers
    static getProviders() {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await axios.get(url);
                const data = res.data;
                resolve(data.providers.map(provider => ({
                    _id: provider._id,
                    name: provider.name,
                    readonly: true
                })));
            } catch(err) {
                reject(err);
            }
        });
    }

    // Create Provider
    static createProvider(name) {
        /*
        return axios.post(url, {
            name
        });
        */
        return new Promise(async (resolve, reject) => {
            try {
                const res = await axios.post(url, { name });
                const data = res.data;
                resolve(data);
            } catch(err) {
                reject(err);
            }
        });
    }

    // Get Provider by ID
    static getProvider(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await axios.get(`${url}${id}`);
                const data = res.data;
                resolve(data);
            } catch(err) {
                reject(err);
            }
        });
    }

    // Update Provider by ID
    static updateProvider(id, name) {
        return axios.patch(`${url}${id}`, {
            name
        });
    }

    // Delete Provider by ID
    static deleteProvider(id) {
        return axios.delete(`${url}${id}`)
    }
}

export default ProviderService;