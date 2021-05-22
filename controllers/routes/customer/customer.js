const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const Batch = require('../../../model/Batch')
const Product = require('../../../model/Product')

const { ensureAuthenticated } = require('../../../middleware/auth');

router.get('/details/:id/:number', ensureAuthenticated, async (req, res) => {
    if (req.user.type === 'Admin') {
        req.flash('error_msg', 'Please log in as an Customer');
        res.redirect('/users/login');
    }
    let id = req.params.id
    let number = req.params.number
    let data;
    const batch = await Batch.findById(id)
    if (batch && number <= batch.noOfCode) {
        console.log("-------------")
        console.log(batch)
        const product = await Product.findOne({productId:batch.productId})
        console.log("-------------")
        console.log(product)
        data = {batchNumber:batch.batchNumber,mfg:batch.mfg,exp:batch.exp,productId:batch.productId,ProductImage:product.productImage,productName:product.productName,error:null}
        res.json(data)
    }
    else{
        data = {error:'no match found'}
    }
    res.json(data)
})


module.exports = router;