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

// Get booking
router.get('', (req, res) => {
    connection((db) => {
        db.collection('Customer')
            .find()
            .toArray()
            .then((items) => {
                response.message = "Success";
                response.status = 200;
                response.data = items;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
});

// Get item
router.get('/:id', (req, res) => {
    let query = {
        "_id": Number(req.params.id)
    };
    connection((db) => {
        db.collection('Customer')
            .findOne(query)
            .then((items) => {
                response.message = "Success";
                response.status = 200;
                response.data = items;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
});

// Add items
router.post('/add', (req, res) => {
    let customer = req.body.customer;
    connection((db)=>{
        db.collection('Counter')
            .findOne({"_id": "customer_id"})
            .then((customers) => {
                if(customers == null){
                    customers = {"_id": "customer_id", "sequence_value" : 0};
                }
                customer._id = Number(customers.sequence_value) + 1;
                if(customer._id > 0){
                    db.collection('Customer')
                        .insertOne(customer)
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

// Delete item
router.delete('/delete/:id', (req, res) => {
    let query = { 
        "_id": Number(req.params.id)
    };
    connection((db)=>{
        db.collection('Customer')
            .remove(query)
            .then((resp) => {
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

// Update item
router.post('/update', (req, res) => {
    let filter = {
        "_id": Number(req.body.customer._id)
    };
    let customer = req.body.customer;
    let update = { $set: {name: customer.name, email: customer.email, mobile: customer.mobile, address: customer.address}};
    let updateOptions = {
        "upsert": "true"
    }
    connection((db) => {
        db.collection('Customer')
            .updateOne(filter, update, updateOptions)
            .then((items) => {
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
        "_id": "customer_id"
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