const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const multer = require('multer');
const path = require('path');
const Product = require('../../../model/Product')

const { ensureAuthenticated } = require('../../../middleware/auth');

var storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads')
    },
    filename: function (req, file, cb) {
        const imageName = req.body.productID + path.extname(file.originalname)
        cb(null, imageName);
    }
})

var upload = multer({ storage: storage }).single('productImage');

router.get('/product/create', ensureAuthenticated, (req, res) => {
    if (req.user.type !== 'Admin') {
        req.flash('error_msg', 'Please log in as an Admin');
        res.redirect('/users/login');
    }
    res.render("admin/product/addproduct")
})

router.post('/product/create', ensureAuthenticated, upload, (req, res) => {
    if (req.user.type !== 'Admin') {
        req.flash('error_msg', 'Please log in as an Admin ');
        res.redirect('/users/login');
    }
    const { productID, productName } = req.body;
    const errors = [];
    if (!productID || !productName) {
        errors.push({ msg: "All fields required..." })
    }
    if (errors.length == 0) {
        const product = new Product({
            productId: productID,
            productName,
            productImage: req.file.filename
        })
        product.save()
            .then(result => {
                req.flash('success_msg', 'product created');
                res.redirect("/dashboard");
            })
            .catch(err => {
                errors.push({ msg: err });
                res.render("admin/product/addproduct", { errors, productName, productID });
            })
    }
    else {
        res.render("admin/product/addproduct", { errors, productName, productID })
    }

})


router.get('/products', ensureAuthenticated, (req, res) => {
    if (req.user.type !== 'Admin') {
        req.flash('error_msg', 'Please log in as an Admin ');
        res.redirect('/users/login');
    }

    Product.find({}, (err, data) => {

        if (err) {
            res.json({ error: err }).status(400);
        }
        else {
            res.json(data)
            res.status(200)
        }
    })

})


router.delete('/product/delete/:id',(req,res)=>{
    console.log(req.params.id);
    Product.findByIdAndDelete(req.params.id,(err, data) => {
        if (err) return res.status(500).send(err);
        const response = {
            message: "successfully deleted",
            id: req.params.id
        };
        return res.status(200).send(response);
    });
})

module.exports = router;