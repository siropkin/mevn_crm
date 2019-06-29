import axios from 'axios';

const url = 'http://localhost:5000/api/clients/';

class ClientsService {
    // Get all Clients
    static getClients() {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await axios.get(url);
                const data = res.data;
                resolve(data.clients);
            } catch(err) {
                reject(err);
            }
        });
    }

    // Create Client
    static createClient(name, email, phone, providers) {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await axios.post(url, { name, email, phone, providers });
                const data = res.data;
                resolve(data);
            } catch(err) {
                reject(err);
            }
        });
    }

    // Get Client by ID
    static getClient(id) {
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

    // Update Client by ID
    static updateClient(id, name, email, phone, providers) {
        // TODO: Check if param dont exist or empty
        return axios.patch(`${url}${id}`, { name, email, phone, providers });
    }

    // Delete Client by ID
    static deleteClient(id) {
        return axios.delete(`${url}${id}`)
    }
}

export default ClientsService;