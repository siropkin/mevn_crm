const mongoose = require("mongoose");
const Provider = require("../models/provider");

module.exports = {
    // Get all Providers
    getProviders: () => {
        return Provider.find().select('_id name').exec();
    },
    // Create Provider
    createProvider: (name) => {
        const provider = new Provider({
            _id: new mongoose.Types.ObjectId(),
            name
        });
        return provider.save();
    },    
    // Get Provider by ID
    getProvider: (id) => {
        return Provider.findById(id).select('_id name').exec();
    },    
    // Update Provider by ID
    updateProvider: (id, name) => {
        return Provider.updateOne({ _id: id }, { $set: { 
            name
        } });
    },
    // Delete Provider by ID
    deleteProvider: (id) => {
        return Provider.deleteOne({ _id: id }).exec();
    }
}