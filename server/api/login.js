var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require("../config/passport"); // 1


// Login // 2
router.get("/",
    function (req, res) {
        console.log("TEST1");
        var username = req.flash("username")[0];
        console.log("TEST1-1");
        var errors = req.flash("errors")[0] || {};
        console.log("TEST1-2");
        //res.render("home/login", {username: username, errors: errors });
        //res.json({ success: true, data: {username: username, errors: errors } });
    }
);




// Post Login // 3
router.post("/login",
    function (req, res, next) {
        console.log("TEST2");
        var errors = {};
        var isValid = true;
        console.log("TEST2-1");
        if (!req.body.username) {
            isValid = false;
            errors.username = "Username is required!";
        }
        console.log("TEST2-2");
        if (!req.body.password) {
            isValid = false;
            errors.password = "Password is required!";
        }
        console.log("TEST2-3");

        if (isValid) {
            console.log("TEST2-5");
            next();
        } else {
            console.log("TEST2-4");
            req.flash("errors", errors);
            res.redirect("/login");
        }
        console.log("TEST2-6");
    },

    //! 지금 성공까지 됬어 [20180206 kjky12] 여기서 뭔가 추후로 처리를 해줘야함... 로그인 됬을때의 차이
    passport.authenticate("local-login", {
        successRedirect: "/",
        failureRedirect: "/login"
    })

);



// Logout // 4
router.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
});




module.exports = router;