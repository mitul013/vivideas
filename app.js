const express = require('express');
const expressLayouts = require('express-ejs-layouts');
require('./db/connection');
const passport = require('passport');
//flash
const flash = require('connect-flash');

//express session
const session = require('express-session');
const app = express();
require('./config/passport-config')(passport);


//EJS
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: false }));
app.use(express.static('public'));

app.use(session({
    secret: 'asdfg',
    resave: true,
    saveUninitialized: true
}))


//passport middleware
app.use(passport.initialize());
app.use(passport.session());


//flash middleware
app.use(flash());




//middleware for flash messages
app.use(function (req, res, next) {
    console.log("-- Outer app.js --");
    res.locals.data = req.flash('success_msg');
    res.locals.error = req.flash('error');
    res.locals.error_msg = req.flash('error_msg');
    next();
})



// Routes
app.use('/', require('./controllers/routes/index.js'));
app.use('/users', require('./controllers/routes/user.js'));
app.use('/admin', require('./controllers/routes/product/product.js'));
app.use('/admin', require('./controllers/routes/batch/batch.js'));
app.use('/customer', require('./controllers/routes/customer/customer.js'));


const PORT = process.env.PORT || 5006;

app.listen(PORT, () => {
    console.log(`Server running on ${PORT}`);
})