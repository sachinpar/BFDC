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

// Get users
router.get('/Users', (req, res) => {
    connection((db) => {
        db.collection('Users')
            .find()
            .toArray()
            .then((users) => {
                response.data = users;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
});

// Get user
router.get('/Users/:username', (req, res) => {
    var query = { UserName: req.params.username };
    connection((db) => {
        db.collection('Users')
            .find(query)
            .toArray()
            .then((users) => {
                response.data = users;
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
});

//Get user
router.post('/ValidateUser', (req, res) => {
    var query = { UserName: req.body.username, Password: req.body.password };
    response.data= [];
    response.message = "";
    connection((db) => {
        db.collection('Users')
            .find(query)
            .toArray()
            .then((users) => {
                if(users.length > 0){
                    let user = users.find(() => true);
                    response.status = 200;
                    user.token = user.UserName + " " + new Date();
                    response.data = users;
                    response.message = "Authentication successful";
                }
                else
                {
                    response.status = 401;
                    response.data = [];
                    response.message = "Invalid Login"
                }
                res.json(response);
            })
            .catch((err) => {
                sendError(err, res);
            });
    });
});

module.exports = router;