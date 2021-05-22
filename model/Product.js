const mongoose = require('mongoose');

const { ObjectId } = mongoose.Schema.Types

const productSchema = new mongoose.Schema({
    productId:{
        type: String,
        required: true,
        unique: true
    },
    productName: {
        type: String,
        required: true,
    },
    productImage:{
        type: String
    },
    batches:[{
        type:ObjectId,
        ref:"Batch"
    }]
    
});

const Product = mongoose.model('Product',productSchema);

module.exports = Product;