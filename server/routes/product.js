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

// Get products
router.get('', (req, res) => {
    connection((db) => {
        db.collection('Product')
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

// Get product
router.get('/:id', (req, res) => {
    let query = {
        "_id": Number(req.params.id)
    };
    connection((db) => {
        db.collection('Product')
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

// Add products
router.post('/add', (req, res) => {
    let product = req.body.product;
    connection((db)=>{
        db.collection('Counter')
            .findOne({"_id": "product_id"})
            .then((products) => {
                product._id = Number(products.sequence_value) + 1;
                if(product._id > 0){
                    db.collection('Product')
                        .insertOne(product)
                        .then((resp) => {
                            console.log(resp.insertedCount + " documents inserted successfully");
                            response.message = resp.insertedCount + " records inserted";
                            response.data = resp;
                            res.json(response);
                            IncrementCounter();
                        })
                        .catch((err) => {
                            sendError(err, res);
                        });
                }
            })
            .catch((err) => {
                sendError(err, res);
            });
        
    });
});

// Delete product
router.delete('/delete/:id', (req, res) => {
    let query = { 
        "_id": Number(req.params.id)
    };
    connection((db)=>{
        db.collection('Product')
            .remove(query)
            .then((resp) => {
                //console.log(resp.insertedCount + " documents inserted successfully");
                response.status = 200;
                response.message = "Deleted successfully";
                response.data = resp;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
});

// Update product
router.post('/update', (req, res) => {
    let filter = {
        "_id": Number(req.body.product._id)
    };
    let product = req.body.product;
    let update = { $set: {name: product.name, quantity: product.quantity, color: product.color, price: product.price, rent: product.rent, quantity_left: product.quantity_left}}
    let updateOptions = {
        "upsert": "true"
    }
    connection((db) => {
        db.collection('Product')
            .updateOne(filter, update, updateOptions)
            .then((products) => {
                response.status = 200;
                response.data = [];
                response.message = "Successfully updated";
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
})

function IncrementCounter(id){
    let filter = {
        "_id": "product_id"
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
            .then(() =>{
                response.status = 200;
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
}

module.exports = router;