var Campground = require("../models/campground");
var Comment = require("../models/comment");

// all the middleware goes here
var middlewareObj = {};

middlewareObj.isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
    req.flash("error", "You need to be logged in to do that!");
    res.redirect("/login");
}

middlewareObj.checkCampgroundOwnership = function(req, res, next) {
    // is user logged in?
    if(req.isAuthenticated()){
        Campground.findById(req.params.id, function(error, foundCampground) {
            if(error || !foundCampground){
                req.flash("error", "Campground not found");
                res.redirect("back");
            }
            // does user own the campground?
            if(foundCampground.author.id.equals(req.user._id)){
                next();
            }
            // otherwise, redirect
            else{
                req.flash("error", "You don't have permission to do that!");
                res.redirect("back");
            }
        })
    }
    // if not, redirect
    else{
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }
}

middlewareObj.checkCommentOwnership = function(req, res, next) {
    // is user logged in?
    if(req.isAuthenticated()){
        Comment.findById(req.params.comment_id, function(error, foundComment) {
            if(error || !foundComment){
                req.flash("error", "Comment not found");
                res.redirect("back");
            }
            // does user own the comment?
            if(foundComment.author.id.equals(req.user._id)){
                next();
            }
            // otherwise, redirect
            else{
                req.flash("error", "You don't have permission to do that!");
                res.redirect("back");
            }
        })
    }
    // if not, redirect
    else{
        req.flash("error", "You need to be logged in to do that!");
        res.redirect("back");
    }
}

module.exports = middlewareObj;