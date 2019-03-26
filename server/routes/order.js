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

// Get order items
router.get('/orderitems', (req, res) => {
    connection((db) => {
        db.collection('OrderItems')
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

// Get order items by order id
router.get('/orderitems/:id', (req, res) => {
    let query = {
        "order_id": Number(req.params.id)
    };
    connection((db) => {
        db.collection('OrderItems')
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
    let updateOptions = {
        "upsert": "true"
    }
    connection((db) =>{
        db.collection('Counter')
            .find({}).toArray((err, counters) => {
                let orders_counter = counters.filter((counter) =>{
                    return counter._id == 'order_id';
                });
                if(orders_counter == null || !(orders_counter.length>0)){
                    orders_counter = [{"_id": "order_id", "sequence_value" : 0}];
                }
                let orders_seq_id = Number(orders_counter[0].sequence_value) + 1;
                if(orders_seq_id > 0){
                    let order_items_counter = counters.filter((counter) => {
                        return counter._id == 'order_item_id';
                    });
                    if(order_items_counter == null || !(order_items_counter.length>0)){
                        order_items_counter = [{"_id": "order_item_id", "sequence_value" : 0}];
                    }
                    let orders_item_seq_id = Number(order_items_counter[0].sequence_value) + 1;
                    if(orders_item_seq_id > 0){
                        var order_date = new Date();
                        var total_quantity = 0;
                        let order_items = [];
                        for(var i = 0; i < order.length;i++){
                            let order_item = {
                                "_id": orders_item_seq_id++,
                                "order_id": orders_seq_id,
                                "customer_id": order[i].customer_id,
                                "size_id": order[i].size_id,
                                "product_id": order[i].product_id,
                                "product_name": order[i].product_name,
                                "customer_name": order[i].customer_name,
                                "size": order[i].size,
                                "quantity": order[i].quantity,
                                "order_date": order_date
                            };
                            total_quantity += order[i].quantity;
                            order_items.push(order_item);
                            let filter = {
                                "_id": order[i].size_id
                            };
                            let decrement = { 
                                $inc: {
                                    "quantity_left": (-1 * order[i].quantity)
                                }
                            };
                            UpdateProductQuantity(filter, decrement, updateOptions, res);
                        }
                        let order_details = {
                            "_id": orders_seq_id,
                            "customer_id": order[0].customer_id,
                            "customer_name": order[0].customer_name,
                            "days": 0,
                            "amount": 0,
                            "quantity": total_quantity,
                            "order_date": order_date,
                            "return_date": null,
                            "returned": false
                        };
                        InsertOrderDetails(res, order_details);
                        InsertOrderItems(res, order_items, order.length);
                    }
                }
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

function UpdateProductQuantity(filter, decrement, updateOptions, res){
    connection((db)=>{
        db.collection('Sizes')
            .updateOne(filter, decrement, updateOptions)
            .then((resp) => {
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
}

async function IncrementCounter(res, counter_name, inc){
    let filter = {
        "_id": counter_name
    };
    let increment = { 
                $inc: {
                    "sequence_value": inc
                }
            };
    let updateOptions = {
        "upsert": "true"
    };
    connection((db)=>{
        db.collection('Counter')
            .updateOne(filter, increment, updateOptions)
            .then((resp) =>{
                
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
}

function InsertOrderItems(res, order_items, len){
    connection((db) => {
        db.collection('OrderItems')
            .insertMany(order_items)
            .then((resp) => {
                response.status = 200;
                response.message = "Order placed successfully";
                response.data = resp;
                IncrementCounter(res, "order_item_id", len);
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
}

function InsertOrderDetails(res, order_details){
    connection((db) => {
        db.collection('Order')
            .insertOne(order_details)
            .then((resp) => {
                IncrementCounter(res, "order_id", 1);
            })
            .catch((err) => {
                console.log("error: " + err);
                sendError(err, res);
            });
    });
}

module.exports = router;