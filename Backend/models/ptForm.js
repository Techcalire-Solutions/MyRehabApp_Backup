// pt.js
const mongoose = require('mongoose');

const ptSchema = new mongoose.Schema({
    clientId: { type: mongoose.Schema.Types.ObjectId, ref: 'client' },
    height: { type: String },
    weight: { type: String },
    cheifComplaint: { type: String },
    image_url: { type: String },
    cloudinary_id: { type: String }
});

const PtModel = mongoose.model('Pt', ptSchema);

module.exports = PtModel;
