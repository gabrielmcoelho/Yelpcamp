var express = require("express");
var router = express.Router({mergeParams: true});
var Comment = require("../models/comment");
var Campground = require("../models/campground");
var middleware = require("../middleware");

/* COMMENTS NEW ROUTE */
router.get("/campgrounds/:id/comments/new", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(error, foundCampground){
        if(error){
            console.log("An error has ocurred...");
            res.redirect("/landing");
        }
        else{
            res.render("comments/new", {campground: foundCampground});       
        }
    })
})

/* COMMENTS CREATE ROUTE */
router.post("/campgrounds/:id/comments", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(error, foundCampground){
        if(error){
            console.log("An error has ocurred...");
            res.redirect("/landing");
        }
        else{
            Comment.create(req.body.comment, function(error, newComment){
                if(error){
                    req.flash("error", "something went wrong");
                    console.log(error);
                    res.redirect("/landing");
                }
                else{
                    // add username and id to comment
                    newComment.author.id = req.user._id;
                    newComment.author.username = req.user.username;
                    // save comment
                    newComment.save();
                    // add comment to Campground
                    foundCampground.comments.push(newComment);
                    // save Comment
                    foundCampground.save();
                    req.flash("success", "Successfully added comment");
                    res.redirect("/campgrounds/" + req.params.id);
                }
            })
        }
    })
})


/* Comment EDIT ROUTE */
router.get("/campgrounds/:id/comments/:comment_id/edit", middleware.checkCommentOwnership, function(req, res) {
    Campground.findById(req.params.id, function(error, foundCampground){
        if(error || !foundCampground){
            req.flash("error", "No campground found");
            console.log(error);
            return res.redirect("/campgrounds")
        }
        Comment.findById(req.params.comment_id, function(error, foundComment){
            if(error){
                res.redirect("/campgrounds");
            }
            res.render("comments/edit", {comment: foundComment, campground_id: req.params.id});
        })
    })
});

/* Comment UPDATE ROUTE */
router.put("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res) {
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(error, updatedComment){
        if(error){
            res.redirect("/campgrounds");
        }
        else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});


/* Comment DELETE ROUTE */
router.delete("/campgrounds/:id/comments/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(error, removedComment){
        if(error){
            res.redirect("/campgrounds/" + req.params.id);
        }
        req.flash("success", "Comment deleted");
        res.redirect("/campgrounds/" + req.params.id);
    })
})


module.exports = router;