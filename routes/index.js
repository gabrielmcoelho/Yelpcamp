var express = require("express");
var router = express.Router();
var passport = require("passport");
var User = require("../models/user");

/* HOME ROUTE */
router.get("/", function(req, res){
    res.render("landing");
})

// =====================
//      AUTH ROUTES
// =====================


/* user registration form */
router.get("/register", function(req, res){
    res.render("register");
})

/* user registration */
router.post("/register", function(req, res) {
    var newUser = {username: req.body.username};
    User.register(new User(newUser), req.body.password, function(error, user){
        console.log(req.body.password);
        if(error){
            req.flash("error", error.message);
            console.log(error);
            res.redirect("/register");
        }
        else{
            passport.authenticate("local")(req, res, function(){
                req.flash("success", "Welcome to Yelpcamp " + user.username);
                res.redirect("/campgrounds");
            });
        }
    });
});

/* user login form */
router.get("/login", function(req, res) {
    res.render("login");
});

/* user login */
router.post("/login", passport.authenticate("local", {
    
        successRedirect: "/campgrounds",
        failureRedirect: "/login",
        failureFlash: true,
        successFlash: "Welcome back!"
     })
);

/* user logout */
router.get("/logout", function(req, res) {
    req.logout();
    req.flash("success", "Logged you out!");
    res.redirect("/campgrounds");
});

module.exports = router;