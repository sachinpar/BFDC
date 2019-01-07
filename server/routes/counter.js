const express = require('express');
const router = express.Router();
const MongoClient = require('mongodb').MongoClient;

// Connect
const connection = (closure) => {
    return MongoClient.connect('mongodb://localhost:27017', (err, client) => {
        if (err) return console.log(err);

        var db = client.db('BFDC');

        closure(db);
    });
};

// Error handling
const sendError = (err, res) => {
    response.status = 501;
    response.message = typeof err == 'object' ? err.message : err;
    res.status(501).json(response);
};

// Response handling
let response = {
    status: 200,
    data: [],
    message: null
};

// Get counters
router.get('', (req, res) => {
    connection((db) => {
        db.collection('Counter')
            .find()
            .toArray()
            .then((items) => {
                response.data = items;
                response.message = "Success";
                response.status = 200;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
});

// Get counter
router.get('/:id', (req, res) => {
    connection((db) => {
        db.collection('Counter')
            .find({"_id": req.params.id})
            .toArray()
            .then((items) => {
                response.status = 200;
                response.message = "Success";
                response.data = items;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
});

// Add counter
router.post('/add', (req, res) => {
    let counter = { 
                "_id": req.body.name,
                "sequence_value": Number(req.body.value)
            };
    connection((db)=>{
        db.collection('Counter')
            .insertOne(counter)
            .then((resp) => {
                console.log(resp.insertedCount + " documents inserted successfully");
                response.status = 200;
                response.message = resp.insertedCount + " records inserted";
                response.data = resp;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
});

// Increment sequence number
router.put('/increment', (req, res) => {
    let filter = {
        "_id": req.body.id
    };
    let increment = { 
                $inc: {
                    "sequence_value": 1
                }
            };
    let updateOptions = {
        "upsert": "true"
    }
    connection((db)=>{
        db.collection('Counter')
            .updateOne(filter, increment, updateOptions)
            .then((counters) =>{
                response.status = 200;
                response.data = counters;
                response.message = "Successfully updated";
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
});

module.exports = router;