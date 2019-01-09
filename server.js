const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const app = express();

// API file for interacting with MongoDB
const api = require('./server/routes/api');
const item = require('./server/routes/item');
const counter = require('./server/routes/counter');
const order = require('./server/routes/order');
const customer = require('./server/routes/customer');

// Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

// Angular DIST output folder
app.use(express.static(path.join(__dirname, 'dist/BFDC')));

// API location
app.use('/api', api);
app.use('/api/items', item);
app.use('/api/counters', counter);
app.use('/api/orders', order);
app.use('/api/customers', customer);

// Send all other requests to the Angular app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/BFDC/index.html'));
});

//Set Port
const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => console.log(`Running on localhost:${port}`));