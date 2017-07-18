const express = require("express");
const router = express.Router();

const ensureAuthenticated = (req, res, next) => {
    if(req.isAuthenticated()){
        return next();
    }else{
        req.flash("error_msg", "You are not logged in");
        res.redirect("/users/login");
    }
};

router.get("/", ensureAuthenticated, (req, res) => {
    res.render("index");
});

module.exports = router;