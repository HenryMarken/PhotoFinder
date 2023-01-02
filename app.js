if (process.env.NODE_ENV !== "production"){ //if in development mode require dotenv package and takes variables and so we can accesss this in other files
    require('dotenv').config();
}

//Requiring Node Packages
const express = require ('express');
const mongoose = require('mongoose');
const app = express();
const path = require('path');
const ejsMate = require('ejs-mate');
const methodOverride = require('method-override');
const ExpressError = require('./utils/ExpressError')
const session = require('express-session');
const flash = require('connect-flash');
const passport = require('passport');
const User = require('./models/user');
const LocalStrategy = require('passport-local');
const Joi = require('joi') //most powerful schema description language and data validator for JavaScript
const mongoSanitize = require('express-mongo-sanitize');
const helmet = require('helmet');
const MongoDBStore = require("connect-mongo")(session);

//Requiring Routes
const campgroundRoutes = require('./routes/campgrounds')
const reviewRoutes = require('./routes/reviews');
const userRoutes = require('./routes/users');

//Connecting to Mongoose
const dbUrl = 'mongodb+srv://HenryMarken:Coldwinter11!@cluster0.ct32gpv.mongodb.net/?retryWrites=true&w=majority';
mongoose.connect(dbUrl,{ 
//this was changed in Mongo 6 as these are all set to true by default
    // useNewUrlParser:true, 
    // useCreateIndex: true,
    // useUnifiedTopology: true,
})

const db = mongoose.connection;
db.on("error", console.error.bind(console,"connection error:"));
db.once("open", () => {
    console.log("database connected");
})

//ejs setup for views
app.engine('ejs', ejsMate)
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname,'views'));

app.use(express.urlencoded({extended:true})); //parses
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')))
app.use(mongoSanitize());

//Cookies

const store = new MongoDBStore({
    url:dbUrl,
    secret:'thisshouldbeabettersecret',
    touchAfter: 24 * 60 * 60,
});

store.on("error", function(e){
    console.log("Session Store Error", e)
})

const sessionConfig = {
    store,
    secret: 'thisshouldbeabettersecret',
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly:true,
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, //cookies dissapears after a week 
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
}
app.use(session(sessionConfig))

//flash
app.use(flash());

//helmet


const scriptSrcUrls = [
    "https://stackpath.bootstrapcdn.com",
    "https://api.tiles.mapbox.com",
    "https://api.mapbox.com",
    "https://kit.fontawesome.com",
    "https://cdnjs.cloudflare.com",
    "https://cdn.jsdelivr.net",
];
const styleSrcUrls = [
    "https://kit-free.fontawesome.com",
    "https://stackpath.bootstrapcdn.com",
    "https://api.mapbox.com",
    "https://api.tiles.mapbox.com",
    "https://fonts.googleapis.com",
    "https://use.fontawesome.com",
    "https://cdn.jsdelivr.net",
];
const connectSrcUrls = [
    "https://api.mapbox.com",
    "https://*.tiles.mapbox.com",
    "https://events.mapbox.com",
];
const fontSrcUrls = [];
app.use(
    helmet.contentSecurityPolicy({
        directives: {
            defaultSrc: [],
            connectSrc: ["'self'", ...connectSrcUrls],
            scriptSrc: ["'unsafe-inline'", "'self'", ...scriptSrcUrls],
            styleSrc: ["'self'", "'unsafe-inline'", ...styleSrcUrls],
            workerSrc: ["'self'", "blob:"],
            childSrc: ["blob:"],
            objectSrc: [],
            imgSrc: [
                "'self'",
                "blob:",
                "data:",
                "https://res.cloudinary.com/dcxblk1e6/",
                "https://images.unsplash.com",
            ],
            fontSrc: ["'self'", ...fontSrcUrls],
        },
    })
);

//passport
app.use(passport.initialize());
app.use(passport.session()); //middleware if we want persistent login session versus alternative logging after every request * NOTE ADD THIS AFTER SESSIONS APP.USE
passport.use(new LocalStrategy(User.authenticate())); //use local strategy and authentication method is defined in User model

passport.serializeUser(User.serializeUser()); // how to keep a user in the session
passport.deserializeUser(User.deserializeUser()); // how to remove a user in the session

//flash middleware
app.use((req,res,next) => { //all our cookies stored in session
    res.locals.currentUser = req.user; //passport
    res.locals.success = req.flash('success'); //every single request going to take whatevers in flash under successs and have access to it in our locals under key success
    res.locals.error = req.flash('error')
    next();
})


//Routing 
app.use('/campgrounds', campgroundRoutes)
app.use('/campgrounds/:id/reviews' , reviewRoutes)
app.use('/', userRoutes)

app.get('/', (req, res) => {
    res.render('home')
});

//Errors
app.all('*', (req, res, next) =>{ // note this will execute if nothing else is called during a request
    next(new ExpressError('Page Not Found', 404))
})

//Error Handler
app.use((err, req, res, next) => { 
    const {statusCode = 500} = err;
    if(!err.message)  err.message = 'Something went wrong';
    res.status(statusCode).render('errors' , {err})
})

//Connection to Port 3000 
app.listen(3000, () =>{
    console.log('Listening on port 3000')
})
