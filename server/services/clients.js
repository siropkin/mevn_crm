const mongoose = require("mongoose");
const Client = require("../models/client");

module.exports = {
    // Get all Clients
    getClients: () => {
        return Client.find().select('_id name email phone providers').exec();
    },
    // Get all Clients by ProviderID
    getClientsByProviderId: (providerId) => {
        return Client.find({ 'providers': providerId }).select('_id name').exec();
    },    
    // Create Client
    createClient: (name, email, phone, providers) => {
        const client = new Client({
            _id: new mongoose.Types.ObjectId(),
            name,
            email,
            phone,
            providers
        });
        return client.save();
    },      
    // Get Client by ID
    getClient: (id) => {
        return Client.findById(id).select('_id name email phone providers').exec();
    },         
    // Update Client by ID
    updateClient: (id, name, email, phone, providers) => {
        return Client.updateOne({ _id: id }, { $set: { 
            name,
            email,
            phone,
            providers
        } });
    },
    // Delete Client by ID
    deleteClient: (id) => {
        return Client.deleteOne({ _id: id }).exec();
    }
}