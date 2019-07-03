/**
* @swagger
* tags:
*   - name: providers
*     description: Access to Providers
* paths:
*   /providers:
*       get:
*           tags:
*               - providers
*           summary: Get all Providers
*           produces:
*               - application/json
*           responses:
*               '200':
*                   description: successful operation
*                   schema:
*                       $ref: '#/definitions/Providers'
*               '500':
*                   description: error using this operation
*                   schema:
*                       $ref: '#/definitions/ApiResponse'
*       post:
*           tags:
*               - providers
*           summary: Create Provider
*           consumes:
*               - application/json
*           produces:
*               - application/json
*           parameters:
*               - in: body
*                 name: body
*                 description: Provider object that needs to be added
*                 required: true
*                 schema:
*                   $ref: "#/definitions/Provider"
*           responses:
*               '201':
*                   description: successful operation (in responses will be ID of new object)
*                   schema:
*                       $ref: '#/definitions/ApiResponse'
*               '500':
*                   description: error using this operation
*                   schema:
*                       $ref: '#/definitions/ApiResponse'
*   /providers/{providerId}:
*       get:
*           tags:
*               - providers
*           summary: Get Provider by ID
*           consumes:
*               - application/json
*           produces:
*               - application/json
*           parameters:
*               - in: path
*                 name: providerId
*                 description: ID of provider to return
*                 required: true
*                 type: string
*           responses:
*               '200':
*                   description: successful operation
*                   schema:
*                       $ref: '#/definitions/Provider'
*               '404':
*                   description: item with this ID not found
*                   schema:
*                       $ref: '#/definitions/ApiResponse'
*               '500':
*                   description: error using this operation
*                   schema:
*                       $ref: '#/definitions/ApiResponse'
*       patch:
*           tags:
*               - providers
*           summary: Update Provider by ID
*           consumes:
*               - application/json
*           produces:
*               - application/json
*           parameters:
*               - in: path
*                 name: providerId
*                 description: ID of provider to update
*                 required: true
*                 type: string
*               - in: body
*                 name: body
*                 description: Provider object properties that needs to be updated
*                 required: true
*                 schema:
*                   $ref: "#/definitions/Provider"
*           responses:
*               '200':
*                   description: successful operation
*                   schema:
*                       $ref: '#/definitions/ApiResponse'
*               '404':
*                   description: item with this ID not found
*                   schema:
*                       $ref: '#/definitions/ApiResponse'
*               '500':
*                   description: error using this operation
*                   schema:
*                       $ref: '#/definitions/ApiResponse'
*       delete:
*           tags:
*               - providers
*           summary: Delete Provider by ID
*           consumes:
*               - application/json
*           produces:
*               - application/json
*           parameters:
*               - in: path
*                 name: providerId
*                 description: ID of provider to delete
*                 required: true
*                 type: string
*           responses:
*               '200':
*                   description: successful operation
*                   schema:
*                       $ref: '#/definitions/ApiResponse'
*               '404':
*                   description: item with this ID not found
*                   schema:
*                       $ref: '#/definitions/ApiResponse'
*               '500':
*                   description: error using this operation
*                   schema:
*                       $ref: '#/definitions/ApiResponse'
* definitions:
*   Provider:
*       type: object
*       properties:
*           _id:
*               type: string
*               readOnly: true
*           name:
*               type: string
*       required:
*           - name               
*   Providers:
*       type: object
*       properties:
*           providers:
*               type: array
*               items:
*                   $ref: '#/definitions/Provider'      
*   ApiResponse:
*       type: object
*       properties:
*           message:
*               type: string
*/

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

const Client = require("../models/client");
const Provider = require("../models/provider");

// Get all Providers
router.get("/", async (req, res, next) => {
    await Provider.find()
        .select('_id name')
        .exec()
        .then(result => {
            res.status(200).json({ providers: result });
        })
        .catch(err => {
            res.status(500).json({ message: err.message });
        });
});

// Create Provider
router.post("/", async (req, res, next) => {
    const provider = new Provider({
        _id: new mongoose.Types.ObjectId(),
        name: req.body.name
    });
    await provider
        .save()
        .then(result => {
            //res.status(201).json({ message: `Provider is created with ID ${result._id}` });
            res.status(201).json({ message: result._id });
        })
        .catch(err => {
            res.status(500).json({ message: err.message });
        });
});

// Get Provider by ID
router.get("/:providerId", async (req, res, next) => {
    const id = req.params.providerId;
    await Provider.findById(id)
        .select('_id name')
        .exec()
        .then(result => {
            if (result) {
                res.status(200).json(result);
            } else {
                res.status(404).json({ message: `Provider with ID ${id} not found` });
            }
        })
        .catch(err => {
            res.status(500).json({ message: err.message });
        });
});

// Update Provider by ID
router.patch("/:providerId", async (req, res, next) => {
    const id = req.params.providerId;
    /*
    const updateOps = {};    
    for (const ops of req.body) {
        updateOps[ops.propName] = ops.value;
    }
    await Provider.updateOne({ _id: id }, { $set: updateOps })
    */
    await Provider.updateOne({ _id: id }, { $set: { 
        name: req.body.name 
    } })
        .exec()
        .then(result => {
            if (result.n > 0) {
                res.status(200).json({ message: `Provider with ID ${id} is updated` });
            } else {
                res.status(404).json({ message: `Provider with ID ${id} not found` });
            }            
        })
        .catch(err => {
            res.status(500).json({ message: err.message });
        });
});

// Delete Provider by ID
router.delete("/:providerId", async (req, res, next) => {
    // TODO: Update info in Clients objects when Provider is deleted
    const id = req.params.providerId;
    
    await Client.find({ 'providers': id })
        .select('_id name')
        .exec()
        .then(result => {
            if (result.length > 0) {
                res.status(500).json({ message: `Provider with ID ${id} is using in clients and can't be deleted` });
            } else {
                Provider.deleteOne({ _id: id })
                    .exec()
                    .then(result => {
                        if (result.deletedCount > 0) {
                            res.status(200).json({ message: `Provider with ID ${id} is deleted` });
                        } else {
                            res.status(404).json({ message: `Provider with ID ${id} not found` });
                        }
                    })
                    .catch(err => {
                        res.status(500).json({ message: err.message });
                    });
            }
            
        })
        .catch(err => {
            res.status(500).json({ message: err.message });
        });
    /*
    await Provider.deleteOne({ _id: id })
        .exec()
        .then(result => {
            if (result.deletedCount > 0) {
                res.status(200).json({ message: `Provider with ID ${id} is deleted` });
            } else {
                res.status(404).json({ message: `Provider with ID ${id} not found` });
            }
        })
        .catch(err => {
            res.status(500).json({ message: err.message });
        });
    */
});

module.exports = router;