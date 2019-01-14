const express = require('express');
const router = express.Router();
const upload = require('../Services/file-upload');

const singleUpload = upload.single('image');

router.post('/upload', (req, res) => {
    singleUpload(req, res, (err) => {
        res.json({'image_url': req.file.location});
    });
});

module.exports = router;