const express = require('express');
const multer = require('multer');
const { GridFsStorage } = require('multer-gridfs-storage');
const crypto = require('crypto');
const path = require('path');
const mongoose = require('mongoose');
const config = require('../utils/config');

const uploadRouter = express.Router();

let gfs;

mongoose.connection.once('open', () => {
    gfs = new mongoose.mongo.GridFSBucket(mongoose.connection.db, {
        bucketName: 'uploads',
    });
});

const storage = new GridFsStorage({
    url: config.MONGODB_URI,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename,
                    bucketName: 'uploads',
                };
                resolve(fileInfo);
            });
        });
    },
});

const upload = multer({ storage });

uploadRouter.post('/', upload.single('file'), (req, res) => {
    res.json({ file: req.file });
});

uploadRouter.get('/files/:filename', async (req, res) => {
    try {
        const files = await gfs.find({ filename: req.params.filename }).toArray();

        if (!files || files.length === 0) {
            return res.status(404).json({ error: 'No files exist' });
        }

        const file = files[0];
        const readstream = gfs.openDownloadStreamByName(req.params.filename);

        res.set('Content-Type', file.contentType || 'application/octet-stream');
        res.set('Content-Disposition', 'attachment; filename="' + file.filename + '"');

        readstream.on('error', (err) => {
            console.error('Readstream error:', err);
            res.status(500).json({ error: 'An error occurred while reading the file' });
        });

        readstream.on('end', () => {
            res.end();
        });

        readstream.pipe(res);
    } catch (error) {
        console.error('Error fetching file:', error);
        res.status(500).json({ error: 'An error occurred while fetching the file' });
    }
});

uploadRouter.delete('/files/:filename', async (req, res) => {
    try {
        const file = await gfs.find({ filename: req.params.filename }).toArray();
        if (!file || file.length === 0) {
            return res.status(404).json({ error: 'File not found' });
        }
        await gfs.delete(new mongoose.Types.ObjectId(file[0]._id));
        res.status(200).json({ message: 'File deleted successfully' });
    } catch (error) {
        console.error('Error while deleting file:', error);
        res.status(500).json({ error: 'An error occurred while deleting the file' });
    }
})

module.exports = uploadRouter;