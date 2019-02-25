// ====================
//    PACKAGE CONFIG
// ====================
var express               = require("express"),
    app                   = express(),
    bodyParser            = require("body-parser"),
    mongoose              = require("mongoose"),
    flash                 = require("connect-flash"),
    passport              = require("passport"),
    LocalStrategy         = require("passport-local"),
    passportLocalMongoose = require("passport-local-mongoose"),
    expressSession        = require("express-session"),
    methodOverride        = require("method-override"),
    seedDB                = require("./seeds.js"),
    Campground            = require("./models/campground.js"),
    Comment               = require("./models/comment.js"),
    User                  = require("./models/user.js");


// ====================
//  ROUTES CONFIG PT.1
// ====================
var commentRoutes    = require("./routes/comments"),
    campgroundRoutes = require("./routes/campgrounds"),
    indexRoutes      = require("./routes/index");
    
    
// ====================
//       APP CONFIG
// ====================
mongoose.connect("mongodb+srv://gabrielmcoelho:dash6880@cluster0-qjaw7.mongodb.net/yelp_camp?retryWrites=true");
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
//seedDB();


// ====================
//      AUTH CONFIG
// ====================
app.use(expressSession({
    secret: "dash",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// ====================
//   MIDDLEWARE CONFIG
// ====================
app.use(function(req, res, next){ // Adds a middleware to every route.
    res.locals.currentUser = req.user; // Pass a variable named currentUser to every template, which value will be equals to req.user
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next(); // After that, proceed with the routing
})


// ====================
//  ROUTES CONFIG PT.2
// ====================
app.use(indexRoutes);
app.use(campgroundRoutes);
app.use(commentRoutes);


// ====================
//    STARTING SERVER
// ====================
app.listen(process.env.PORT, process.env.IP, function(){
    console.log("Yelpcamp application has started running!");
})