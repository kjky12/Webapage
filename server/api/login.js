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
//router.post("/login",
router.post("/",
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
            next();
        } else {
            req.flash("errors", errors);
            res.redirect("/login");
        }
        console.log("TEST2-6");
    },

    passport.authenticate('local-login'), function (req, res) {

        // config/passport.js에서 설정한 패스포트 미들웨어 로직이 수행된다.
        // 인증을 성공하면 200코드를 반환, 실패시 401, Unauthorized를 자동으로 반환한다.
        console.log("전송!!");
        //res.send({success : true});
        res.json({ success: true });

        //res.send(200);
        //res.sendStatus(200);

        
    }

);



// Logout // 4
router.get("/logout", function (req, res) {
    req.logout();
    res.redirect("/");
});




module.exports = router;