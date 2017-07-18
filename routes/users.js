const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const express = require("express");
const router = express.Router();
const User = require("../db").User;


router.get("/register", (req, res) => {
    res.render("register");
});

router.get("/login", (req, res) => {
    res.render("login");
});

passport.use(new LocalStrategy( (username, password, done) => {
    User.getUserByUsername(username, (err, user) => {
        if(err) throw err;
        if(!user){
            return done(null, false, {message: "Unknown user."});
        }
        User.comparePassword(password, user.password, (err, isMatch) => {
            if(err) throw err;
            if(isMatch){
                return done(null, user);
            }else{
                return done(null, false, {message: "Invalid password."});
            }
        });
    });
}));

passport.serializeUser( (user, done) => {
    done(null, user.id);
});

passport.deserializeUser((id, done) => {
    User.getUserById(id, (err, user) => {
        done(err, user);
    });
});


router.post("/login", passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/login",
    failureFlash: true
}), (req, res) => {
    res.redirect("/");
});

router.post("/register", (req, res) => {

    const { username, password, password2, email, name} = req.body;

    //Validation
    req.checkBody('name', 'Name is required').notEmpty();
    req.checkBody('password', 'Password is required').notEmpty();
    req.checkBody('password2', 'Passwords do not match.').equals(password);
    req.checkBody('email', 'Email is required').notEmpty();
    req.checkBody('username', 'Username is required').notEmpty();

    const errors = req.validationErrors();

    if(errors){
        res.render("register", { errors });
    }else{
        const newUser = new User({ name, password, email, username});
        User.createUser(newUser, (err, user)=>{
            if(err) throw err;
        });
        req.flash("success_msg", "You are registered and can now login.");
        res.redirect("/users/login");
    }
});



router.get("/logout", (req, res) => {
    req.logout();
    req.flash("success_msg", "You are logged out.");
    res.redirect("/users/login");
});

module.exports = router;
