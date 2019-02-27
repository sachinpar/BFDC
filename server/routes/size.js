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

// Get sizes
router.get('', (req, res) => {
    connection((db) => {
        db.collection('Sizes')
            .find()
            .toArray()
            .then((products) => {
                response.message = "Success";
                response.status = 200;
                response.data = products;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
});

// Get size
router.get('/:id', (req, res) => {
    let query = {
        "_id": Number(req.params.id)
    };
    connection((db) => {
        db.collection('Sizes')
            .findOne(query)
            .then((products) => {
                response.message = "Success";
                response.status = 200;
                response.data = products;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
});

//Get sizes by product_id
router.get('/product/:id', (req, res) => {
    let query = {
        "product_id": Number(req.params.id)
    };
    connection((db) => {
        db.collection('Sizes')
            .find(query)
            .then((products) => {
                response.message = "Success";
                response.status = 200;
                response.data = products;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
});

module.exports = router;