const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const http = require('http');
const app = express();

// API file for interacting with MongoDB
const api = require('./server/routes/api');
const product = require('./server/routes/product');
const counter = require('./server/routes/counter');
const order = require('./server/routes/order');
const customer = require('./server/routes/customer');
const fileUpload = require('./server/routes/file-upload');
const size = require('./server/routes/size');

// Parsers
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false}));

// Angular DIST output folder
app.use(express.static(path.join(__dirname, 'dist/BFDC')));

// API location
app.use('/api', api);
app.use('/api/products', product);
app.use('/api/counters', counter);
app.use('/api/orders', order);
app.use('/api/customers', customer);
app.use('/api/uploads', fileUpload);
app.use('/api/sizes', size);

// Send all other requests to the Angular app
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'dist/BFDC/index.html'));
});

//Set Port
const port = process.env.PORT || '3000';
app.set('port', port);

const server = http.createServer(app);

server.listen(port, () => console.log(`Running on localhost:${port}`));