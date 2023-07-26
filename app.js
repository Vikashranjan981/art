if(process.env.NODE_ENV!=="production")
{
    require('dotenv').config();
}

const port=process.env.port || 3000;
const express = require('express');

const path = require('path');
const mongoose = require('mongoose');

const Art = require('./models/art')
const catchAsync = require('./utils/catchAsync');
const ExpressError = require('./utils/expressError');
const Joi = require('joi');
const session =require('express-session');
const flash=require('connect-flash');
const methodOveride = require('method-override');
const ejsMate = require('ejs-mate');
const passport=require('passport');
const LocalStrategy=require('passport-local');
const User=require('./models/user');


const artsRoutes=require('./routes/art');
const reviewsRoutes=require('./routes/reviews');
const userRoutes=require('./routes/users');

const mongoSanitize = require('express-mongo-sanitize');



const dbUrl = process.env.DB_URL|| 'mongodb://127.0.0.1:27017/review-art';

mongoose.connect(dbUrl, {
    useNewUrlParser:true,
    useUnifiedTopology:true,
});

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

// mongoose.connect('mongodb://127.0.0.1:27017/review-art')
//     .then(() => {
//         console.log('database connected');
//     })
//     .catch((e) => {
//         console.log(e);
//     })


const app = express();
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname,'public')));
app.use(methodOveride('_method'));
app.use(mongoSanitize({
    replaceWith: '_'
}))
const sessionConfig={
    name:'session',
   secret:'thisshoulebeabettersecret',
   resave:false,
   saveUninitialized:true,
   cookie:{
    httpOnly: true,
     expires: Date.now()+1000*24*60*60*7,
     maxAge:1000*24*60*60*7,
   }

}

app.use(session(sessionConfig));
app.use(flash());






app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req,res,next)=>{
    res.locals.currentUser=req.user;
    res.locals.success=req.flash('success');
    res.locals.error=req.flash('error');
    next();
})


app.get('/', (req, res) => {
    res.render('home');
})
app.use('/',userRoutes);
app.use('/arts',artsRoutes);
app.use('/arts/:id/reviews',reviewsRoutes);






app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not found', 404));
})
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Oh no,Somethings Went wrong!!!'
    res.status(statusCode).render('error', { err });
})
app.listen(3000, (req, res) => {
    console.log('listening on port 3000');
})
