import mongoose from 'mongoose';
const LinkSchema = new mongoose.Schema({
    originalUrl: String,
    shortUrl: String,
    shortCode: String,
    qrCode: String,
    clicks: { type: Number, default: 0 }
});
export default mongoose.model('Link', LinkSchema);
