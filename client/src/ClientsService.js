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
    static createClient(client) {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await axios.post(url, { 
                    name: client.name,
                    email: client.email,
                    phone: client.phone,
                    providers: client.providers
                });
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
    static updateClient(id, client) {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await axios.patch(`${url}${id}`, { 
                    name: client.name,
                    email: client.email,
                    phone: client.phone,
                    providers: client.providers
                });
                const data = res.data;
                resolve(data);
            } catch(err) {
                reject(err);
            }
        });
    }

    // Delete Client by ID
    static deleteClient(id) {
        return new Promise(async (resolve, reject) => {
            try {
                const res = await axios.delete(`${url}${id}`);
                const data = res.data;
                resolve(data);
            } catch(err) {
                reject(err);
            }
        });
    }
}

export default ClientsService;