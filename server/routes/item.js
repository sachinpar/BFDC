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

// Get items
router.get('', (req, res) => {
    connection((db) => {
        db.collection('Item')
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
        db.collection('Item')
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
    let item = req.body.item;
    connection((db)=>{
        db.collection('Counter')
            .findOne({"_id": "item_id"})
            .then((items) => {
                item._id = Number(items.sequence_value) + 1;
                if(item._id > 0){
                    db.collection('Item')
                        .insertOne(item)
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
        db.collection('Item')
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
        "_id": Number(req.body.item._id)
    };
    let item = req.body.item;
    let update = { $set: {name: item.name, quantity: item.quantity, color: item.color, price: item.price, rent: item.rent}}
    let updateOptions = {
        "upsert": "true"
    }
    connection((db) => {
        db.collection('Item')
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
        "_id": "item_id"
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