// server/index.js
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import shortid from 'shortid';
import QRCode from 'qrcode';
import Link from './models/Link.js';

dotenv.config();
const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/mydatabase', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
.catch(err => console.log(err));

app.post('/shorten', async (req, res) => {
    const { originalUrl, customAlias } = req.body;
    const shortCode = customAlias || shortid.generate();
    const shortUrl = `${process.env.BASE_URL}/${shortCode}`;

    try {
        const qrCodeData = await QRCode.toDataURL(shortUrl);
        const newLink = new Link({ originalUrl, shortUrl, shortCode, qrCode: qrCodeData, clicks: 0 });
        await newLink.save();
        res.json(newLink);
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/:code', async (req, res) => {
    try {
        const link = await Link.findOneAndUpdate(
            { shortCode: req.params.code },
            { $inc: { clicks: 1 } },
            { new: true }
        );
        if (link) {
            res.redirect(link.originalUrl);
        } else {
            res.status(404).json({ error: 'Link not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.get('/analytics/:code', async (req, res) => {
    try {
        const link = await Link.findOne({ shortCode: req.params.code });
        if (link) {
            res.json({ originalUrl: link.originalUrl, shortUrl: link.shortUrl, shortCode: link.shortCode, qrCode: link.qrCode, clicks: link.clicks });
        } else {
            res.status(404).json({ error: 'Link not found' });
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

app.listen(5000, () => console.log('Server running on port 5000'));
