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
        db.collection('Order')
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
        db.collection('Order')
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
    let order = req.body.order;
    console.log(order);
    connection((db)=>{
        db.collection('Counter')
            .findOne({"_id": "order_id"})
            .then((orders) => {
                console.log(orders);
                if(orders == null){
                    orders = {"_id": "order_id", "sequence_value" : 0};
                }
                order._id = Number(orders.sequence_value) + 1;
                console.log("order.id : " + order._id);
                if(order._id > 0){
                    console.log("coming here");
                    db.collection('Order')
                        .insertOne(order)
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
        db.collection('Order')
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

// Update item
router.post('/update', (req, res) => {
    let filter = {
        "_id": Number(req.body.order._id)
    };
    let order = req.body.order;
    let update = { $set: {item_id: order.item_id, quantity: order.quantity, amount: order.amount}}
    let updateOptions = {
        "upsert": "true"
    }
    connection((db) => {
        db.collection('Order')
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
        "_id": "order_id"
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