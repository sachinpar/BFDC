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

// Get orders
router.get('', (req, res) => {
    connection((db) => {
        db.collection('Order')
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

// Get order
router.get('/:id', (req, res) => {
    let query = {
        "_id": Number(req.params.id)
    };
    connection((db) => {
        db.collection('Order')
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

// Add order
router.post('/add', (req, res) => {
    let order = req.body.order;
    let filter = {
        "_id": req.body.order.product_id
    };
    let decrement = { 
        $inc: {
            "quantity_left": (-1 * order.quantity)
        }
    };
    let updateOptions = {
        "upsert": "true"
    }
    connection((db)=>{
        db.collection('Counter')
            .findOne({"_id": "order_id"})
            .then((orders) => {
                if(orders == null){
                    orders = {"_id": "order_id", "sequence_value" : 0};
                }
                order._id = Number(orders.sequence_value) + 1;
                if(order._id > 0){
                    db.collection('Order')
                        .insertOne(order)
                        .then((resp) => {
                            UpdateProductQuantity(filter, decrement, updateOptions, resp, res)
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

// Delete order
router.delete('/delete/:id', (req, res) => {
    let query = { 
        "_id": Number(req.params.id)
    };
    connection((db)=>{
        db.collection('Order')
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

// Update order
router.post('/update', (req, res) => {
    let filter = {
        "_id": Number(req.body.order._id)
    };
    let order = req.body.order;
    let update = { $set: {product_id: order.product_id, quantity: order.quantity, days: order.days, amount: order.amount, order_date: order.order_date, returned: order.returned, return_date: order.return_date}}
    let updateOptions = {
        "upsert": "true"
    }
    connection((db) => {
        db.collection('Order')
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
});

router.post('/return', (req, res) => {
    let order = req.body.order;
    let filter = {
        "_id": order.product_id
    };
    let update = {
        $inc: {"quantity_left" : order.quantity}
    };
    let updateOptions = {
        "upsert" : "true"
    };
    IncrementProductQuantity(filter, update, updateOptions, res);
});

function IncrementProductQuantity(filter, increment, updateOptions, res){
    connection((db)=>{
        db.collection('Product')
            .updateOne(filter, increment, updateOptions)
            .then(() => {
                UpdateOrderStatus(order, true, new Date(),res);
            })
            .catch((err) => {
                sendError(err);
            });
    });
}

function UpdateOrderStatus(order, status, dateRetuned, res){
    let filter = {
        "_id" : order.order_id
    };
    let update = {
        $set: {
            "returned": status,
            "return_date": dateRetuned
        }
    };
    let updateOptions = {
        "upsert": "true"
    };
    connection((db) => {
        db.collection('Order')
            .updateOne(filter, update, updateOptions)
            .then(() => {
                response.status = 200;
                response.data = [];
                response.message = "Return successful"
                res.json(response);
            })
            .catch((err) => {
                sendError(err);
            });
    });
}

function UpdateProductQuantity(filter, decrement, updateOptions, resp, res){
    connection((db)=>{
        db.collection('Product')
            .updateOne(filter, decrement, updateOptions)
            .then(() => {
                response.message = resp.insertedCount + " order placed";
                response.data = resp;
                IncrementCounter(res);
            })
            .catch((err) => {
                sendError(err);
            });
    });
}

function IncrementCounter(res){
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
    };
    connection((db)=>{
        db.collection('Counter')
            .updateOne(filter, increment, updateOptions)
            .then(() =>{
                response.status = 200;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
}

module.exports = router;