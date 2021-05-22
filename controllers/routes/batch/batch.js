const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const Batch = require('../../../model/Batch')
const Product = require('../../../model/Product')

const { ensureAuthenticated } = require('../../../middleware/auth');

router.get('/batch/create', ensureAuthenticated, (req, res) => {
    if (req.user.type !== 'Admin') {
        req.flash('error_msg', 'Please log in as an Admin');
        res.redirect('/users/login');
    }
    res.render("admin/batch/addBatch")
})


router.post('/batch/create', ensureAuthenticated, async (req, res) => {
    if (req.user.type !== 'Admin') {
        req.flash('error_msg', 'Please log in as an Admin');
        res.redirect('/users/login');
    }
    const { batchNumber, noOfCode, mfg, exp, productId } = req.body;
    console.log(req.body, batchNumber, noOfCode, mfg, exp, productId)
    const errors = [];
    if (!batchNumber || !noOfCode || !mfg || !exp) {
        errors.push({ msg: "All fields required..." })
    }
    if (errors.length == 0) {

        let batch = await Batch.findOne({ batchNumber })

        if (batch && batch.productId == productId) {
            batch.noOfCode += noOfCode
        }
        else{
            batch = new Batch({
                batchNumber: +batchNumber,
                noOfCode,
                mfg,
                exp,
                productId
            })
        }
        batch.save()
            .then(async (batch) => {
                const product = await Product.findOne({ productId })
                
                product.batches.push(batch._id)
              
                await product.save()
                req.flash('success_msg', 'batch created');
                res.redirect("/dashboard");
            })
            .catch(err => {
                errors.push({ msg: err });
                //batchNumber, noOfCode, mfg, exp, productId
                res.render("admin/batch/addBatch", { errors, batchNumber, noOfCode, mfg, exp, productId });
            })
    }
    else {
        res.render("admin/batch/addBatch", { errors, batchNumber, noOfCode, mfg, exp, productId })
    }

})


router.get('/batches', ensureAuthenticated, (req, res) => {
    if (req.user.type !== 'Admin') {
        req.flash('error_msg', 'Please log in as an Admin ');
        res.redirect('/users/login');
    }
    Batch.find({}, (err, data) => {

        if (err) {
            res.json({ error: err }).status(400);
        }
        else {
            res.json(data)
            res.status(200)
        }
    })

})


router.get('/batch/getCodes/:id', ensureAuthenticated, (req, res) => {
    if (req.user.type !== 'Admin') {
        req.flash('error_msg', 'Please log in as an Admin');
        res.redirect('/users/login');
    }
    var id = req.params.id;
    Batch.findById(id, (err, data) => {

        if (err) {
            res.json({ error: err }).status(400);
        }
        else {
            let list = []

            for(let i=1; i <= data.noOfCode;i++){
                let s = data._id +'$'+ i
                list.push(s)
            }
            res.send(list)
            res.status(200)
        }
    })

})

module.exports = router;