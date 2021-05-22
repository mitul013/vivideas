const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const passport = require('passport');
const User = require('../../model/User');


const {ensureAuthenticated} = require('../../middleware/auth');

router.get('/login' , (req, res) => {
    res.render("login")
})

router.get('/register', (req, res) => {
    res.render("register")
})

router.get('/logout', (req, res) => {
    req.logout();
    req.flash('success_msg', 'log out successfully');
    res.redirect('/users/login');
})

router.post('/register', (req, res) => {
    const { name, email, password, password2 } = req.body;
    const errors = [];
    if (!name || !email || !password || !password2) {
        errors.push({ msg: "All fields required..." })
    }
    if (password !== password2) {
        errors.push({ msg: "Passwords don't match" });
    }
    if (password.length < 6) {
        errors.push({ msg: "Password must be more than 6 letter" });
    }
    if (errors.length == 0) {

        User.findOne({ email: email })
            .then(user => {

                if (user) {
                    console.log(user)
                    errors.push({ msg: "User is already exist" });
                    res.render("register", { errors, name, email, password });
                }
                else {
                    const user = new User({
                        name,
                        email,
                        password
                    })

                    bcrypt.genSalt(10, (err, salt) => {
                        bcrypt.hash(password, salt, (err, hash) => {
                            if (err) throw new Error(err)
                            user.password = hash;
                            user.save()
                                .then(result => {
                                    console.log("-- In user.js --");
                                    req.flash('success_msg', 'you are registered, You can login now');
                                    res.redirect("/users/login");
                                })
                                .catch(err => {
                                    errors.push({ msg: err });
                                    res.render("register", { errors, name, email, password });
                                })
                        })
                    })
                }

            })
            .catch(e => {
                errors.push({ msg: e });
                res.render("register", { errors, name, email, password });
            })


    }
    else {
        res.render("register", { errors, name, email, password });
    }
})



router.post('/login', (req, res, next) => {
    console.log("--> "+ req.user);
    passport.authenticate('local', {
        successRedirect: '/dashboard',
        failureRedirect: '/users/login',
        failureFlash: true
    })(req,res,next);
})

module.exports = router;