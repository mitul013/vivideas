const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema.Types

const batchSchema = new mongoose.Schema({
    batchNumber: {
        type: Number,
        required: true,
    },
    noOfCode: {
        type: Number,
        default: 1
    },
    mfg: {
        type: Date,
        required: true
    },
    exp: {
        type: Date,
        required: true
    },
    productId: {
        type: String,
    }
});

const Batch = mongoose.model('Batch', batchSchema);

module.exports = Batch;