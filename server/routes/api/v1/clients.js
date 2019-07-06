const router = require("express").Router();

const Providers = require("../../../services/providers");
const Clients = require("../../../services/clients");

const getUnique = (arr) => {
    return arr.filter((v, i, arr) => arr.indexOf(v) === i);
}

// Get all Clients
router.get("/", async (req, res, next) => {
    try {
        const result = await Clients.getClients();
        res.status(200).json({ clients: result });
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
});

// Create Client
router.post("/", async (req, res, next) => {
    const errors = [];

    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    let providers = req.body.providers;

    if (providers) {        
        try {
            providers = await getUnique(providers);
        } catch (error) {
            errors.push(error.message);
        }
        for (const id of providers) {
            const result = await Providers.getProvider(id);
            if (!result) {
                errors.push(`Provider with ID ${id} not found.`);
            }
        }
    }  
    if (errors.length == 0) {
        try {
            const result = await Clients.createClient(name, email, phone, providers);
            res.status(201).json({ message: result._id });
        } catch(err) {
            res.status(500).json({ message: err.message });
        }
    } else {
        res.status(500).json({ message: JSON.stringify(errors) });
    }
});

// Get Client by ID
router.get("/:clientId", async (req, res, next) => {
    const id = req.params.clientId;
    try {
        const result = await Clients.getClient(id);
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: `Client with ID ${id} not found.` });
        }        
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
});

// Update Client by ID
router.patch("/:clientId", async (req, res, next) => {
    const errors = [];

    const id = req.params.clientId;
    const name = req.body.name;
    const email = req.body.email;
    const phone = req.body.phone;
    let providers = req.body.providers;
    
    if (providers) {        
        try {
            providers = await getUnique(providers);
        } catch (error) {
            errors.push(error.message);
        }
        for (const id of providers) {
            const result = await Providers.getProvider(id);
            if (!result) {
                errors.push(`Provider with ID ${id} not found.`);
            }
        }
    }
    if (errors.length == 0) {
        try {
            const result = await Clients.updateClient(id, name, email, phone, providers);
            if (result) {
                res.status(200).json({ message: `Client with ID ${id} is updated.` });
            } else {
                res.status(404).json({ message: `Client with ID ${id} not found.` });
            }
        } catch(err) {
            res.status(500).json({ message: err.message });
        }
    } else {
        res.status(500).json({ message: JSON.stringify(errors) });
    }
});

// Delete Client by ID
router.delete("/:clientId", async (req, res, next) => {
    const id = req.params.clientId;
    try {
        const result = await Clients.deleteClient(id);
        if (result.deletedCount > 0) {
            res.status(200).json({ message: `Client with ID ${id} is deleted.` });
        } else {
            res.status(404).json({ message: `Client with ID ${id} not found.` });
        }
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;