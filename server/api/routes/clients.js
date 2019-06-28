/**
* @swagger
* tags:
*   - name: clients
*     description: Access to Clients
* paths:
*   /clients:
*       get:
*           tags:
*               - clients
*           summary: Get all Clients
*           produces:
*               - application/json
*           responses:
*               '200':
*                   description: successful operation
*                   schema:
*                       $ref: '#/definitions/Clients'
*               '500':
*                   description: error using this operation
*       post:
*           tags:
*               - clients
*           summary: Create Client
*           consumes:
*               - application/json
*           produces:
*               - application/json
*           parameters:
*               - in: body
*                 name: body
*                 description: Client object that needs to be added
*                 required: true
*                 schema:
*                   $ref: "#/definitions/Client"
*           responses:
*               '201':
*                   description: successful operation
*               '500':
*                   description: error using this operation
*   /clients/{clientId}:
*       get:
*           tags:
*               - clients
*           summary: Get Client by ID
*           consumes:
*               - application/json
*           produces:
*               - application/json
*           parameters:
*               - in: path
*                 name: clientId
*                 description: ID of client to return
*                 required: true
*                 type: string
*           responses:
*               '200':
*                   description: successful operation
*                   schema:
*                       $ref: '#/definitions/Client'
*               '404':
*                   description: item with this ID not found
*               '500':
*                   description: error using this operation
*       patch:
*           tags:
*               - clients
*           summary: Update Client by ID
*           consumes:
*               - application/json
*           produces:
*               - application/json
*           parameters:
*               - in: path
*                 name: clientId
*                 description: ID of client to update
*                 required: true
*                 type: string
*               - in: body
*                 name: body
*                 description: Client object properties that needs to be updated
*                 required: true
*                 schema:
*                   $ref: "#/definitions/Client"
*           responses:
*               '200':
*                   description: successful operation
*               '404':
*                   description: item with this ID not found
*               '500':
*                   description: error using this operation
*       delete:
*           tags:
*               - clients
*           summary: Delete Client by ID
*           consumes:
*               - application/json
*           produces:
*               - application/json
*           parameters:
*               - in: path
*                 name: clientId
*                 description: ID of client to delete
*                 required: true
*                 type: string
*           responses:
*               '200':
*                   description: successful operation
*               '404':
*                   description: item with this ID not found
*               '500':
*                   description: error using this operation
* definitions:
*   Client:
*       type: object
*       properties:
*           _id:
*               type: string
*               readOnly: true
*           name:
*               type: string
*           email:
*               type: string
*           phone:
*               type: integer
*           providers:
*               type: array
*               items:
*                   type: string
*       required:
*           - name               
*   Clients:
*       type: object
*       properties:
*           clients:
*               type: array
*               items:
*                   $ref: '#/definitions/Client'
*/

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Client = require("../models/client");
const Provider = require("../models/provider");

// Get all Clients
router.get("/", async (req, res, next) => {
    await Client.find()
        .select('_id name email phone providers')
        .exec()
        .then(result => {
            res.status(200).json(result);
        })
        .catch(err => {
            res.status(500).json(err);
        });
});

// Create Client
router.post("/", async (req, res, next) => {
    // TODO: Optimize provider find code
    // TODO: Catch if there is equals providerId
    const message = [];
    for (const provider of req.body.providers) {
        const id = provider._id;
        await Provider.findById(id)
            .then(provider => {
                if (!provider) {
                    message.push(`Provider with ID ${id} not found`);
                }
            })
            .catch(err => {
                message = err;
            });
    }
    if (message.length > 0) {
        return res.status(404).json({ message: JSON.stringify(message) });
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
            res.status(201).json({ message: `Client is created with ID ${result._id}` });
        })
        .catch(err => {
            res.status(500).json(err);
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
            res.status(500).json(err);
        });
});

// Update Client by ID
router.patch("/:clientId", async (req, res, next) => {
    // TODO: Add check if Provider exists
    // TODO: Catch if there is equals providerId
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
            res.status(500).json(err);
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
            res.status(500).json(err);
        });
});

module.exports = router;