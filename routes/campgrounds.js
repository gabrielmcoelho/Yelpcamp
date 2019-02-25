var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var Comment = require("../models/comment");
var middleware = require("../middleware")

/* CAMPGROUNDS INDEX ROUTE */
router.get("/campgrounds", function(req, res){
    // Get all campgrounds from DB
    Campground.find({}, function(error, allCampgrounds){
        if(error){
            console.log(error);
        }
        else{
            res.render("campgrounds/index", {campgrounds: allCampgrounds});
        }
    })
})

/* CAMPGROUNDS NEW ROUTE */
router.get("/campgrounds/new", middleware.isLoggedIn, function(req, res){
    res.render("campgrounds/new"); 
})

/* CAMPGROUNDS CREATE ROUTE */
router.post("/campgrounds", middleware.isLoggedIn, function(req, res){
   // get data from form and add a new campground to database
   var name = req.body.name;
   var image = req.body.image;
   var price = req.body.price;
   var description = req.body.description;
   var author = {
       id: req.user._id,
       username: req.user.username
   };
   var newCampground = {
       name: name,
       image: image,
       price: price,
       author: author,
       description: description
   };
   Campground.create(newCampground, function(error, newlyCreated){
       if(error){
           console.log("AN ERROR OCCURRED :(");
       }
       else{
           // redirect back to campgrounds page
           res.redirect("/campgrounds");
       }
   })
});

/* CAMPGROUNDS SHOW ROUTE */
router.get("/campgrounds/:id", function(req, res){
    // find the campground with provided ID
    Campground.findById(req.params.id).populate("comments").exec(function(error, foundCampground){
        if(error || !foundCampground){
            req.flash("error", "Campground not found");
            console.log(error);
            res.redirect("/campgrounds");
        }
        else{
            //render show template with that campground
            res.render("campgrounds/show", {campground: foundCampground});
        }
    });
});

/* CAMPGROUNDS EDIT ROUTE */
router.get("/campgrounds/:id/edit", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findById(req.params.id, function(error, foundCampground){
        res.render("campgrounds/edit", {campground: foundCampground});
    })
});


/* CAMPGROUNDS UPDATE ROUTE */
router.put("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(error, updatedCampground){
        if(error){
            res.redirect("/campgrounds");
        }
        else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    })
});


/* CAMPGROUNDS DELETE ROUTE */
router.delete("/campgrounds/:id", middleware.checkCampgroundOwnership, function(req, res){
    Campground.findByIdAndRemove(req.params.id, function(error, removedCampground){
        if(error){
            res.redirect("/campgrounds");
        }
        else{
            Comment.deleteMany( {_id: { $in: removedCampground.comments } }, (err) => {
            if (err) {
                res.redirect("/campgrounds");
            }
            req.flash("success", "Campground deleted");
            res.redirect("/campgrounds");
            });
        }
    })
})

module.exports = router;