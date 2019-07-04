const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Client = require("../../../models/client");
const Provider = require("../../../models/provider");

// Get all Clients
router.get("/", async (req, res, next) => {
    await Client.find()
        .select('_id name email phone providers')
        .exec()
        .then(result => {
            res.status(200).json({ clients: result });
        })
        .catch(err => {
            res.status(500).json({ message: err.message });
        });
});

// Create Client
router.post("/", async (req, res, next) => {
    // TODO: Optimize provider find code
    // TODO: Catch if there is equals providerId
    const errors = [];
    for (const id of req.body.providers) {
        await Provider.findById(id)
            .then(provider => {
                if (!provider) {
                    errors.push(`Provider with ID ${id} not found`);
                }
            })
            .catch(err => {
                errors.push(err.message);
            });
    }
    if (errors.length > 0) {
        return res.status(404).json({ message: JSON.stringify(errors) });
    }
    const client = new Client({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        providers: req.body.providers
    });
    await client
        .save()
        .then(result => {
            res.status(201).json({ message: result._id });
        })
        .catch(err => {
            res.status(500).json({ message: err.message });
        });
});

// Get Client by ID
router.get("/:clientId", async (req, res, next) => {
    const id = req.params.clientId;
    await Client.findById(id)
        .select('_id name email phone providers')
        .exec()
        .then(result => {
            if (result) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ message: `Client with ID ${id} not found` });
            }
        })
        .catch(err => {
            res.status(500).json({ message: err.message });
        });
});

// Update Client by ID
router.patch("/:clientId", async (req, res, next) => {
    // TODO: Optimize provider find code
    // TODO: Catch if there is equals providerId
    const errors = [];
    for (const id of req.body.providers) {
        await Provider.findById(id)
            .then(provider => {
                if (!provider) {
                    errors.push(`Provider with ID ${id} not found`);
                }
            })
            .catch(err => {
                errors.push(err.message);
            });
    }
    if (errors.length > 0) {
        return res.status(404).json({ message: JSON.stringify(errors) });
    }
    const id = req.params.clientId;
    /*
    const updateOps = {};
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    await Client.updateOne({ _id: id }, { $set: updateOps })
    */
    await Client.updateOne({ _id: id }, { $set: { 
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone,
        providers: req.body.providers 
    } })
        .exec()
        .then(result => {
            if (result.n > 0) {
                res.status(200).json({ message: `Client with ID ${id} is updated` });
            } else {
                res.status(404).json({ message: `Client with ID ${id} not found` });
            } 
        })
        .catch(err => {
            res.status(500).json({ message: err.message });
        });
});

// Delete Client by ID
router.delete("/:clientId", async (req, res, next) => {
    const id = req.params.clientId;
    await Client.deleteOne({ _id: id })
        .exec()
        .then(result => {
            if (result.deletedCount > 0) {
                res.status(200).json({ message: `Client with ID ${id} is deleted` });
            } else {
                res.status(404).json({ message: `Client with ID ${id} not found` });
            }
        })
        .catch(err => {
            res.status(500).json({ message: err.message });
        });
});

module.exports = router;