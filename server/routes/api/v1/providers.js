const router = require("express").Router();

const Providers = require("../../../services/providers");
const Clients = require("../../../services/clients");

// Get all Providers
router.get("/", async (req, res, next) => {
    try {
        const result = await Providers.getProviders();
        res.status(200).json({ providers: result });
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
});

// Create Provider
router.post("/", async (req, res, next) => {
    const name = req.body.name;
    try {
        const result = await Providers.createProvider(name);
        res.status(201).json({ message: result._id });
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
});

// Get Provider by ID
router.get("/:providerId", async (req, res, next) => {
    const id = req.params.providerId;
    try {
        const result = await Providers.getProvider(id);
        if (result) {
            res.status(200).json(result);
        } else {
            res.status(404).json({ message: `Provider with ID ${id} not found.` });
        }        
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
});

// Update Provider by ID
router.patch("/:providerId", async (req, res, next) => {
    const id = req.params.providerId;
    const name = req.body.name;
    try {
        const result = await Providers.updateProvider(id, name);
        if (result) {
            res.status(200).json({ message: `Provider with ID ${id} is updated.` });
        } else {
            res.status(404).json({ message: `Provider with ID ${id} not found.` });
        }
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
});

// Delete Provider by ID
router.delete("/:providerId", async (req, res, next) => {
    const id = req.params.providerId;
    try {
        const clients = await Clients.getClientsByProviderId(id);
        if (clients.length == 0) {
            const result = await Providers.deleteProvider(id);
            if (result.deletedCount > 0) {
                res.status(200).json({ message: `Provider with ID ${id} is deleted.` });
            } else {
                res.status(404).json({ message: `Provider with ID ${id} not found.` });
            }
        } else {
            res.status(500).json({ message: `Provider with ID ${id} is using in clients and can't be deleted.` });
        }
    } catch(err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;