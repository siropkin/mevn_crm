import axios from 'axios';

const url = 'api/providers/';

class ProvidersService {
    // Get all Providers
    static getProviders() {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await axios.get(url);
                const data = res.data;
                resolve(data.providers);
            } catch(err) {
                const { response } = err;
                reject(response.data);
            }
        });
    }

    // Create Provider
    static createProvider(name) {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await axios.post(url, { name });
                const data = res.data;
                resolve(data);
            } catch(err) {
                const { response } = err;
                reject(response.data);
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
                const { response } = err;
                reject(response.data);
            }
        });
    }

    // Update Provider by ID
    static updateProvider(id, name) {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await axios.patch(`${url}${id}`, { name });
                const data = res.data;
                resolve(data);
            } catch(err) {
                const { response } = err;
                reject(response.data);
            }
        });
    }

    // Delete Provider by ID
    static deleteProvider(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await axios.delete(`${url}${id}`);
                const data = res.data;
                resolve(data);
            } catch(err) {   
                const { response } = err;
                reject(response.data);
            }
        });
    }
}

export default ProvidersService;