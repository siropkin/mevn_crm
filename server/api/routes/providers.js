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
*                   description: successful operation
*               '500':
*                   description: error using this operation
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
*               '500':
*                   description: error using this operation
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
*               '404':
*                   description: item with this ID not found
*               '500':
*                   description: error using this operation
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
*               '404':
*                   description: item with this ID not found
*               '500':
*                   description: error using this operation
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
*/

const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");

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
            res.status(500).json(err);
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
            res.status(201).json({ message: `Provider is created with ID ${result._id}` });
        })
        .catch(err => {
            res.status(500).json(err);
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
            res.status(500).json(err);
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
            res.status(500).json(err);
        });
});

// Delete Provider by ID
router.delete("/:providerId", async (req, res, next) => {
    const id = req.params.providerId;
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
            res.status(500).json(err);
        });
});

module.exports = router;