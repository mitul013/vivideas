const express = require('express');
const { ensureAuthenticated, forwardAuthenticated } = require('../../middleware/auth')
const router = express.Router();

router.get('/',(req,res)=>{
    res.render('welcome');
})

router.get('/dashboard',ensureAuthenticated, (req, res) => {
    if(req.user.type==='Admin'){
        res.render('admin/dashboard');
    }
    else{
        res.render('customer/dashboard');
}
})

module.exports = router;